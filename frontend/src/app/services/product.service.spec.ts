import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ProductService } from './product.service';
import { environment } from 'src/environments/environment';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should map data on create', (done) => {
    const productToCreate = { name: 'Test Product', unitPrice: 5.99, quantity: 50 };
    const mockResponse = { ...productToCreate, id: 1 };
    const expectedProduct = {
      ...mockResponse,
      imageUrl: 'assets/logo_black.svg',
      description: 'No description available',
    };

    service.createProduct(productToCreate).subscribe((product) => {
      expect(product).toEqual(expectedProduct);
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(productToCreate);

    req.flush(mockResponse);
  });

  it('should map data on update', (done) => {
    const id = 1;
    const productToUpdate = { name: 'Updated Product', unitPrice: 6.99, quantity: 60 };
    const mockResponse = { id, ...productToUpdate };
    const expectedProduct = {
      ...mockResponse,
      imageUrl: 'assets/logo_black.svg',
      description: 'No description available',
    };

    service.updateProduct(1, productToUpdate).subscribe((product) => {
      expect(product).toEqual(expectedProduct);
      done();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(productToUpdate);

    req.flush(mockResponse);
  });

  it('should map data on get products', () => {
    const mockResponse = [
      { id: 1, name: 'Product 1', unitPrice: 10.0, quantity: 100 },
      { id: 2, name: 'Product 2', unitPrice: 20.0, quantity: 200 },
    ];
    const expectedProducts = mockResponse.map((dto) => ({
      ...dto,
      imageUrl: 'assets/logo_black.svg',
      description: 'No description available',
    }));

    service.getProducts().subscribe((products) => {
      expect(products).toEqual(expectedProducts);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/products`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should call delete endpoint on delete', () => {
    const id = 1;

    service.deleteProduct(id).subscribe();

    const req = httpMock.expectOne(`${environment.apiUrl}/products/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });
});
