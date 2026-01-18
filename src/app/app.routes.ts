// import { Routes } from '@angular/router';

// export const routes: Routes = [
//   {
//     path: '',
//     loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
//   },
//   {
//     path: 'login',
//     loadComponent: () => import('./login/login.page').then( m => m.LoginPage)
//   },
// ];

import { Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',   // 👈 default goes to login
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then(m => m.LoginPage),
  },
  {
    path: 'tabs',
     canActivate: [AuthGuard],   // 👈 protect tabs
    loadChildren: () =>
      import('./tabs/tabs.routes').then((m) => m.routes),
  },
  // {
  //   path: 'add-menu',
  //   // canActivate: [AuthGuard], 
  //   loadComponent: () => import('./add-menu/add-menu.page').then( m => m.AddMenuPage)
  // },
  // {
  //   path: 'profit-loss',
  //   // canActivate: [AuthGuard], 
  //   loadComponent: () => import('./profit-loss/profit-loss.page').then( m => m.ProfitLossPage)
  // },

];
