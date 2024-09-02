import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../../services/supplier.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTable } from "simple-datatables";

interface Supplier {
  supplierId: number;
  supplierName: string;
  supplierProduct: string;
  phone: string;
  createdAt: string;
  userId: string;
  statusSupplier: string;
}

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {
  suppliers: Supplier[] = [];
  supplierForm: FormGroup;
  showModal: boolean = false;
  isEditMode: boolean = false;
  selectedSupplierId: number | null = null;

  constructor(private supplierService: SupplierService, private fb: FormBuilder) { 
    this.supplierForm = this.fb.group({
      supplierName: ['', Validators.required],
      supplierProduct: ['', Validators.required],
      phone: ['', Validators.required],
      userId: ['1', Validators.required],  // Valor por defecto
      statusSupplier: ['1', Validators.required]  // Valor por defecto
    });
  }

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe((data: Supplier[]) => {
        this.suppliers = data;

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
      this.supplierForm.reset({
        userId: '1',
        statusSupplier: '1'
      });
      this.selectedSupplierId = null;
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedSupplierId = null;
  }

  onSubmit(): void {
    if (this.supplierForm.valid) {
      const now = new Date().toISOString(); // Establece la fecha actual

      const supplierData = {
        ...this.supplierForm.value,
        createdAt: now  // Asigna la fecha actual
      };

      if (this.isEditMode && this.selectedSupplierId !== null) {
        // Actualizar proveedor
        this.supplierService.updateSupplier(this.selectedSupplierId, supplierData).subscribe(() => {
          this.loadSuppliers();
          this.closeModal();
        });
        window.location.reload();
      } else {
        // Crear nuevo proveedor
        this.supplierService.createSupplier(supplierData).subscribe(() => {
          this.loadSuppliers();
          this.closeModal();
          window.location.reload();
        });
      }
    }
  }

  editSupplier(id: number): void {
    this.selectedSupplierId = id;
    this.supplierService.getSupplierById(id).subscribe((supplier: Supplier) => {
      this.openModal(true);
      this.supplierForm.patchValue({
        supplierName: supplier.supplierName,
        supplierProduct: supplier.supplierProduct,
        phone: supplier.phone,
        userId: supplier.userId,
        statusSupplier: supplier.statusSupplier
      });
    });
  }

  deleteSupplier(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este proveedor?')) {
      this.supplierService.deleteSupplier(id).subscribe(() => {
        // this.loadSuppliers();
      });
      window.location.reload();
    }
  }
}