import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BrandsService } from '../../services/brands.service';
import { Brand } from '../../models/brands.model';

@Component({
  selector: 'app-roles-form',
  templateUrl: './brands-form.component.html',
  styleUrl: './brands-form.component.scss',
})
export class BrandsFormComponent implements OnInit {
  loading: boolean = false;
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly brandsService: BrandsService,
    private readonly dialogRef: DynamicDialogRef,
    private readonly dynamicDialogConfig: DynamicDialogConfig,
  ) {}
  form: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
  });

  ngOnInit(): void {
    if (this.dynamicDialogConfig.data.id) {
      this.loading = true;
      const id = this.dynamicDialogConfig.data.id;

      this.brandsService.getOne(id).subscribe({
        next: (response: Brand) => {
          this.form.patchValue(response);
          this.loading = false;
        },
        error: () => {},
      });
    }
  }

  buttonSaveBrand() {
    if (!this.form) return;

    this.brandsService.spinner1.show();

    const brand = new Brand(this.form.value);
    if (this.dynamicDialogConfig.data.id) {
      const id = this.dynamicDialogConfig.data.id;
      this.brandsService.edit(id, brand).subscribe({
        next: res => {
          this.dialogRef.close(res);
          this.brandsService.spinner1.hide();
        },
        error: res => {
          if (res.status === 422) {
            const errors = res.error.errors;
            this.handleValidationErrors(errors);
            this.brandsService.spinner1.hide();
          }
        },
      });

      return;
    }

    this.brandsService.create(brand).subscribe({
      next: (res: any) => {
        this.dialogRef.close({ message: res.message });
        this.brandsService.spinner1.hide();
      },
      error: (res: any) => {
        console.log(res);
        if (res.status === 422) {
          const errors = res.error.errors;
          this.handleValidationErrors(errors);
          this.brandsService.spinner1.hide();
        }
      },
    });
  }

  handleValidationErrors(errors: any) {
    Object.keys(errors).forEach(field => {
      const control = this.form.get(field);
      if (control) {
        control.setErrors({ backend: errors[field][0] });
      }
    });
  }

  get formValid() {
    return this.form.valid;
  }
}
