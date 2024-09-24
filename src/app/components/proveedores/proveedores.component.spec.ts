import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProveedoresComponent } from './proveedores.component';
import { SupplierService } from '../../services/supplier.service';
import { of } from 'rxjs';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

interface Supplier {
  supplierId: number;
  supplierName: string;
  supplierProduct: string;
  phone: string;
  createdAt: string;
  userId: string;
  statusSupplier: string;
}

describe('ProveedoresComponent', () => {
  let component: ProveedoresComponent;
  let fixture: ComponentFixture<ProveedoresComponent>;
  let supplierService: SupplierService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProveedoresComponent],
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      providers: [SupplierService]
    }).compileComponents();

    fixture = TestBed.createComponent(ProveedoresComponent);
    component = fixture.componentInstance;
    supplierService = TestBed.inject(SupplierService);

    // Simular métodos del servicio
    spyOn(supplierService, 'getSuppliers').and.returnValue(of([]));
    spyOn(supplierService, 'createSupplier').and.returnValue(of({
      supplierId: 0,
      supplierName: '',
      supplierProduct: '',
      phone: '',
      createdAt: '',
      userId: '',
      statusSupplier: ''
    }));
    spyOn(supplierService, 'updateSupplier').and.returnValue(of({
      supplierId: 0,
      supplierName: '',
      supplierProduct: '',
      phone: '',
      createdAt: '',
      userId: '',
      statusSupplier: ''
    }));
    spyOn(supplierService, 'deleteSupplier').and.returnValue(of(undefined));
    spyOn(supplierService, 'getSupplierById').and.returnValue(of({
      supplierId: 0,
      supplierName: '',
      supplierProduct: '',
      phone: '',
      createdAt: '',
      userId: '',
      statusSupplier: ''
    }));

    // Espiar el método reloadPage en lugar de window.location.reload
    spyOn(component, 'reloadPage');

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los proveedores al inicializar', () => {
    expect(supplierService.getSuppliers).toHaveBeenCalled();
  });

  it('debería abrir el modal en modo creación', () => {
    component.openModal();
    expect(component.showModal).toBeTrue();
    expect(component.isEditMode).toBeFalse();
  });

  it('debería abrir el modal en modo edición', () => {
    component.openModal(true);
    expect(component.showModal).toBeTrue();
    expect(component.isEditMode).toBeTrue();
  });

  it('debería cerrar el modal', () => {
    component.closeModal();
    expect(component.showModal).toBeFalse();
    expect(component.selectedSupplierId).toBeNull();
  });

  it('debería enviar el formulario para crear proveedor', () => {
    component.openModal();
    component.supplierForm.setValue({
      supplierName: 'Proveedor Nuevo',
      supplierProduct: 'Producto',
      phone: '3000000000',
      userId: '1',
      statusSupplier: '1'
    });
    component.onSubmit();
    expect(supplierService.createSupplier).toHaveBeenCalled();
  });

  it('debería enviar el formulario para actualizar proveedor', () => {
    component.openModal(true);
    component.selectedSupplierId = 1;
    component.supplierForm.setValue({
      supplierName: 'Proveedor Actualizado',
      supplierProduct: 'Producto Actualizado',
      phone: '3000000000',
      userId: '1',
      statusSupplier: '1'
    });
    component.onSubmit();
    expect(supplierService.updateSupplier).toHaveBeenCalled();
  });

  it('debería editar un proveedor', () => {
    const supplierData: Supplier = {
      supplierId: 1,
      supplierName: 'Proveedor Uno',
      supplierProduct: 'Producto Uno',
      phone: '3000000000',
      createdAt: '2023-10-01T00:00:00Z',
      userId: '1',
      statusSupplier: '1'
    };
    (supplierService.getSupplierById as jasmine.Spy).and.returnValue(of(supplierData));
    component.editSupplier(1);
    expect(component.selectedSupplierId).toBe(1);
    expect(component.showModal).toBeTrue();
    expect(component.isEditMode).toBeTrue();
    expect(component.supplierForm.value.supplierName).toBe('Proveedor Uno');
  });

  it('debería eliminar un proveedor después de la confirmación', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteSupplier(1);
    expect(supplierService.deleteSupplier).toHaveBeenCalledWith(1);
  });

  it('no debería eliminar un proveedor si no se confirma', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.deleteSupplier(1);
    expect(supplierService.deleteSupplier).not.toHaveBeenCalled();
  });

  it('debería marcar el formulario como tocado si es inválido al enviar', () => {
    component.openModal();
    spyOn(component.supplierForm, 'markAllAsTouched');
    component.onSubmit();
    expect(component.supplierForm.markAllAsTouched).toHaveBeenCalled();
  });

  it('debería prevenir múltiples espacios en validateSingleSpace', () => {
    const event = new KeyboardEvent('keypress', { key: ' ' });
    const inputElement = document.createElement('input');
    inputElement.value = 'Texto ';
    Object.defineProperty(event, 'target', { value: inputElement });
    spyOn(event, 'preventDefault');

    component.validateSingleSpace(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('debería permitir números en onlyNumbers', () => {
    const event = new KeyboardEvent('keypress', { key: '1' });
    const result = component.onlyNumbers(event);
    expect(result).toBeTrue();
  });  

  it('debería prevenir entrada no numérica en onlyNumbers', () => {
    const event = new KeyboardEvent('keypress', { key: 'a' });
    spyOn(event, 'preventDefault');
    const result = component.onlyNumbers(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(result).toBeFalse();
  });  

  it('debería prevenir pegado inválido en limitPaste', () => {
    const event = new ClipboardEvent('paste', {
      clipboardData: new DataTransfer()
    });
    event.clipboardData?.setData('text', 'abc123');
    const inputElement = document.createElement('input');
    inputElement.value = '';
    Object.defineProperty(event, 'target', { value: inputElement });
    spyOn(event, 'preventDefault');

    component.limitPaste(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('debería prevenir caracteres inválidos en validateNameInput', () => {
    const event = new KeyboardEvent('keypress', { key: '@' });
    spyOn(event, 'preventDefault');
    component.validateNameInput(event);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('debería permitir caracteres válidos en validateNameInput', () => {
    const event = new KeyboardEvent('keypress', { key: 'A' });
    component.validateNameInput(event);
    expect(event.defaultPrevented).toBeFalse();
  });
});