import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getJwtToken(); // Get current JWT token

  let authReq = req;

  // If token exists, add it to the Authorization header
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
      // If 401 Unauthorized and not the refresh endpoint, try refreshing the token
      if (error.status === 401 && !req.url.includes('/refresh')) {
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

      // If not a 401 or refresh fails
      return throwError(() => error);
    })
  );
};
