import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { Product } from '../../../shared/models/product';
import { Category } from '../../../shared/models/category';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-product-edit-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    FormsModule
  ],
  templateUrl: './product-edit-dialog.component.html',
  styleUrls: ['./product-edit-dialog.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 }))
      ])
    ]),
    trigger('formAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0.9)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ]
})
export class ProductEditDialogComponent {
  product: Omit<Product, 'id' | 'categoryName' | 'viewCount'>;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { product: Product; categories: Category[] },
    private dialogRef: MatDialogRef<ProductEditDialogComponent>
  ) {
    this.product = { ...data.product }; // Shallow copy to avoid modifying original
  }

  get categories(): Category[] {
    return this.data.categories;
  }

  onSave() {
    this.dialogRef.close(this.product);
  }

  onCancel() {
    this.dialogRef.close();
  }
}