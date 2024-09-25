import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InventariosComponent } from './inventarios.component';
import { InventoryService } from '../../services/inventory.service';
import { SupplierService } from '../../services/supplier.service'; // Importa el servicio de proveedores
import { of } from 'rxjs';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';

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

describe('InventariosComponent', () => {
  let component: InventariosComponent;
  let fixture: ComponentFixture<InventariosComponent>;
  let inventoryService: InventoryService;
  let supplierService: SupplierService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InventariosComponent],
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      providers: [InventoryService, SupplierService]
    }).compileComponents();

    fixture = TestBed.createComponent(InventariosComponent);
    component = fixture.componentInstance;
    inventoryService = TestBed.inject(InventoryService);
    supplierService = TestBed.inject(SupplierService);

    // Espiar métodos del servicio
    spyOn(inventoryService, 'getInventories').and.returnValue(of([]));
    spyOn(inventoryService, 'createInventory').and.returnValue(of({
      productId: 0,
      productName: '',
      quantity: 0,
      unitPrice: 0,
      supplierId: 0,
      createdAt: '',
      userId: 1,
      statusInventory: 1
    }));
    spyOn(inventoryService, 'updateInventory').and.returnValue(of({
      productId: 0,
      productName: '',
      quantity: 0,
      unitPrice: 0,
      supplierId: 0,
      createdAt: '',
      userId: 1,
      statusInventory: 1
    }));
    spyOn(inventoryService, 'deleteInventory').and.returnValue(of(undefined));
    spyOn(supplierService, 'getSuppliers').and.returnValue(of([]));

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los inventarios al inicializar', () => {
    expect(inventoryService.getInventories).toHaveBeenCalled();
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
    expect(component.selectedInventoryId).toBeNull();
  });

  it('debería enviar el formulario para crear inventario', () => {
    component.openModal();
    component.inventoryForm.setValue({
      productName: 'Producto Nuevo',
      quantity: 10,
      unitPrice: 5000,
      supplierName: 'Proveedor Prueba',
      userId: '1',
      statusInventory: '1'
    });
    component.onSubmit();
    expect(inventoryService.createInventory).toHaveBeenCalled();
  });

  it('debería enviar el formulario para actualizar inventario', () => {
    component.openModal(true);
    component.selectedInventoryId = 1;
    component.inventoryForm.setValue({
      productName: 'Producto Actualizado',
      quantity: 20,
      unitPrice: 10000,
      supplierName: 'Proveedor Actualizado',
      userId: '1',
      statusInventory: '1'
    });
    component.onSubmit();
    expect(inventoryService.updateInventory).toHaveBeenCalled();
  });

  it('debería eliminar un inventario después de la confirmación', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteInventory(1);
    expect(inventoryService.deleteInventory).toHaveBeenCalledWith(1);
  });

  it('no debería eliminar un inventario si no se confirma', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.deleteInventory(1);
    expect(inventoryService.deleteInventory).not.toHaveBeenCalled();
  });

  it('debería cargar los proveedores al inicializar', () => {
    expect(supplierService.getSuppliers).toHaveBeenCalled();
  });
});