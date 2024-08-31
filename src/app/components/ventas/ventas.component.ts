import { Component, OnInit } from '@angular/core';
import { SaleService } from '../../services/sale.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTable } from "simple-datatables";

interface Sale {
  saleId: number;
  customerId: number;
  typeLunch: string;
  quantity: number;
  totalSale: number;
  saleDate: string;
  createdAt: string;
  userId: number;
  statusSales: number;
}

@Component({
  selector: 'app-ventas',
  templateUrl: './ventas.component.html',
  styleUrls: ['./ventas.component.css']
})
export class VentasComponent implements OnInit {
  sales: Sale[] = [];
  saleForm: FormGroup;
  showModal: boolean = false;
  isEditMode: boolean = false;
  selectedSaleId: number | null = null;

  constructor(private saleService: SaleService, private fb: FormBuilder) { 
    this.saleForm = this.fb.group({
      customerId: ['', Validators.required],
      typeLunch: ['', Validators.required],
      quantity: ['', Validators.required],
      totalSale: ['', Validators.required],
      saleDate: ['', Validators.required],
      userId: ['1', Validators.required],  // Valor por defecto
      statusSales: ['1', Validators.required]  // Valor por defecto
    });
  }

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales(): void {
    this.saleService.getSales().subscribe((data: Sale[]) => {
        this.sales = data;

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
      this.saleForm.reset({
        userId: '1',
        statusSales: '1'
      });
      this.selectedSaleId = null;
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedSaleId = null;
  }

  onSubmit(): void {
    if (this.saleForm.valid) {
      const now = new Date().toISOString(); // Establece la fecha actual

      const saleData = {
        ...this.saleForm.value,
        createdAt: now  // Asigna la fecha actual
      };

      if (this.isEditMode && this.selectedSaleId !== null) {
        // Actualizar venta
        this.saleService.updateSale(this.selectedSaleId, saleData).subscribe(() => {
          window.location.reload();
          this.closeModal();
        });
        window.location.reload();
      } else {
        // Crear nueva venta
        this.saleService.createSale(saleData).subscribe(() => {
          window.location.reload();
          this.closeModal();
        });
      }
    }
  }

  editSale(id: number): void {
    this.selectedSaleId = id;
    this.saleService.getSaleById(id).subscribe((sale: Sale) => {
      this.openModal(true);
      this.saleForm.patchValue({
        customerId: sale.customerId,
        typeLunch: sale.typeLunch,
        quantity: sale.quantity,
        totalSale: sale.totalSale,
        saleDate: sale.saleDate,
        userId: sale.userId,
        statusSales: sale.statusSales
      });
    });
  }

  deleteSale(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta venta?')) {
      this.saleService.deleteSale(id).subscribe(() => {
        window.location.reload();
      });
      window.location.reload();
    }
  }
}