import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemFormComponent } from './item-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { of } from 'rxjs';
import { SimpleChange } from '@angular/core';

describe('ItemFormComponent', () => {
  let component: ItemFormComponent;
  let fixture: ComponentFixture<ItemFormComponent>;
  let productServiceMock: jasmine.SpyObj<ProductService>;

  const mockProduct = {
    id: 1,
    name: 'Mock Product',
    quantity: 10,
    unitPrice: 100,
    imageUrl: '',
    description: '',
  };

  beforeEach(async () => {
    productServiceMock = jasmine.createSpyObj('ProductService', ['createProduct', 'updateProduct']);
    productServiceMock.createProduct.and.returnValue(of({ ...mockProduct }));
    productServiceMock.updateProduct.and.returnValue(of({ ...mockProduct }));

    await TestBed.configureTestingModule({
      imports: [ItemFormComponent, ReactiveFormsModule],
      providers: [{ provide: ProductService, useValue: productServiceMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(ItemFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should enable save button only after the form is filled in', () => {
    fixture.detectChanges();

    const saveButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(saveButton.disabled).toBe(true);

    component.itemForm.patchValue({
      name: 'Test Product',
      quantity: 5,
      unitPrice: 50,
    });

    fixture.detectChanges();
    expect(saveButton.disabled).toBe(false);
  });

  it('should call onItemAdded when the form is submitted', () => {
    spyOn(component.onItemAdded, 'emit');

    component.itemForm.patchValue({
      name: 'Test Product',
      quantity: 5,
      unitPrice: 50,
    });

    component.onSubmit();

    expect(productServiceMock.createProduct).toHaveBeenCalledWith({
      name: 'Test Product',
      quantity: 5,
      unitPrice: 50,
    });
    expect(component.onItemAdded.emit).toHaveBeenCalled();
  });

  it('should show Add Product and hide Cancel buttons', () => {
    const saveButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(saveButton.innerText).toBe('Add Product');
  });

  it('should call onItemSaved when form with existing item submitted', () => {
    spyOn(component.onItemSaved, 'emit');

    component.editableItemId = 1;
    component.item = {
      name: 'Test Product',
      quantity: 5,
      unitPrice: 50,
    };

    component.ngOnChanges({
      editableItemId: new SimpleChange(null, 1, true),
      item: new SimpleChange(null, component.item, true),
    });

    fixture.detectChanges();

    component.itemForm.patchValue({
      name: 'Test Product Updated',
    });

    fixture.detectChanges();

    component.onSubmit();

    expect(productServiceMock.updateProduct).toHaveBeenCalledWith(1, {
      name: 'Test Product Updated',
      quantity: 5,
      unitPrice: 50,
    });
    expect(component.onItemSaved.emit).toHaveBeenCalled();
  });

  it('should show Save Product and hide Cancel buttons', () => {
    component.editableItemId = 1;
    component.item = {
      name: 'Test Product',
      quantity: 5,
      unitPrice: 50,
    };

    component.ngOnChanges({
      editableItemId: new SimpleChange(null, 1, true),
      item: new SimpleChange(null, component.item, true),
    });

    fixture.detectChanges();

    const saveButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(saveButton.innerText).toBe('Save Product');
    const cancelButton = fixture.nativeElement.querySelector('button:not([type="submit"])');
    expect(cancelButton.innerText).toBe('Cancel');
  });
});
