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

  constructor(private inventoryService: InventoryService, private fb: FormBuilder) { 
    this.inventoryForm = this.fb.group({
      productName: ['', Validators.required],
      quantity: ['', Validators.required],
      unitPrice: ['', Validators.required],
      supplierId: ['', Validators.required],
      userId: ['1', Validators.required],  // Valor por defecto
      statusInventory: ['1', Validators.required]  // Valor por defecto
    });
  }

  ngOnInit(): void {
    this.loadInventories();
  }

  loadInventories(): void {
    this.inventoryService.getInventories().subscribe((data: Inventory[]) => {
        this.inventories = data;

        // Usamos setTimeout para garantizar que la tabla esté en el DOM
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
      const now = new Date().toISOString(); // Establece la fecha actual

      const inventoryData = {
        ...this.inventoryForm.value,
        createdAt: now  // Asigna la fecha actual
      };

      if (this.isEditMode && this.selectedInventoryId !== null) {
        // Actualizar inventario
        this.inventoryService.updateInventory(this.selectedInventoryId, inventoryData).subscribe(() => {
          this.closeModal();
        });
        window.location.reload();
      } else {
        // Crear nuevo inventario
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
      window.location.reload();
    }
  }
}