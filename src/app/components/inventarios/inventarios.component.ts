import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTable } from "simple-datatables";

interface Inventory {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  supplierId: number;
  createdAt: string;
  userId: number;
  statusInventory: number;
}

@Component({
  selector: 'app-inventarios',
  templateUrl: './inventarios.component.html',
  styleUrls: ['./inventarios.component.css']
})
export class InventariosComponent implements OnInit {
  inventories: Inventory[] = [];
  inventoryForm: FormGroup;
  showModal: boolean = false;
  isEditMode: boolean = false;
  selectedInventoryId: number | null = null;

  // Define la lista de productos aquí
  products = [
    { id: 1, name: 'Papas' },
    { id: 2, name: 'Tomates' },
    { id: 3, name: 'Cebollas' },
    { id: 4, name: 'Zanahorias' },
    // Agrega más productos según sea necesario
  ];

  constructor(private inventoryService: InventoryService, private fb: FormBuilder) { 
    this.inventoryForm = this.fb.group({
      productName: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      unitPrice: ['', [Validators.required, Validators.min(2000), Validators.max(20000)]],
      supplierId: ['', [Validators.required, Validators.min(1), Validators.max(5)]],
      userId: ['1', Validators.required],
      statusInventory: ['1', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadInventories();
  }

  loadInventories(): void {
    this.inventoryService.getInventories().subscribe((data: Inventory[]) => {
        this.inventories = data;

        setTimeout(() => {
            this.initializeDataTable();
        }, 10);
    });
  }

  initializeDataTable(): void {
    const tableElement = document.getElementById("search-table") as HTMLTableElement;
    if (tableElement) {
        const dataTable = new DataTable(tableElement, {
            searchable: true,
            sortable: true
        });
    }
  }

  openModal(isEditMode = false): void {
    this.showModal = true;
    this.isEditMode = isEditMode;
    if (!isEditMode) {
      this.inventoryForm.reset({
        userId: '1',
        statusInventory: '1'
      });
      this.selectedInventoryId = null;
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedInventoryId = null;
  }

  onSubmit(): void {
    if (this.inventoryForm.valid) {
      const now = new Date().toISOString();

      const inventoryData = {
        ...this.inventoryForm.value,
        createdAt: now
      };

      if (this.isEditMode && this.selectedInventoryId !== null) {
        this.inventoryService.updateInventory(this.selectedInventoryId, inventoryData).subscribe(() => {
          this.closeModal();
          window.location.reload();
        });
      } else {
        this.inventoryService.createInventory(inventoryData).subscribe(() => {
          window.location.reload();
          this.closeModal();
        });
      }
    }
  }

  editInventory(id: number): void {
    this.selectedInventoryId = id;
    this.inventoryService.getInventoryById(id).subscribe((inventory: Inventory) => {
      this.openModal(true);
      this.inventoryForm.patchValue({
        productName: inventory.productName,
        quantity: inventory.quantity,
        unitPrice: inventory.unitPrice,
        supplierId: inventory.supplierId,
        userId: inventory.userId,
        statusInventory: inventory.statusInventory
      });
    });
  }

  deleteInventory(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este inventario?')) {
      this.inventoryService.deleteInventory(id).subscribe(() => {
        window.location.reload();
      });
    }
  }
}
