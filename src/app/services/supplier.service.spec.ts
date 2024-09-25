import { TestBed } from '@angular/core/testing';
import { SupplierService } from './supplier.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

interface Supplier {
  supplierId: number;
  supplierName: string;
  supplierProduct: string;
  phone: string;
  createdAt: string;
  userId: string;
  statusSupplier: string;
}

describe('SupplierService', () => {
  let service: SupplierService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://35.188.66.64:8090/api/supplier/all';
  const createUrl = 'http://35.188.66.64:8090/api/supplier/create';
  const searchUrl = 'http://35.188.66.64:8090/api/supplier/search';
  const deleteUrl = 'http://35.188.66.64:8090/api/supplier/delete';
  const updateUrl = 'http://35.188.66.64:8090/api/supplier/update';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SupplierService]
    });
    service = TestBed.inject(SupplierService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debería recuperar los proveedores', () => {
    const dummySuppliers: Supplier[] = [
      {
        supplierId: 1,
        supplierName: 'Proveedor Uno',
        supplierProduct: 'Producto Uno',
        phone: '3000000000',
        createdAt: '2023-10-01T00:00:00Z',
        userId: '1',
        statusSupplier: '1'
      },
      {
        supplierId: 2,
        supplierName: 'Proveedor Dos',
        supplierProduct: 'Producto Dos',
        phone: '3000000001',
        createdAt: '2023-10-02T00:00:00Z',
        userId: '1',
        statusSupplier: '1'
      }
    ];

    service.getSuppliers().subscribe(suppliers => {
      expect(suppliers.length).toBe(2);
      expect(suppliers).toEqual(dummySuppliers);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dummySuppliers);
  });

  it('debería crear un proveedor', () => {
    const newSupplier: Supplier = {
      supplierId: 3,
      supplierName: 'Proveedor Tres',
      supplierProduct: 'Producto Tres',
      phone: '3000000002',
      createdAt: '2023-10-03T00:00:00Z',
      userId: '1',
      statusSupplier: '1'
    };

    service.createSupplier(newSupplier).subscribe(supplier => {
      expect(supplier).toEqual(newSupplier);
    });

    const req = httpMock.expectOne(createUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newSupplier);
    req.flush(newSupplier);
  });

  it('debería obtener un proveedor por ID', () => {
    const supplierId = 1;
    const supplier: Supplier = {
      supplierId: supplierId,
      supplierName: 'Proveedor Uno',
      supplierProduct: 'Producto Uno',
      phone: '3000000000',
      createdAt: '2023-10-01T00:00:00Z',
      userId: '1',
      statusSupplier: '1'
    };

    service.getSupplierById(supplierId).subscribe(data => {
      expect(data).toEqual(supplier);
    });

    const req = httpMock.expectOne(`${searchUrl}/${supplierId}`);
    expect(req.request.method).toBe('GET');
    req.flush(supplier);
  });

  it('debería actualizar un proveedor', () => {
    const supplierId = 1;
    const updatedSupplier: Supplier = {
      supplierId: supplierId,
      supplierName: 'Proveedor Actualizado',
      supplierProduct: 'Producto Actualizado',
      phone: '3000000003',
      createdAt: '2023-10-01T00:00:00Z',
      userId: '1',
      statusSupplier: '1'
    };

    service.updateSupplier(supplierId, updatedSupplier).subscribe(supplier => {
      expect(supplier).toEqual(updatedSupplier);
    });

    const req = httpMock.expectOne(`${updateUrl}/${supplierId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedSupplier);
    req.flush(updatedSupplier);
  });

  it('debería eliminar un proveedor', () => {
    const supplierId = 1;

    service.deleteSupplier(supplierId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${deleteUrl}/${supplierId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});