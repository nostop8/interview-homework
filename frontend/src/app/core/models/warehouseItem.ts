export interface WarehouseFormItem {
    name: string;
    quantity: number;
    unitPrice: number;
}

export interface WarehouseItem extends WarehouseFormItem {
    imageUrl: string;
    id: number;
    description: string;
}
