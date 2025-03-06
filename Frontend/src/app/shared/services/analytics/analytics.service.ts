import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Product } from '../../models/product';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = `${environment.apiUrl}/Analytics`;

  constructor(private http: HttpClient) {}

  getProductCountByCategory(): Observable<{ id: number; name: string; productCount: number }[]> {
    return this.http.get<{ id: number; name: string; productCount: number }[]>(`${this.apiUrl}/product-count-by-category`);
  }

  getMostViewedProduct(): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/most-viewed`);
  }

  getMostViewedProductByCategory(categoryId: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/most-viewed-by-category/${categoryId}`);
  }
}