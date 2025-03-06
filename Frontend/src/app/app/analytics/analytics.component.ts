import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { AnalyticsService } from '../../shared/services/analytics/analytics.service';
import { CategoryService } from '../../shared/services/category/category.service';
import { Category } from '../../shared/models/category';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatSelectModule, MatIconModule, FormsModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
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
    trigger('productAnimation', [
      transition(':enter', [
        style({ transform: 'scale(0.9)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
      ])
    ])
  ]
})
export class AnalyticsComponent {
  private analyticsService = inject(AnalyticsService);
  private categoryService = inject(CategoryService);

  productCountByCategory: { id: number; name: string; productCount: number }[] = [];
  mostViewedProduct: any = null;
  mostViewedByCategory: any = null;
  categories: Category[] = [];
  selectedCategoryId: number | null = null;

  ngOnInit() {
    this.loadAnalytics();
    this.categoryService.getCategories().subscribe(categories => this.categories = categories);
  }

  loadAnalytics() {
    this.analyticsService.getProductCountByCategory().subscribe(data => this.productCountByCategory = data);
    this.analyticsService.getMostViewedProduct().subscribe(product => this.mostViewedProduct = product);
  }

  onCategoryChange() {
    if (this.selectedCategoryId) {
      this.analyticsService.getMostViewedProductByCategory(this.selectedCategoryId)
        .subscribe(product => this.mostViewedByCategory = product);
    } else {
      this.mostViewedByCategory = null;
    }
  }
}