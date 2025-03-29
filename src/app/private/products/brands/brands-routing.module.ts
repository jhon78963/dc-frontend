import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrandListComponent } from './pages/list/brands.component';

const routes: Routes = [
  { path: '', component: BrandListComponent },
  { path: '', pathMatch: 'full', redirectTo: 'brands' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrandsRoutingModule {}
