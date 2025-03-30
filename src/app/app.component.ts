import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppLayoutModule } from './layout/app.layout.module';
import { ProgressSpinnerService } from './services/progress-spinner.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SharedModule } from './shared/shared.module';
import { Spinner1Service } from './services/spinner1.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    AppLayoutModule,
    HttpClientModule,
    ProgressSpinnerModule,
    SharedModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  showSpinner1 = this.spinnerService.spinner$;

  constructor(
    private readonly progressSpinnerService: ProgressSpinnerService,
    private spinnerService: Spinner1Service
  ) {}

  get showSpinner(): Observable<boolean> {
    return this.progressSpinnerService.loading$;
  }

}
