import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'brands',
    title: 'Marcas',
    data: { breadcrumb: 'Marcas' },
    loadChildren: () =>
      import('./brands/brands.module').then(m => m.BrandsModule),
  },
  {
    path: 'categories',
    title: 'Categorías',
    data: { breadcrumb: 'Categorías' },
    loadChildren: () =>
      import('./categories/categories.module').then(m => m.CategoriesModule),
  },
  { path: '', pathMatch: 'full', redirectTo: 'brands' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
