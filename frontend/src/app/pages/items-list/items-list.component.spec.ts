import { ComponentFixture, TestBed, tick } from '@angular/core/testing';

import { ItemsListComponent } from './items-list.component';
import { ProductService } from 'src/app/services/product.service';
import { delay, filter, of, throwError } from 'rxjs';

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
    component.state$.pipe(filter(({ items }) => items !== undefined && items.length > 0)).subscribe((data) => {
      expect(data).toEqual({
        loading: false,
        error: false,
        items: mockProducts,
      });
      expect(fixture.nativeElement.querySelector('.message')).toBeFalsy();
      done();
    });
  });

  it('should show loading state initially', () => {
    productServiceMock.getProducts.and.returnValue(of(mockProducts).pipe(delay(100)));
    fixture = TestBed.createComponent(ItemsListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.message').textContent).toContain('Loading... Please wait.');
  });

  it('should show error state if fetching products fails', () => {
    productServiceMock.getProducts.and.returnValue(throwError(() => new Error('Failed to fetch products')));
    fixture = TestBed.createComponent(ItemsListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.message').textContent).toContain('Failed to load items.');
  });

  it('should show empty state if no items are available', () => {
    productServiceMock.getProducts.and.returnValue(of([]));
    fixture = TestBed.createComponent(ItemsListComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.message').textContent).toContain('No items found.');
  });

  it('should set editableItemId when editItem is called', () => {
    const productIdToEdit = 1;
    component.editItem(productIdToEdit);
    expect(component.editableItemId).toBe(productIdToEdit);
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
    component.getItems();
    fixture.detectChanges();
    expect(productServiceMock.getProducts).toHaveBeenCalledTimes(2);
  });
});
