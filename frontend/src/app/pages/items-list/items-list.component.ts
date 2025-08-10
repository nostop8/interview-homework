import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListItemComponent } from './list-item/list-item.component';
import { Observable } from 'rxjs';
import { WarehouseItem } from '../../core/models/warehouseItem';
import { ItemsMockService } from './items.mock.service';
import { ProductService } from 'src/app/services/product.service';
import { ItemFormComponent } from './item-form/item-form.component';

@Component({
  selector: 'app-items-list',
  standalone: true,
  imports: [CommonModule, ListItemComponent, ItemFormComponent],
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss'],
})
export class ItemsListComponent {
  editableItemId: number | null = null;

  items$: Observable<WarehouseItem[]> = this.productService.getProducts();

  constructor(private itemsMockService: ItemsMockService, private productService: ProductService) {}

  addItemToShipment(id: number): void {
    this.itemsMockService.addToShipment(id);
  }

  reload() {
    this.items$ = this.productService.getProducts();
    this.editableItemId = null;
  }

  deleteItem(productId: number): void {
    confirm('Are you sure you want to delete this product?') &&
      this.productService.deleteProduct(productId).subscribe(() => {
        this.reload();
      });
  }

  editItem(productId: number): void {
    this.editableItemId = productId;
  }
}
