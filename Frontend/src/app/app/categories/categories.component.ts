import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { CategoryService } from '../../shared/services/category/category.service';
import { Category } from '../../shared/models/category';
import { MatSnackBar } from '@angular/material/snack-bar';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    MatCardModule
  ],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
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
    trigger('rowAnimation', [
      transition(':enter', [
        style({ transform: 'translateX(-20px)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ])
  ]
})
export class CategoriesComponent {
  private categoryService = inject(CategoryService);
  private snackBar = inject(MatSnackBar);

  categories: Category[] = [];
  displayedColumns: string[] = ['id', 'name', 'actions'];
  newCategoryName = '';

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(categories => this.categories = categories);
  }

  addCategory() {
    this.categoryService.createCategory(this.newCategoryName).subscribe({
      next: () => {
        this.loadCategories();
        this.newCategoryName = '';
        this.snackBar.open('Category added successfully', 'Close', { duration: 3000 });
      },
      error: () => this.snackBar.open('Failed to add category', 'Close', { duration: 3000 })
    });
  }

  updateCategory(category: Category) {
    this.categoryService.updateCategory(category.id, category.name).subscribe({
      next: () => this.snackBar.open('Category updated successfully', 'Close', { duration: 3000 }),
      error: () => this.snackBar.open('Failed to update category', 'Close', { duration: 3000 })
    });
  }

  deleteCategory(id: number) {
    this.categoryService.deleteCategory(id).subscribe({
      next: () => {
        this.loadCategories();
        this.snackBar.open('Category deleted successfully', 'Close', { duration: 3000 });
      },
      error: () => this.snackBar.open('Failed to delete category', 'Close', { duration: 3000 })
    });
  }
}