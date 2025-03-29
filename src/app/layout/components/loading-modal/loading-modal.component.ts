import { Component } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner'; 

@Component({
  selector: 'app-loading-modal',
  standalone: true, 
  imports: [ProgressSpinnerModule], 
  templateUrl: './loading-modal.component.html',
  styleUrls: ['./loading-modal.component.scss']
})
export class LoadingModalComponent {}
