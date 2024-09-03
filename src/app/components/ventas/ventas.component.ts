import { Component, OnInit } from '@angular/core';
import { SaleService } from '../../services/sale.service';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { DataTable } from "simple-datatables";

interface Sale {
  id: number;
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
  selectedid: number | null = null;

  existingCustomerIds: number[] = [1, 2, 3, 4, 5]; // Ejemplo de IDs de clientes existentes

  constructor(private saleService: SaleService, private fb: FormBuilder) { 
    this.saleForm = this.fb.group({
      customerId: ['', [Validators.required, Validators.min(1), this.customerIdValidator.bind(this)]],
      typeLunch: ['', [Validators.required, this.typeLunchValidator]],
      quantity: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      totalSale: [{ value: '', disabled: true }, Validators.required],
      saleDate: [{ value: '', disabled: true }, Validators.required],
      userId: ['1', Validators.required],
      statusSales: ['1', Validators.required]
    });

    // Establecer la fecha actual como predeterminada
    this.saleForm.patchValue({ saleDate: new Date().toISOString().split('T')[0] });
  }

  ngOnInit(): void {
    console.log('VentasComponent cargado'); // Log cuando el componente de ventas se carga
    this.loadSales();
  }

  loadSales(): void {
    this.saleService.getSales().subscribe((data: Sale[]) => {
        this.sales = data;
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

  customerIdValidator(control: AbstractControl) {
    const customerId = control.value;
    if (!this.existingCustomerIds.includes(customerId)) {
      return { invalidCustomerId: true };
    }
    return null;
  }

  typeLunchValidator(control: AbstractControl) {
    const validLunchTypes = ['Corriente', 'Ejecutivo'];
    if (!validLunchTypes.includes(control.value)) {
      return { invalidTypeLunch: true };
    }
    return null;
  }

  getCustomerIdErrorMessage(): string {
    if (this.saleForm.get('customerId')?.hasError('required')) {
      return 'Cliente ID es requerido.';
    }
    if (this.saleForm.get('customerId')?.hasError('invalidCustomerId')) {
      return 'Cliente ID no es válido.';
    }
    return '';
  }

  onSubmit(): void {
    if (this.saleForm.valid) {
      const now = new Date().toISOString(); // Establece la fecha actual

      const saleData = {
        ...this.saleForm.getRawValue(),
        createdAt: now  // Asigna la fecha actual
      };

      if (this.isEditMode && this.selectedid !== null) {
        this.saleService.updateSale(this.selectedid, saleData).subscribe(() => {
          this.loadSales();
          this.closeModal();
        });
        window.location.reload();
      } else {
        this.saleService.createSale(saleData).subscribe(() => {
          this.loadSales();
          this.closeModal();
        });
        window.location.reload();
      }
    } else {
      this.saleForm.markAllAsTouched(); // Marca todos los campos como tocados para mostrar los errores
    }
  }

  openModal(isEditMode = false): void {
    this.showModal = true;
    this.isEditMode = isEditMode;
    if (!isEditMode) {
      this.saleForm.reset({
        userId: '1',
        statusSales: '1',
        saleDate: new Date().toISOString().split('T')[0] // Fecha actual
      });
      this.selectedid = null;
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedid = null;
  }

  editSale(id: number): void {
    this.selectedid = id;
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
        this.loadSales();
      });
    }
  }

  // Método para calcular y establecer el total de la venta según el tipo de almuerzo
  calculateTotalSale(): void {
    const quantity = this.saleForm.get('quantity')?.value;
    const typeLunch = this.saleForm.get('typeLunch')?.value;
    if (typeLunch === 'Corriente') {
      this.saleForm.patchValue({ totalSale: 12000 * quantity });
    } else if (typeLunch === 'Ejecutivo') {
      this.saleForm.patchValue({ totalSale: 14000 * quantity });
    }
  }
}
