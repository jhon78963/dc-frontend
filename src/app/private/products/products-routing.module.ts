import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  
  {
    path: 'brands',
    title: 'Marcas',
    data: { breadcrumb: 'Marcas' },
    loadChildren: () => import('./brands/brands.module').then(m => m.BrandsModule),
  },
  { path: '', pathMatch: 'full', redirectTo: 'brands' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
