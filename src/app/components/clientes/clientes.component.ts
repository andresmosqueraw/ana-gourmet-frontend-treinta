import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../../services/cliente.service';
import { DataTable } from 'simple-datatables';
import { AbstractControl, ValidatorFn } from '@angular/forms';

interface Cliente {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  userId: string;
  statusCustomer: string;
}

// Validación personalizada para asegurarse de que el teléfono empiece con un '3'
function startsWithThree(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value || '';
    return value.startsWith('3') ? null : { startsWithThree: true };
  };
}

// Función para validar que el nombre contenga al menos una vocal
function containsVowel(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value || '';
    const hasVowel = /[aeiouáéíóúAEIOUÁÉÍÓÚ]/.test(value);
    return hasVowel ? null : { noVowel: true };
  };
}

// Función para evitar múltiples espacios en blanco
function singleSpaceValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value || '';
    const hasMultipleSpaces = /\s{2,}/.test(value);
    return hasMultipleSpaces ? { multipleSpaces: true } : null;
  };
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
      name: ['', [
        Validators.required,
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/),
        Validators.minLength(3),
        containsVowel(),
        singleSpaceValidator()
      ]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^\d{10}$/),
        startsWithThree()
      ]],
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
      setTimeout(() => {
        this.initializeDataTable();
      }, 10);
    });
  }

  initializeDataTable(): void {
    const tableElement = document.getElementById('search-table') as HTMLTableElement;
    if (tableElement) {
      new DataTable(tableElement, {
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
          // Recargar la página después de actualizar
          window.location.reload();
        });
      } else {
        this.customerService.createCustomer(customerData).subscribe(() => {
          this.loadCustomers();
          this.closeModal();
        });
        window.location.reload();
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

  onlyNumbers(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  limitPaste(event: ClipboardEvent): void {
    const input = event.target as HTMLInputElement;
    const pastedText = event.clipboardData?.getData('text') || '';
    if (!/^[0-9]*$/.test(pastedText) || pastedText.length + input.value.length > 10) {
      event.preventDefault();
    }
  }

  limitPasteName(event: ClipboardEvent): void {
    const input = event.target as HTMLInputElement;
    const pastedText = event.clipboardData?.getData('text') || '';
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(pastedText)) {
      event.preventDefault();
    }
  }

  limitPasteEmail(event: ClipboardEvent): void {
    const input = event.target as HTMLInputElement;
    const pastedText = event.clipboardData?.getData('text') || '';
    if (/\s/.test(pastedText) || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(pastedText)) {
      event.preventDefault();
    }
  }

  validateNameInput(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    const allowedChars = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    if (!allowedChars.test(event.key)) {
      event.preventDefault();
    }
  }

  preventSpace(event: KeyboardEvent): void {
    if (event.key === ' ') {
      event.preventDefault();
    }
  }

  validateSingleSpace(event: KeyboardEvent): void {
    const input = event.target as HTMLInputElement;
    const lastChar = input.value[input.value.length - 1];
    if (lastChar === ' ' && event.key === ' ') {
      event.preventDefault();
    }
  }
}
