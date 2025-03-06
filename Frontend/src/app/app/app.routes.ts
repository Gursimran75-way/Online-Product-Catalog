import { Routes } from '@angular/router';
import { AuthGuard } from '../shared/services/Guard/auth.guard';

export const APP_ROUTES: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile.component').then((m) => m.ProfileComponent),
  },
  {
    path: 'products',
    loadComponent: () =>
      import('./products/products.component').then((m) => m.ProductsComponent),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('./categories/categories.component').then(
        (m) => m.CategoriesComponent
      ),
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] },
  },
  {
    path: 'analytics',
    loadComponent: () =>
      import('./analytics/analytics.component').then(
        (m) => m.AnalyticsComponent
      ),
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] },
  },
  {
    path: 'import-products',
    loadComponent: () =>
      import('./import-products/import-products.component').then(
        (m) => m.ImportProductsComponent
      ),
    canActivate: [AuthGuard],
    data: { roles: ['Admin'] },
  },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
];
