import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../../services/supplier.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTable } from "simple-datatables";

interface Supplier {
  supplierId: number;
  supplierName: string;
  suppliedProduct: string;
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

  constructor(private supplierService: SupplierService, private fb: FormBuilder) { 
    this.supplierForm = this.fb.group({
      supplierName: ['', Validators.required],
      suppliedProduct: ['', Validators.required],
      phone: ['', Validators.required],
      userId: ['1', Validators.required],  // Valor por defecto
      statusSupplier: ['1', Validators.required]  // Valor por defecto
    });
  }

  ngOnInit(): void {
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

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  onSubmit(): void {
    if (this.supplierForm.valid) {
      // Obtener la fecha y hora actual en la zona horaria local
      const now = new Date();
      const timezoneOffset = now.getTimezoneOffset() * 60000; // offset en milisegundos
      const localISOTime = new Date(now.getTime() - timezoneOffset).toISOString().slice(0, -1);

      const supplierData = {
        ...this.supplierForm.value,
        createdAt: localISOTime
      };

      this.supplierService.createSupplier(supplierData).subscribe(() => {
        this.closeModal();
        window.location.reload();  // Recarga la página después de crear el proveedor
      });
    }
  }
}