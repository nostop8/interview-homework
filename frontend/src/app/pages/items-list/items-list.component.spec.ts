import { ComponentFixture, TestBed, tick } from '@angular/core/testing';

import { ItemsListComponent } from './items-list.component';
import { ProductService } from 'src/app/services/product.service';
import { of } from 'rxjs';

describe('ItemsListComponent', () => {
  let component: ItemsListComponent;
  let fixture: ComponentFixture<ItemsListComponent>;

  let productServiceMock: jasmine.SpyObj<ProductService>;

  const mockProducts = [
    {
      id: 1,
      name: 'Mock Product',
      quantity: 10,
      unitPrice: 100,
      imageUrl: '',
      description: '',
    },
    {
      id: 2,
      name: 'Mock Product 2',
      quantity: 5,
      unitPrice: 200,
      imageUrl: '',
      description: '',
    },
  ];

  beforeEach(async () => {
    productServiceMock = jasmine.createSpyObj('ProductService', ['getProducts', 'deleteProduct']);
    productServiceMock.getProducts.and.returnValue(of(mockProducts));
    productServiceMock.deleteProduct.and.returnValue(of(undefined));

    await TestBed.configureTestingModule({
      imports: [ItemsListComponent],
      providers: [{ provide: ProductService, useValue: productServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch products on init', (done) => {
    expect(productServiceMock.getProducts).toHaveBeenCalled();
    component.items$.subscribe((products) => {
      expect(products).toEqual(mockProducts);
      done();
    });
  });

  it('should call deleteProduct and then getProducts on delete', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    const productIdToDelete = 1;
    component.deleteItem(productIdToDelete);
    fixture.detectChanges();
    expect(productServiceMock.deleteProduct).toHaveBeenCalledWith(productIdToDelete);
    expect(productServiceMock.getProducts).toHaveBeenCalledTimes(2);
  });

  it('should call getProducts on reload', () => {
    component.reload();
    fixture.detectChanges();
    expect(productServiceMock.getProducts).toHaveBeenCalledTimes(2);
  });
});
