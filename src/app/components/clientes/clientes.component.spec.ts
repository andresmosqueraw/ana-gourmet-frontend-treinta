import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClientesComponent } from './clientes.component';
import { ClienteService } from '../../services/cliente.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

interface Cliente {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  userId: string;
  statusCustomer: string;
}

describe('ClientesComponent', () => {
  let component: ClientesComponent;
  let fixture: ComponentFixture<ClientesComponent>;
  let clienteService: ClienteService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClientesComponent],
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      providers: [ClienteService]
    }).compileComponents();

    fixture = TestBed.createComponent(ClientesComponent);
    component = fixture.componentInstance;
    clienteService = TestBed.inject(ClienteService);

    // Simular métodos del servicio
    spyOn(clienteService, 'getCustomers').and.returnValue(of([]));
    spyOn(clienteService, 'createCustomer').and.returnValue(of({
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '3000000000',
      createdAt: '2023-09-24T00:00:00Z',
      userId: '1',
      statusCustomer: '1'
    }));
    spyOn(clienteService, 'updateCustomer').and.returnValue(of({
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '3000000000',
      createdAt: '2023-09-24T00:00:00Z',
      userId: '1',
      statusCustomer: '1'
    }));
    spyOn(clienteService, 'deleteCustomer').and.returnValue(of(undefined));

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los clientes al inicializar', () => {
    expect(clienteService.getCustomers).toHaveBeenCalled();
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
    expect(component.selectedCustomerId).toBeNull();
  });

  it('debería enviar el formulario para crear cliente', () => {
    component.openModal();
    component.customerForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '3000000000',
      userId: '1',
      statusCustomer: '1'
    });
    component.onSubmit();
    expect(clienteService.createCustomer).toHaveBeenCalled();
  });

  it('debería enviar el formulario para actualizar cliente', () => {
    component.openModal(true);
    component.selectedCustomerId = 1;
    component.customerForm.setValue({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '3000000000',
      userId: '1',
      statusCustomer: '1'
    });
    component.onSubmit();
    expect(clienteService.updateCustomer).toHaveBeenCalled();
  });

  it('debería eliminar un cliente después de la confirmación', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteCustomer(1);
    expect(clienteService.deleteCustomer).toHaveBeenCalledWith(1);
  });

  it('no debería eliminar un cliente si no se confirma', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.deleteCustomer(1);
    expect(clienteService.deleteCustomer).not.toHaveBeenCalled();
  });

  it('debería validar que el teléfono comience con "3"', () => {
    const control = component.customerForm.get('phone');
    control?.setValue('2000000000');
    expect(control?.errors?.['startsWithThree']).toBeTrue();

    control?.setValue('3000000000');
    expect(control?.errors).toBeNull();
  });

  it('debería validar que el nombre contenga al menos una vocal', () => {
    const control = component.customerForm.get('name');
    control?.setValue('bcdfg');
    expect(control?.errors?.['noVowel']).toBeTrue();

    control?.setValue('abc');
    expect(control?.errors).toBeNull();
  });

  it('debería prevenir múltiples espacios en blanco en el nombre', () => {
    const control = component.customerForm.get('name');
    control?.setValue('John  Doe');
    expect(control?.errors?.['multipleSpaces']).toBeTrue();

    control?.setValue('John Doe');
    expect(control?.errors).toBeNull();
  });
});