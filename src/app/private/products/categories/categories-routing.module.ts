import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryListComponent } from './pages/list/categories.component';

const routes: Routes = [
  { path: '', component: CategoryListComponent },
  { path: '', pathMatch: 'full', redirectTo: 'categories' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriesRoutingModule {}
