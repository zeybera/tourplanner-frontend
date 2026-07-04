import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  if (authService.isLoggedIn()) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authService.token()}`,
      },
    });
    return next(authReq);
  }

  return next(req);
};
