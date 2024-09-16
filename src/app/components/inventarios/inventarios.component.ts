import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { SupplierService } from '../../services/supplier.service';  // Importa el servicio de proveedores
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
  suppliers: any[] = []; // Lista para almacenar proveedores

  // Define la lista de productos aquí
  products = [
    { "id": 1, "name": "Papas" },
    { "id": 2, "name": "Tomates" },
    { "id": 3, "name": "Cebollas" },
    { "id": 4, "name": "Zanahorias" },
    { "id": 5, "name": "Ajos" },
    { "id": 6, "name": "Pimientos" },
    { "id": 7, "name": "Pepinos" },
    { "id": 8, "name": "Calabacines" },
    { "id": 9, "name": "Berenjenas" },
    { "id": 10, "name": "Lechugas" },
    { "id": 11, "name": "Espinacas" },
    { "id": 12, "name": "Brócolis" },
    { "id": 13, "name": "Coliflores" },
    { "id": 14, "name": "Repollo" },
    { "id": 15, "name": "Acelgas" },
    { "id": 16, "name": "Guisantes" },
    { "id": 17, "name": "Judías Verdes" },
    { "id": 18, "name": "Alcachofas" },
    { "id": 19, "name": "Espárragos" },
    { "id": 20, "name": "Rábanos" },
    { "id": 21, "name": "Apio" },
    { "id": 22, "name": "Puerros" },
    { "id": 23, "name": "Nabos" },
    { "id": 24, "name": "Remolachas" },
    { "id": 25, "name": "Boniatos" },
    { "id": 26, "name": "Maíz" },
    { "id": 27, "name": "Calabazas" },
    { "id": 28, "name": "Champiñones" },
    { "id": 29, "name": "Setas" },
    { "id": 30, "name": "Habichuelas" },
    { "id": 31, "name": "Alubias" },
    { "id": 32, "name": "Lentejas" },
    { "id": 33, "name": "Garbanzos" },
    { "id": 34, "name": "Quinua" },
    { "id": 35, "name": "Arroz" },
    { "id": 36, "name": "Trigo" },
    { "id": 37, "name": "Avena" },
    { "id": 38, "name": "Cebada" },
    { "id": 39, "name": "Centeno" },
    { "id": 40, "name": "Maíz Dulce" },
    { "id": 41, "name": "Mango" },
    { "id": 42, "name": "Plátano" },
    { "id": 43, "name": "Piña" },
    { "id": 44, "name": "Coco" },
    { "id": 45, "name": "Papaya" },
    { "id": 46, "name": "Sandía" },
    { "id": 47, "name": "Melón" },
    { "id": 48, "name": "Uvas" },
    { "id": 49, "name": "Fresas" },
    { "id": 50, "name": "Frambuesas" },
    { "id": 51, "name": "Arándanos" },
    { "id": 52, "name": "Moras" },
    { "id": 53, "name": "Manzanas" },
    { "id": 54, "name": "Peras" },
    { "id": 55, "name": "Cerezas" },
    { "id": 56, "name": "Melocotones" },
    { "id": 57, "name": "Albaricoques" },
    { "id": 58, "name": "Ciruelas" },
    { "id": 59, "name": "Kiwis" },
    { "id": 60, "name": "Naranjas" },
    { "id": 61, "name": "Limones" },
    { "id": 62, "name": "Pomelos" },
    { "id": 63, "name": "Mandarinas" },
    { "id": 64, "name": "Caquis" },
    { "id": 65, "name": "Granadas" },
    { "id": 66, "name": "Higos" },
    { "id": 67, "name": "Chirimoyas" },
    { "id": 68, "name": "Guayabas" },
    { "id": 69, "name": "Aguacates" },
    { "id": 70, "name": "Tomatillos" },
    { "id": 71, "name": "Carambolas" },
    { "id": 72, "name": "Dátiles" },
    { "id": 73, "name": "Aceitunas" },
    { "id": 74, "name": "Castañas" },
    { "id": 75, "name": "Almendras" },
    { "id": 76, "name": "Nueces" },
    { "id": 77, "name": "Pistachos" },
    { "id": 78, "name": "Avellanas" },
    { "id": 79, "name": "Cacahuetes" },
    { "id": 80, "name": "Anacardos" },
    { "id": 81, "name": "Girasol" },
    { "id": 82, "name": "Calabaza" },
    { "id": 83, "name": "Acelgas" },
    { "id": 84, "name": "Endibias" },
    { "id": 85, "name": "Escarolas" },
    { "id": 86, "name": "Coles de Bruselas" },
    { "id": 87, "name": "Coles" },
    { "id": 88, "name": "Chirivías" },
    { "id": 89, "name": "Yucas" },
    { "id": 90, "name": "Plátanos Machos" },
    { "id": 91, "name": "Ñames" },
    { "id": 92, "name": "Castañas de agua" },
    { "id": 93, "name": "Pepinillos" },
    { "id": 94, "name": "Okra" },
    { "id": 95, "name": "Jícama" },
    { "id": 96, "name": "Berros" },
    { "id": 97, "name": "Rúcula" },
    { "id": 98, "name": "Hojas de Mostaza" },
    { "id": 99, "name": "Col Rizada" },
    { "id": 100, "name": "Cilantro" }
];


  constructor(
    private inventoryService: InventoryService,
    private supplierService: SupplierService,  // Inyecta el servicio de proveedores
    private fb: FormBuilder
  ) { 
    this.inventoryForm = this.fb.group({
      productName: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
      unitPrice: ['', [Validators.required, Validators.min(2000), Validators.max(20000)]],
      supplierName: ['', Validators.required], // Cambia supplierId a supplierName
      userId: ['1', Validators.required],
      statusInventory: ['1', Validators.required]
    });    
  }

  ngOnInit(): void {
    this.loadInventories();
    this.loadSuppliers();
    console.log('InventariosComponent cargado'); // Log cuando el componente de inventarios se carga
    this.loadInventories();
  }

  // Función para obtener el nombre del proveedor por su ID
  getSupplierName(supplierId: number): string {
    const supplier = this.suppliers.find(s => s.supplierId === supplierId);
    return supplier ? supplier.supplierName : 'Proveedor no encontrado';
  }

  loadInventories(): void {
    this.inventoryService.getInventories().subscribe((data: Inventory[]) => {
        this.inventories = data;

        setTimeout(() => {
            this.initializeDataTable();
        }, 10);
    });
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe((data: any[]) => {
      this.suppliers = data;
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
  
      const selectedSupplier = this.suppliers.find(supplier => supplier.supplierName === this.inventoryForm.value.supplierName);
      const supplierId = selectedSupplier ? selectedSupplier.supplierId : null;
  
      const inventoryData = {
        ...this.inventoryForm.value,
        supplierId, // Usa el supplierId en lugar del nombre
        createdAt: now
      };
  
      if (this.isEditMode && this.selectedInventoryId !== null) {
        this.inventoryService.updateInventory(this.selectedInventoryId, inventoryData).subscribe(() => {
          this.closeModal();
          window.location.reload();
        });
        window.location.reload();
      } else {
        this.inventoryService.createInventory(inventoryData).subscribe(() => {
          this.closeModal();
          window.location.reload();
        });
        window.location.reload();
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
      location.reload();
    }
  }

  supplierIdValidator(control: any) {
    const supplierName = control.value;
    const isValid = this.suppliers.some(supplier => supplier.supplierName === supplierName);
    return isValid ? null : { invalidSupplierName: true };
  }  
}
