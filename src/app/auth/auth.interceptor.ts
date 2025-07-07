import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  //console.log('Interceptor: Token', token);

  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
      withCredentials: true
    });
    //console.log('Interceptor: Auth header attached');
    return next(authReq);
  }

  console.warn('No token found, skipping auth header');
  return next(req);
};

