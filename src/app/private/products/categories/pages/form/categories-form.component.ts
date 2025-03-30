import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../models/categories.model';

@Component({
  selector: 'app-roles-form',
  templateUrl: './categories-form.component.html',
  styleUrl: './categories-form.component.scss',
})
export class CategoriesFormComponent implements OnInit {
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly categoriesService: CategoriesService,
    private readonly dialogRef: DynamicDialogRef,
    private readonly dynamicDialogConfig: DynamicDialogConfig,
  ) {}
  form: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
  });

  ngOnInit(): void {
    if (this.dynamicDialogConfig.data.id) {

      const id      = this.dynamicDialogConfig.data.id;
      
      this.categoriesService.getOne(id).subscribe({
        next: (response: Category) => {
          this.form.patchValue(response);
          this.categoriesService.spinner1.hide();
        },
        error: () => {
        },
      
      });
    } else {
    }
  }

  buttonSaveCategory() {
    if(!this.form) return;

    this.categoriesService.spinner1.show();
    const category = new Category(this.form.value);

    if (this.dynamicDialogConfig.data.id) {

        const id = this.dynamicDialogConfig.data.id;
        this.categoriesService.edit(id, category).subscribe({
          next: (res)   => this.dialogRef.close(res),
          error: (res)  => {
            if(res.status === 422){
              const errors  = res.error.errors;
              this.handleValidationErrors(errors); 
              this.categoriesService.spinner1.hide();
            }
          },
        });
        return;
    } 
     
    this.categoriesService.create(category).subscribe({
      next: (res)   => {
          this.dialogRef.close(res);
          this.categoriesService.spinner1.hide();
      },
      error: (res)  => {
        if(res.status === 422){
          const errors  = res.error.errors;
          this.handleValidationErrors(errors); 
          this.categoriesService.spinner1.hide();
        }  
      },
    }); 
  }

  handleValidationErrors(errors: any) {
    Object.keys(errors).forEach((field) => {
      const control = this.form.get(field);
      if (control) {
        control.setErrors({ backend: errors[field][0] }); 
      }
    });
  }

}
