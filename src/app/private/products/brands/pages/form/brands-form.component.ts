import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BrandsService } from '../../services/brands.service';
import { Brand } from '../../models/brands.model';
import { ReactiveFormsModule } from '@angular/forms';

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

      this.loading  = true;
      const id      = this.dynamicDialogConfig.data.id;
      
      this.brandsService.getOne(id).subscribe({
        next: (response: Brand) => {
          this.form.patchValue(response);
          this.loading = false;
        },
        error: () => {
        },
      
      });
    } else {
    }
  }

  buttonSaveBrand() {
    if (this.form) {
      const brand = new Brand(this.form.value);
      if (this.dynamicDialogConfig.data.id) {
        const id = this.dynamicDialogConfig.data.id;
        this.brandsService.edit(id, brand).subscribe({
          next: () => this.dialogRef.close(),
          error: () => this.dialogRef.close(),
        });
      } else {
        this.brandsService.create(brand).subscribe({
          next: () => this.dialogRef.close(),
          error: () => this.dialogRef.close(),
        });
      }
    }
  }
}
