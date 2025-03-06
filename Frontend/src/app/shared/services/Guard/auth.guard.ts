// import { Injectable } from '@angular/core';
// import { CanActivate, Router } from '@angular/router';
// import { AuthService } from '../Auth/auth.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthGuard implements CanActivate {
//   constructor(private authService: AuthService, private router: Router) {}

//   canActivate(): boolean {
//     if (this.authService.isLoggedIn()) { // Use public method
//       return true;
//     }
//     this.router.navigate(['/auth/login']);
//     return false;
//   }
// }



import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Auth/auth.service';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/auth/login']);
    return false;
  }

  const requiredRoles = route.data['roles'] as string[];
  if (requiredRoles) {
    const user = authService.getCurrentUser();
    if (!user || !requiredRoles.includes(user.role)) {
      router.navigate(['/app/home']);
      return false;
    }
  }

  return true;
};