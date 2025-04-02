import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { debounceTime, Observable, Subject } from 'rxjs';
import { BrandsService } from '../../services/brands.service';
import { LoadingService } from '../../../../../services/loading.service';
import { SharedModule } from '../../../../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { BrandsFormComponent } from '../form/brands-form.component';
import {
  CallToAction,
  Column,
} from '../../../../../interfaces/table.interface';
import { Brand } from '../../models/brands.model';
import { PaginatorState } from 'primeng/paginator';

@Component({
  selector: 'app-roles',
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss',
  standalone: true,
  imports: [CommonModule, ConfirmDialogModule, ToastModule, SharedModule],
  providers: [ConfirmationService, MessageService],
})
export class BrandListComponent implements OnInit, OnDestroy {
  brandModal: DynamicDialogRef | undefined;
  columns: Column[] = [];
  cellToAction: any;
  data: any[] = [];
  limit: number = 10;
  page: number = 1;
  name: string = '';
  callToAction: CallToAction<Brand>[] = [
    {
      type: 'button',
      size: 'small',
      icon: 'pi pi-pencil',
      outlined: true,
      pTooltip: 'Editar',
      tooltipPosition: 'bottom',
      click: (rowData: Brand) => this.buttonEditBrand(rowData.id),
    },
    {
      type: 'button',
      size: 'small',
      icon: 'pi pi-trash',
      outlined: true,
      pTooltip: 'Eliminar',
      tooltipPosition: 'bottom',
      click: (rowData: Brand, event?: Event) =>
        this.buttonDeleteRole(rowData.id, event!),
    },
  ];

  private searchTermSubject = new Subject<string>();
  loading: boolean = true;

  constructor(
    private readonly dialogService: DialogService,
    private readonly brandsService: BrandsService,
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

    this.getBrands(this.limit, this.page, this.name);
    this.searchTermSubject.pipe(debounceTime(600)).subscribe(() => {
      this.loadingService.sendLoadingState(true);
      this.getBrands(this.limit, this.page, this.name);
    });
  }

  ngOnDestroy(): void {
    if (this.brandModal) {
      this.brandModal.close();
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

  async getBrands(
    limit = this.limit,
    page = this.page,
    name = this.name,
  ): Promise<void> {
    this.updatePage(page);
    this.brandsService.callGetList(limit, page, name).subscribe();
    setTimeout(() => {
      this.loadingService.sendLoadingState(false);
    }, 600);
  }

  get brands(): Observable<Brand[]> {
    return this.brandsService.getList();
  }

  get total(): Observable<number> {
    return this.brandsService.getTotal();
  }

  async onPageSelected(event: PaginatorState) {
    this.updatePage((event.page ?? 0) + 1);
    this.getBrands(event.rows, this.page);
  }

  buttonAddBrand(): void {
    this.brandModal = this.dialogService.open(BrandsFormComponent, {
      data: {},
      header: 'Crear',
    });

    this.brandModal.onClose.subscribe({
      next: value => {
        value && value?.success
          ? this.showSuccess(value.message)
          : value?.error
            ? this.showError(value?.error)
            : null;
      },
    });
  }

  buttonEditBrand(id: number): void {
    this.brandModal = this.dialogService.open(BrandsFormComponent, {
      data: {
        id,
      },
      header: 'Editar',
    });

    this.brandModal.onClose.subscribe({
      next: value => {
        if (value.status === 200) {
          this.getBrands(this.limit, this.page, this.name);
          this.showSuccess('Marca actualizada.');
        }
      },
    });
  }

  buttonDeleteRole(id: number, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Deseas eliminar esta Marca?',
      header: 'Eliminar marca',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',
      acceptIcon: 'none',
      rejectIcon: 'none',

      accept: () => {
        this.brandsService.spinner1.show();

        this.brandsService.delete(id).subscribe(() => {
          this.brandsService.spinner1.hide();
          this.showSuccess('La marca ha sido eliminada');
        });
      },
      reject: () => {
        this.brandsService.spinner1.hide();
        this.showError('No se eliminó la marca, intentelo nuevamente');
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
