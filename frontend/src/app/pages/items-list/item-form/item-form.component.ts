import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { WarehouseFormItem } from 'src/app/core/models/warehouseItem';
import { ProductService } from 'src/app/services/product.service';

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss'],
})
export class ItemFormComponent implements OnChanges {
  @Input() editableItemId: number | null = null;
  @Input() item?: WarehouseFormItem;

  @Output()
  onItemSaved = new EventEmitter<void>();
  @Output()
  onItemAdded = new EventEmitter<void>();
  @Output()
  onCancel = new EventEmitter<void>();

  itemForm: FormGroup<{
    name: FormControl<string>;
    quantity: FormControl<number>;
    unitPrice: FormControl<number>;
  }>;

  constructor(private fb: NonNullableFormBuilder, private productService: ProductService) {
    this.itemForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(1)]],
      quantity: [0, [Validators.required, Validators.min(0)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['item'] && this.item) {
      this.itemForm.patchValue({
        name: this.item.name,
        quantity: this.item.quantity,
        unitPrice: this.item.unitPrice,
      });
    }
  }

  onSubmit(): void {
    if (this.itemForm.invalid) {
      this.itemForm.markAllAsTouched();
      return;
    }

    const productData: WarehouseFormItem = this.itemForm.getRawValue();

    if (this.editableItemId) {
      // Editing existing product
      this.productService.updateProduct(this.editableItemId, productData).subscribe({
        next: () => {
          this.itemForm.reset();
          this.onItemSaved.emit();
        },
        error: (err) => {
          console.error('Error updating product', err);
        },
      });
    } else {
      // Creating new product
      this.productService.createProduct(productData).subscribe({
        next: () => {
          this.itemForm.reset();
          this.onItemAdded.emit();
        },
        error: (err) => {
          console.error('Error adding product', err);
        },
      });
    }
  }
}
