import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../../services/supplier.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataTable } from "simple-datatables";
import { AbstractControl, ValidatorFn } from '@angular/forms';

//Validación para celular
function startsWithThree(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value || '';
    return value.startsWith('3') ? null : { startsWithThree: true };
  };
}
// Validación personalizada para asegurar que el nombre tenga al menos una vocal
function containsVowel(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value || '';
    const hasVowel = /[aeiouáéíóúAEIOUÁÉÍÓÚ]/.test(value);
    return hasVowel ? null : { noVowel: true };
  };
}

// Validación personalizada para evitar múltiples espacios consecutivos
function singleSpaceValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value || '';
    const hasMultipleSpaces = /\s{2,}/.test(value);
    const startsOrEndsWithSpace = /^\s|\s$/.test(value);
    return hasMultipleSpaces || startsOrEndsWithSpace ? { multipleSpaces: true } : null;
  };
}
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

constructor(private fb: FormBuilder, private supplierService: SupplierService) { 
  this.supplierForm = this.fb.group({
    supplierName: ['', [
      Validators.required, 
      Validators.pattern(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ _\-&\/]+$/),  // Permitir caracteres válidos
      Validators.minLength(3),
      containsVowel(),  // Al menos una vocal
      singleSpaceValidator()  // No permitir múltiples espacios
    ]],
    supplierProduct: ['', Validators.required],
    phone: ['', [
      Validators.required, 
      Validators.pattern(/^\d{10}$/),  // Validación para que tenga exactamente 10 dígitos
      startsWithThree()  // Verifica que el teléfono comience con un '3'
    ]],
    userId: ['1', Validators.required],
    statusSupplier: ['1', Validators.required]
  });
}
ngOnInit(): void {
  this.loadSuppliers();
}

loadSuppliers(): void {
  this.supplierService.getSuppliers().subscribe((data: Supplier[]) => {
      this.suppliers = data;

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

reloadPage(): void {
  window.location.reload();
}

// Envío de formulario
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
        this.reloadPage(); // Usar el método en lugar de window.location.reload()
      });
    } else {
      // Crear nuevo proveedor
      this.supplierService.createSupplier(supplierData).subscribe(() => {
        this.loadSuppliers();
        this.closeModal();
        this.reloadPage(); // Usar el método en lugar de window.location.reload()
      });
    }
  } else {
    this.supplierForm.markAllAsTouched(); // Marca todos los campos como tocados para mostrar errores
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
      this.loadSuppliers();
      this.reloadPage(); // Usar el método en lugar de window.location.reload()
    });
  }
}

// Prevenir múltiples espacios al escribir
validateSingleSpace(event: KeyboardEvent): void {
  const input = event.target as HTMLInputElement;
  const lastChar = input.value[input.value.length - 1];

  // Si el último carácter es un espacio y el nuevo carácter también es un espacio, prevenir la entrada
  if (lastChar === ' ' && event.key === ' ') {
    event.preventDefault();
  }
}

// Prevenir entrada de caracteres no numéricos en teléfono
onlyNumbers(event: KeyboardEvent): boolean {
  const key = event.key;

  // Permitir solo números del 0 al 9
  if (!/^\d$/.test(key)) {
    event.preventDefault();
    return false;
  }
  return true;
}

// Limitar el pegado de texto en el campo de teléfono
limitPaste(event: ClipboardEvent): void {
  const input = event.target as HTMLInputElement;
  const pastedText = event.clipboardData?.getData('text') || '';
  
  // Permitir solo números y asegurarse de que el texto pegado no exceda 10 caracteres
  if (!/^[0-9]*$/.test(pastedText) || pastedText.length + input.value.length > 10) {
    event.preventDefault();
  }
}

// Validar entrada de nombre para permitir solo caracteres válidos
validateNameInput(event: KeyboardEvent): void {
  const charCode = event.key.charCodeAt(0);
  
  // Expresión regular que permite letras, números, guiones, vocales con tildes, espacio y algunos caracteres especiales (&_/)
  const allowedChars = /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ _\-&\/]$/;

  // Si el carácter no coincide con el patrón permitido, prevenir la entrada
  if (!allowedChars.test(event.key)) {
    event.preventDefault();
  }
}
}


