import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WarehouseFormItem, WarehouseItem } from '../core/models/warehouseItem';
import { environment } from 'src/environments/environment';
import { map, Observable } from 'rxjs';
import { ProductDto } from '../core/models/product.dto';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getProducts(): Observable<WarehouseItem[]> {
    return this.http
      .get<ProductDto[]>(this.baseUrl)
      .pipe(map((dtos) => dtos.map((dto) => this.mapProductDtoToWarehouseItem(dto))));
  }

  createProduct(warehouseItem: WarehouseFormItem): Observable<WarehouseItem> {
    return this.http
      .post<WarehouseItem>(this.baseUrl, warehouseItem)
      .pipe(map((dto) => this.mapProductDtoToWarehouseItem(dto)));
  }

  deleteProduct(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${productId}`);
  }

  updateProduct(productId: number, warehouseItem: WarehouseFormItem): Observable<WarehouseItem> {
    return this.http
      .put<WarehouseItem>(`${this.baseUrl}/${productId}`, warehouseItem)
      .pipe(map((dto) => this.mapProductDtoToWarehouseItem(dto)));
  }

  private mapProductDtoToWarehouseItem(dto: ProductDto): WarehouseItem {
    return {
      ...dto,
      description: 'No description available',
      imageUrl: 'assets/logo_black.svg',
    };
  }
}
