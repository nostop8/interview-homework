import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListItemComponent } from './list-item/list-item.component';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { WarehouseItem } from '../../core/models/warehouseItem';
import { ItemsMockService } from './items.mock.service';
import { ProductService } from 'src/app/services/product.service';
import { ItemFormComponent } from './item-form/item-form.component';

interface ItemsState {
  loading: boolean;
  error: boolean;
  items?: WarehouseItem[];
}

@Component({
  selector: 'app-items-list',
  standalone: true,
  imports: [CommonModule, ListItemComponent, ItemFormComponent],
  templateUrl: './items-list.component.html',
  styleUrls: ['./items-list.component.scss'],
})
export class ItemsListComponent implements OnInit {
  editableItemId: number | null = null;
  state$: Observable<ItemsState>;
  constructor(private itemsMockService: ItemsMockService, private productService: ProductService) {}

  addItemToShipment(id: number): void {
    this.itemsMockService.addToShipment(id);
  }

  ngOnInit(): void {
    this.getItems();
  }

  getItems() {
    this.state$ = this.productService.getProducts().pipe(
      map((items) => ({
        loading: false,
        error: false,
        items,
      })),
      startWith({
        loading: true,
        error: false,
        items: undefined,
      }),
      catchError(() =>
        of({
          loading: false,
          error: true,
          items: undefined,
        })
      )
    );
    this.editableItemId = null;
  }

  deleteItem(productId: number): void {
    confirm('Are you sure you want to delete this product?') &&
      this.productService.deleteProduct(productId).subscribe(() => {
        this.getItems();
      });
  }

  editItem(productId: number): void {
    this.editableItemId = productId;
  }
}
