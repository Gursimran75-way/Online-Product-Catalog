import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductService } from '../../shared/services/product/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-import-products',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './import-products.component.html',
  styleUrls: ['./import-products.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class ImportProductsComponent {
  selectedFile: File | null = null;
  private productService = inject(ProductService);
  private snackBar = new MatSnackBar(); // Adjust to your DI method

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  importProducts() {
    if (this.selectedFile) {
      this.productService.importProducts(this.selectedFile).subscribe({
        next: () => {
          this.snackBar.open('Products imported successfully', 'Close', { duration: 3000 });
          this.selectedFile = null;
        },
        error: () => this.snackBar.open('Failed to import products', 'Close', { duration: 3000 })
      });
    }
  }
}