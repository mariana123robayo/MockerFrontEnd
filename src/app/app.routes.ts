import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'schemas', pathMatch: 'full' },
  {
    path: 'schemas',
    loadComponent: () =>
      import('./scheme/pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'simulations',
    loadComponent: () =>
      import('./simulation/pages/home/home.component').then(
        (m) => m.HomeComponent
      ),
  },
  {
    path: 'simulation/:id',
    loadComponent: () =>
      import('./log/pages/home-page/home-page.component').then(
        (m) => m.HomePageComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'schemas',
  },
];
