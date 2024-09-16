import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { DataTable } from 'simple-datatables';

interface Cliente {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  userId: string;
  statusCustomer: string;
}

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit {
  customers: Cliente[] = [];
  customerForm: FormGroup;
  showModal: boolean = false;
  isEditMode: boolean = false;
  selectedCustomerId: number | null = null;

  constructor(private customerService: ClienteService, private fb: FormBuilder) { 
    this.customerForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/), Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      userId: ['1', Validators.required],
      statusCustomer: ['1', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe((data: Cliente[]) => {
      this.customers = data;

      // Usamos setTimeout para garantizar que la tabla esté en el DOM
      setTimeout(() => {
        this.initializeDataTable();
      }, 10);
    });
  }

  initializeDataTable(): void {
    const tableElement = document.getElementById('search-table') as HTMLTableElement;
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
      this.customerForm.reset({
        userId: '1',
        statusCustomer: '1'
      });
      this.selectedCustomerId = null;
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedCustomerId = null;
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      const customerData = {
        ...this.customerForm.value,
        createdAt: new Date().toISOString()
      };

      if (this.isEditMode && this.selectedCustomerId !== null) {
        this.customerService.updateCustomer(this.selectedCustomerId, customerData).subscribe(() => {
          this.loadCustomers();
          this.closeModal();
        });
      } else {
        this.customerService.createCustomer(customerData).subscribe(() => {
          this.loadCustomers();
          this.closeModal();
        });
        location.reload();
      }
    } else {
      this.customerForm.markAllAsTouched();
    }
  }

  editCustomer(id: number): void {
    this.selectedCustomerId = id;
    this.customerService.getCustomerById(id).subscribe((customer: Cliente) => {
      this.openModal(true);
      this.customerForm.patchValue({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        userId: customer.userId,
        statusCustomer: customer.statusCustomer
      });
    });
  }

  deleteCustomer(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este cliente?')) {
      this.customerService.deleteCustomer(id).subscribe(() => {
        this.loadCustomers();
      });
      window.location.reload();
    }
  }
}