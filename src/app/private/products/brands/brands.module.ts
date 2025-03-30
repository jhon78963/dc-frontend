import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandsRoutingModule } from './brands-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { DialogService } from 'primeng/dynamicdialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TabViewModule } from 'primeng/tabview';
import { TreeModule } from 'primeng/tree';
import { TreeTableModule } from 'primeng/treetable';
import { TabMenuModule } from 'primeng/tabmenu';
import { BrandsFormComponent } from './pages/form/brands-form.component';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [BrandsFormComponent],
  imports: [
    CommonModule,
    BrandsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ToastModule,
    ConfirmDialogModule,
    TabViewModule,
    TreeModule,
    TreeTableModule,
    TabMenuModule,
    ProgressSpinnerModule, 
    HttpClientModule
  ],
  providers: [DialogService],
})
export class BrandsModule {}
