import { TestBed } from '@angular/core/testing';
import { InventoryService } from './inventory.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

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

describe('InventoryService', () => {
  let service: InventoryService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://35.188.66.64:8201/api/inventory/all';
  const createUrl = 'http://35.188.66.64:8201/api/inventory/create';
  const searchUrl = 'http://35.188.66.64:8201/api/inventory/search';
  const deleteUrl = 'http://35.188.66.64:8201/api/inventory/delete';
  const updateUrl = 'http://35.188.66.64:8201/api/inventory/update';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [InventoryService]
    });
    service = TestBed.inject(InventoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debería recuperar los inventarios', () => {
    const dummyInventories: Inventory[] = [
      {
        productId: 1,
        productName: 'Producto Uno',
        quantity: 10,
        unitPrice: 5000,
        supplierId: 1,
        createdAt: '2023-10-01T00:00:00Z',
        userId: 1,
        statusInventory: 1
      },
      {
        productId: 2,
        productName: 'Producto Dos',
        quantity: 20,
        unitPrice: 10000,
        supplierId: 2,
        createdAt: '2023-10-02T00:00:00Z',
        userId: 1,
        statusInventory: 1
      }
    ];

    service.getInventories().subscribe(inventories => {
      expect(inventories.length).toBe(2);
      expect(inventories).toEqual(dummyInventories);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dummyInventories);
  });

  it('debería crear un inventario', () => {
    const newInventory: Inventory = {
      productId: 3,
      productName: 'Producto Tres',
      quantity: 30,
      unitPrice: 15000,
      supplierId: 3,
      createdAt: '2023-10-03T00:00:00Z',
      userId: 1,
      statusInventory: 1
    };

    service.createInventory(newInventory).subscribe(inventory => {
      expect(inventory).toEqual(newInventory);
    });

    const req = httpMock.expectOne(createUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newInventory);
    req.flush(newInventory);
  });

  it('debería obtener un inventario por ID', () => {
    const inventoryId = 1;
    const inventory: Inventory = {
      productId: inventoryId,
      productName: 'Producto Uno',
      quantity: 10,
      unitPrice: 5000,
      supplierId: 1,
      createdAt: '2023-10-01T00:00:00Z',
      userId: 1,
      statusInventory: 1
    };

    service.getInventoryById(inventoryId).subscribe(data => {
      expect(data).toEqual(inventory);
    });

    const req = httpMock.expectOne(`${searchUrl}/${inventoryId}`);
    expect(req.request.method).toBe('GET');
    req.flush(inventory);
  });

  it('debería actualizar un inventario', () => {
    const inventoryId = 1;
    const updatedInventory: Inventory = {
      productId: inventoryId,
      productName: 'Producto Actualizado',
      quantity: 15,
      unitPrice: 7500,
      supplierId: 1,
      createdAt: '2023-10-01T00:00:00Z',
      userId: 1,
      statusInventory: 1
    };

    service.updateInventory(inventoryId, updatedInventory).subscribe(inventory => {
      expect(inventory).toEqual(updatedInventory);
    });

    const req = httpMock.expectOne(`${updateUrl}/${inventoryId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedInventory);
    req.flush(updatedInventory);
  });

  it('debería eliminar un inventario', () => {
    const inventoryId = 1;

    service.deleteInventory(inventoryId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${deleteUrl}/${inventoryId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});