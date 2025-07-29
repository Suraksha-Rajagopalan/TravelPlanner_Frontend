import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getJwtToken();

  let authReq = req;

  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      },
      withCredentials: true
    });
  } else {
    authReq = req.clone({
      withCredentials: true
    });
  }

  return next(authReq).pipe(
    catchError(error => {
      if (error.status === 401 && !req.url.includes('/Token/refresh')) { // 🔐 prevent recursion
        return authService.refreshToken().pipe(
          switchMap(() => {
            const refreshedToken = authService.getJwtToken();
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${refreshedToken}`
              },
              withCredentials: true
            });
            return next(retryReq);
          }),
          catchError(() => {
            authService.logout();
            return throwError(() => new Error('Session expired. Please login again.'));
          })
        );
      }

      return throwError(() => error);
    })
  );
};
