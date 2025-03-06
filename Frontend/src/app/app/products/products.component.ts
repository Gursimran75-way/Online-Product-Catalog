import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../shared/services/product/product.service';
import { CategoryService } from '../../shared/services/category/category.service';
import { AuthService } from '../../shared/services/Auth/auth.service';
import { Product } from '../../shared/models/product';
import { Category } from '../../shared/models/category';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductEditDialogComponent } from './edit-profile-dialog/product-edit-dialog.component.ts';
import { ProductDeleteDialogComponent } from './confirm-delete-dialog/confirm-delete-dialog.component';
import { ProductViewDialogComponent } from './product-view-dialog/product-view-dialog.component';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    FormsModule,
    ProductEditDialogComponent,
    ProductDeleteDialogComponent,
    ProductViewDialogComponent
  ],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 }))
      ])
    ]),
    trigger('cardAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(20px)', opacity: 0 }),
        animate('500ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ])
    ]),
    trigger('slideInOut', [
      state('in', style({ height: '*', opacity: 1 })),
      state('out', style({ height: '0px', opacity: 0, overflow: 'hidden' })),
      transition('out => in', [
        style({ height: '0px', opacity: 0 }),
        animate('300ms ease-in', style({ height: '*', opacity: 1 }))
      ]),
      transition('in => out', [
        animate('300ms ease-out', style({ height: '0px', opacity: 0 }))
      ])
    ])
  ]
})
export class ProductsComponent {
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  products: Product[] = [];
  filteredProducts: Product[] = [];
  categories: Category[] = [];
  searchTerm = '';
  selectedCategoryId: number | null = null;
  newProduct: Omit<Product, 'id' | 'categoryName' | 'viewCount'> = { name: '', price: 0, categoryId: 0, image: '' };
  isAdmin = false;
  showAddForm = false; // Toggle flag

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
    this.authService.user$.subscribe(user => this.isAdmin = user?.role === 'Admin');
  }

  loadProducts() {
    this.productService.getProducts().subscribe(products => {
      this.products = products;
      this.applyFilters();
    });
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(categories => this.categories = categories);
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase()) &&
      (!this.selectedCategoryId || product.categoryId === this.selectedCategoryId)
    );
  }

  onSearchChange() {
    this.applyFilters();
  }

  onCategoryChange() {
    this.applyFilters();
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }

  addProduct() {
    this.productService.createProduct(this.newProduct).subscribe({
      next: () => {
        this.loadProducts();
        this.newProduct = { name: '', price: 0, categoryId: 0, image: '' };
        this.showAddForm = false; // Hide form after adding
        this.snackBar.open('Product added successfully', 'Close', { duration: 3000 });
      },
      error: () => this.snackBar.open('Failed to add product', 'Close', { duration: 3000 })
    });
  }

  editProduct(product: Product) {
    const dialogRef = this.dialog.open(ProductEditDialogComponent, {
      width: '450px',
      data: { product, categories: this.categories }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.updateProduct(product.id, result).subscribe({
          next: () => {
            this.loadProducts();
            this.snackBar.open('Product updated successfully', 'Close', { duration: 3000 });
          },
          error: () => this.snackBar.open('Failed to update product', 'Close', { duration: 3000 })
        });
      }
    });
  }

  deleteProduct(id: number) {
    const dialogRef = this.dialog.open(ProductDeleteDialogComponent, {
      width: '300px',
      data: { message: 'Are you sure you want to delete this product?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.productService.deleteProduct(id).subscribe({
          next: () => {
            this.loadProducts();
            this.snackBar.open('Product deleted successfully', 'Close', { duration: 3000 });
          },
          error: () => this.snackBar.open('Failed to delete product', 'Close', { duration: 3000 })
        });
      }
    });
  }

  viewProduct(id: number) {
    const dialogRef = this.dialog.open(ProductViewDialogComponent, {
      width: '400px',
      data: { productId: id }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadProducts();
    });
  }
}