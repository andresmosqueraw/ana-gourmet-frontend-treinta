import { Component, OnInit } from '@angular/core';
import { SaleService } from '../../services/sale.service';
import { ClienteService } from '../../services/cliente.service';  
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { DataTable } from "simple-datatables";

interface Sale {
  id: number;
  customerId: number;
  customerName?: string;  // Marcar customerName como opcional si no siempre está presente
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
  customers: any[] = [];
  saleForm: FormGroup;
  showModal: boolean = false;
  isEditMode: boolean = false;
  selectedid: number | null = null;

  constructor(
    private saleService: SaleService, 
    private clienteService: ClienteService,  
    private fb: FormBuilder
  ) { 
    this.saleForm = this.fb.group({
      customerId: ['', [Validators.required]], 
      typeLunch: ['', [Validators.required, this.typeLunchValidator]],
      quantity: ['', [Validators.required, Validators.min(1), Validators.max(10)]],
      totalSale: [{ value: '', disabled: true }, Validators.required],
      saleDate: [{ value: '', disabled: false }, Validators.required], // Puedes habilitar para permitir la fecha de venta
      userId: ['1', Validators.required],
      statusSales: ['1', Validators.required]
    });    

    this.saleForm.patchValue({ saleDate: new Date().toISOString().split('T')[0] });
  }

  ngOnInit(): void {
    // First, load the customers, then load the sales.
    this.loadCustomers().then(() => {
      this.loadSales();
    });
  }
  
  loadSales(): void {
    this.saleService.getSales().subscribe((data: Sale[]) => {
      this.sales = data.map(sale => {
        // Find the customer by ID in the already loaded customers array
        const customer = this.customers.find(c => {
          console.log(c.id + "Imprimiendo c.id"); // Imprime c.id
          
          return c.id === sale.customerId;
        });
        console.log(customer);
        console.log("Imprimiendo customer");
        console.log(sale.customerId)
        console.log("Imprimiendo customerID");
        
        const customerName = customer ? customer.name : 'Cliente no encontrado'; // Default if no match
        // Return a sale object with the customer name included
        return { ...sale, customerName };
      });
  
      // Initialize the data table after sales are fully loaded
      setTimeout(() => {
        this.initializeDataTable();
      }, 10);
    });
  }
  
  

  loadCustomers(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.clienteService.getCustomers().subscribe((data: any[]) => {
        this.customers = data; // Assign customers from the API
        resolve();
      }, error => reject(error));
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

  typeLunchValidator(control: AbstractControl) {
    const validLunchTypes = ['Corriente', 'Ejecutivo'];
    if (!validLunchTypes.includes(control.value)) {
      return { invalidTypeLunch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.saleForm.valid) {
      const now = new Date().toISOString(); 
      const saleData = {
        ...this.saleForm.getRawValue(),
        customerName: this.customers.find(c => c.id === this.saleForm.get('customerId')?.value)?.name,  // Asigna el nombre del cliente
        createdAt: now
      };
  
      if (this.isEditMode && this.selectedid !== null) {
        this.saleService.updateSale(this.selectedid, saleData).subscribe(() => {
          this.loadSales();
          this.closeModal();
        });
        // window.location.reload();
      } else {
        this.saleService.createSale(saleData).subscribe(() => {
          this.loadSales();
          this.closeModal();
        });
        // window.location.reload();
      }
    } else {
      this.saleForm.markAllAsTouched();
    }
  }
  
  openModal(isEditMode = false): void {
    this.showModal = true;
    this.isEditMode = isEditMode;
    if (!isEditMode) {
      this.saleForm.reset({
        userId: '1',
        statusSales: '1',
        saleDate: new Date().toISOString().split('T')[0]
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
  
      const customer = this.customers.find(c => c.id === sale.customerId);
      const customerName = customer ? customer.name : 'Cliente no encontrado';
  
      this.saleForm.patchValue({
        customerId: sale.customerId,
        customerName,  
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
