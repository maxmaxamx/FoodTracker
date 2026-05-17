import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.checkAuth().pipe(
        map((res) => {
            return res.authorized ? true : router.createUrlTree(['/']);
        }),
        catchError(() => {
            return of(router.createUrlTree(['/']));
        })
    );
};

export const nonAuthGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    return authService.checkAuth().pipe(
        map((res) => {
            return res.authorized ? router.createUrlTree(['/authorized']) : true;
        }),
        catchError(() => {
            return of(true);
        })
    );
};