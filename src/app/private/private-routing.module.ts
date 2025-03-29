import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    title: 'Home',
    data: { breadcrumb: 'Home' },
    loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
  },
  {
    path: 'profile',
    title: 'Profile',
    data: { breadcrumb: 'Profile' },
    loadChildren: () =>
      import('./profile/profile.module').then(m => m.ProfileModule),
  },
  {
    path: 'administration',
    title: 'Administración',
    data: { breadcrumb: 'Administración' },
    loadChildren: () =>
      import('./administration/administration.module').then(
        m => m.AdministrationModule,
      ),
  },
  {
    path: 'products',
    title: 'Productos',
    data: { breadcrumb: 'Productos' },
    loadChildren: () =>
      import('./products/products.module').then(
        m => m.ProductsModule,
      ),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
    data: { breadcrumb: 'Home' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivateRoutingModule {}
