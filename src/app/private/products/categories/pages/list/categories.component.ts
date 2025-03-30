import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, Observable, Subject } from 'rxjs';
import { CategoriesService } from '../../services/categories.service';
import { LoadingService } from '../../../../../services/loading.service';
import { SharedModule } from '../../../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CategoriesFormComponent } from '../form/categories-form.component';
import {
  CallToAction,
  Column,
} from '../../../../../interfaces/table.interface';
import { Category } from '../../models/categories.model';
import { PaginatorState } from 'primeng/paginator';


@Component({
  selector: 'app-roles',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  standalone: true,
  imports: [CommonModule, ConfirmDialogModule, ToastModule, SharedModule],
  providers: [ConfirmationService, MessageService],
})
export class CategoryListComponent implements OnInit, OnDestroy {
  categoryModal: DynamicDialogRef | undefined;
  columns: Column[] = [];
  cellToAction: any;
  data: any[] = [];
  limit: number = 10;
  page: number = 1;
  name: string = '';
  callToAction: CallToAction<Category>[] = [
    {
      type: 'button',
      size: 'small',
      icon: 'pi pi-pencil',
      outlined: true,
      pTooltip: 'Editar',
      tooltipPosition: 'bottom',
      click: (rowData: Category) => this.buttonEditCategory(rowData.id),
    },
    {
      type: 'button',
      size: 'small',
      icon: 'pi pi-trash',
      outlined: true,
      pTooltip: 'Eliminar',
      tooltipPosition: 'bottom',
      click: (rowData: Category, event?: Event) =>
        this.buttonDeleteCategory(rowData.id, event!),
    },
  ];

  private searchTermSubject = new Subject<string>();
  loading: boolean = true;


  constructor(
    private readonly dialogService: DialogService,
    private readonly categoriesService: CategoriesService,
    public messageService: MessageService,
    private confirmationService: ConfirmationService,
    private loadingService: LoadingService,
  ) {}

  ngOnInit(): void {
    this.columns = [
      {
        header: '#',
        field: 'id',
        clickable: false,
        image: false,
        money: false,
      },
      {
        header: 'Marca',
        field: 'name',
        clickable: false,
        image: false,
        money: false,
      },
      {
        field: 'button',
        header: 'Acción',
        clickable: false,
        image: false,
        money: false,
      },
    ];

    this.getCategories(this.limit, this.page, this.name);
    this.searchTermSubject.pipe(debounceTime(600)).subscribe(() => {
      this.loadingService.sendLoadingState(true);
      this.getCategories(this.limit, this.page, this.name);
    });
  }

  ngOnDestroy(): void {
    if (this.categoryModal) {
      this.categoryModal.close();
    }
  }

  clearFilter(): void {
    this.name = '';
    this.onSearchTermChange('');
  }

  private updatePage(value: number): void {
    this.page = value;
  }

  onSearchTermChange(term: any): void {
    this.searchTermSubject.next(term);
  }

  async getCategories(
    limit = this.limit,
    page = this.page,
    name = this.name,
  ): Promise<void> {
 
    this.categoriesService.callGetList(limit, page, name).subscribe();
    setTimeout(() => {
      this.loadingService.sendLoadingState(false);
    }, 600);

  }

  get categories(): Observable<Category[]> {
    return this.categoriesService.getList();
  }

  get total(): Observable<number> {
    return this.categoriesService.getTotal();
  }

  async onPageSelected(event: PaginatorState) {
    this.updatePage((event.page ?? 0) + 1);
    this.getCategories(event.rows, this.page);
  }

  buttonAddCategory(): void {
    this.categoryModal = this.dialogService.open(CategoriesFormComponent, {
      data: {},
      header: 'Crear',
    });

    this.categoryModal.onClose.subscribe({
      next: async value => {

        await this.getCategories(this.limit, this.page, this.name);
        if(value)this.showSuccess('Categoría Creada.');
        
      },
    });
  }

  buttonEditCategory(id: number): void {

    this.categoriesService.spinner1.show();
    
    this.categoryModal = this.dialogService.open(CategoriesFormComponent, {
      data: {
        id,
      },
      header: 'Editar',
    });

    this.categoryModal.onClose.subscribe({
      next: async  value => {
        
        if(value.status === 200){
          this.getCategories(this.limit, this.page, this.name);
          this.categoriesService.spinner1.hide();
          this.showSuccess('Categoría actualizada.');
          this.categoriesService.spinner1.hide();
        }
        
      },
    });
  }

  buttonDeleteCategory(id: number, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseas eliminar esta Categoría?',
      header: 'Eliminar categoría',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.categoriesService.spinner1.show();
        this.categoriesService.delete(id).subscribe(() => {
          this.categoriesService.spinner1.hide();
          this.showSuccess('La categoría ha sido eliminada');
        });
      },
      reject: () => {
        this.categoriesService.spinner1.hide();
        this.showError('No se eliminó la categoría, intentelo nuevamente');
      },
    });
  }

  showSuccess(message: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Confirmado',
      detail: message,
      life: 3000,
    });
  }

  showError(message: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 3000,
    });
  }
}
