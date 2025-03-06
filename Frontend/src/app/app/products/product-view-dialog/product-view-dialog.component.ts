import { Component, inject, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ProductService } from '../../../shared/services/product/product.service';
import { Product } from '../../../shared/models/product';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-product-view-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinner
  ],
  templateUrl: './product-view-dialog.component.html',
  styleUrls: ['./product-view-dialog.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 }))
      ])
    ]),
    trigger('cardAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0.9)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ]
})
export class ProductViewDialogComponent {
  product: Product | null = null;
  private productService = inject(ProductService);
  private snackBar = inject(MatSnackBar);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { productId: number },
    private dialogRef: MatDialogRef<ProductViewDialogComponent>
  ) {
    this.loadProduct();
  }

  loadProduct() {
    this.productService.getProduct(this.data.productId).subscribe({
      next: (product) => this.product = product,
      error: () => {
        this.snackBar.open('Failed to load product details', 'Close', { duration: 3000 });
        this.dialogRef.close();
      }
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}