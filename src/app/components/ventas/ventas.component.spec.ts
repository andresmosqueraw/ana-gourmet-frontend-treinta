import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VentasComponent } from './ventas.component';
import { SaleService } from '../../services/sale.service';
import { ClienteService } from '../../services/cliente.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

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

describe('VentasComponent', () => {
  let component: VentasComponent;
  let fixture: ComponentFixture<VentasComponent>;
  let saleService: SaleService;
  let clienteService: ClienteService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VentasComponent],
      imports: [ReactiveFormsModule, FormsModule, HttpClientTestingModule],
      providers: [SaleService, ClienteService]
    }).compileComponents();

    fixture = TestBed.createComponent(VentasComponent);
    component = fixture.componentInstance;
    saleService = TestBed.inject(SaleService);
    clienteService = TestBed.inject(ClienteService);

    // Simular métodos del servicio
    spyOn(saleService, 'getSales').and.returnValue(of([]));
    spyOn(saleService, 'createSale').and.returnValue(of({
      id: 0,
      customerId: 1,
      typeLunch: 'Corriente',
      quantity: 1,
      totalSale: 12000,
      saleDate: '',
      createdAt: '',
      userId: 1,
      statusSales: 1
    }));
    spyOn(saleService, 'updateSale').and.returnValue(of({
      id: 0,
      customerId: 1,
      typeLunch: 'Corriente',
      quantity: 1,
      totalSale: 12000,
      saleDate: '',
      createdAt: '',
      userId: 1,
      statusSales: 1
    }));
    spyOn(saleService, 'deleteSale').and.returnValue(of(undefined));
    spyOn(clienteService, 'getCustomers').and.returnValue(of([]));

    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar las ventas al inicializar', () => {
    expect(saleService.getSales).toHaveBeenCalled();
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
    expect(component.selectedid).toBeNull();
  });

  it('debería enviar el formulario para crear una venta', () => {
    component.openModal();
    component.saleForm.setValue({
      customerId: 1,
      typeLunch: 'Corriente',
      quantity: 1,
      totalSale: 12000,
      saleDate: '2023-10-01',
      userId: '1',
      statusSales: '1'
    });
    component.onSubmit();
    expect(saleService.createSale).toHaveBeenCalled();
  });

  it('debería enviar el formulario para actualizar una venta', () => {
    component.openModal(true);
    component.selectedid = 1;
    component.saleForm.setValue({
      customerId: 1,
      typeLunch: 'Corriente',
      quantity: 1,
      totalSale: 12000,
      saleDate: '2023-10-01',
      userId: '1',
      statusSales: '1'
    });
    component.onSubmit();
    expect(saleService.updateSale).toHaveBeenCalled();
  });

  it('debería eliminar una venta después de la confirmación', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteSale(1);
    expect(saleService.deleteSale).toHaveBeenCalledWith(1);
  });

  it('no debería eliminar una venta si no se confirma', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.deleteSale(1);
    expect(saleService.deleteSale).not.toHaveBeenCalled();
  });

  it('debería cargar los clientes al inicializar', () => {
    expect(clienteService.getCustomers).toHaveBeenCalled();
  });

  it('debería calcular correctamente el total de la venta', () => {
    component.saleForm.patchValue({ quantity: 2, typeLunch: 'Corriente' });
    component.calculateTotalSale();
    expect(component.saleForm.get('totalSale')?.value).toEqual(24000);
  });
});