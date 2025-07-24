import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, switchMap } from 'rxjs/operators';
import { throwError, of } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = localStorage.getItem('jwtToken');

  let authReq = req;
  if (token) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401 && localStorage.getItem('refreshToken')) {
        // Try refreshing the token
        return authService.refreshToken().pipe(
          switchMap((res) => {
            localStorage.setItem('jwtToken', res.accessToken);
            const retryReq = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${res.accessToken}`)
            });
            return next(retryReq);
          }),
          catchError(() => {
            authService.logout();
            return throwError(() => new Error('Session expired. Please log in again.'));
          })
        );
      }

      return throwError(() => error);
    })
  );
};
