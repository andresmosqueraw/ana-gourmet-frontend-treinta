import { TestBed } from '@angular/core/testing';
import { SaleService } from './sale.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

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

describe('SaleService', () => {
  let service: SaleService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://localhost:8101/api/sale/all';
  const createUrl = 'http://localhost:8101/api/sale/create';
  const searchUrl = 'http://localhost:8101/api/sale/search';
  const deleteUrl = 'http://localhost:8101/api/sale/delete';
  const updateUrl = 'http://localhost:8101/api/sale/update';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SaleService]
    });
    service = TestBed.inject(SaleService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debería recuperar las ventas', () => {
    const dummySales: Sale[] = [
      {
        id: 1,
        customerId: 1,
        typeLunch: 'Corriente',
        quantity: 1,
        totalSale: 12000,
        saleDate: '2023-10-01',
        createdAt: '2023-10-01T00:00:00Z',
        userId: 1,
        statusSales: 1
      },
      {
        id: 2,
        customerId: 2,
        typeLunch: 'Ejecutivo',
        quantity: 1,
        totalSale: 14000,
        saleDate: '2023-10-02',
        createdAt: '2023-10-02T00:00:00Z',
        userId: 1,
        statusSales: 1
      }
    ];

    service.getSales().subscribe(sales => {
      expect(sales.length).toBe(2);
      expect(sales).toEqual(dummySales);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dummySales);
  });

  it('debería crear una venta', () => {
    const newSale: Sale = {
      id: 3,
      customerId: 3,
      typeLunch: 'Corriente',
      quantity: 2,
      totalSale: 24000,
      saleDate: '2023-10-03',
      createdAt: '2023-10-03T00:00:00Z',
      userId: 1,
      statusSales: 1
    };

    service.createSale(newSale).subscribe(sale => {
      expect(sale).toEqual(newSale);
    });

    const req = httpMock.expectOne(createUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newSale);
    req.flush(newSale);
  });

  it('debería obtener una venta por ID', () => {
    const saleId = 1;
    const sale: Sale = {
      id: saleId,
      customerId: 1,
      typeLunch: 'Corriente',
      quantity: 1,
      totalSale: 12000,
      saleDate: '2023-10-01',
      createdAt: '2023-10-01T00:00:00Z',
      userId: 1,
      statusSales: 1
    };

    service.getSaleById(saleId).subscribe(data => {
      expect(data).toEqual(sale);
    });

    const req = httpMock.expectOne(`${searchUrl}/${saleId}`);
    expect(req.request.method).toBe('GET');
    req.flush(sale);
  });

  it('debería actualizar una venta', () => {
    const saleId = 1;
    const updatedSale: Sale = {
      id: saleId,
      customerId: 1,
      typeLunch: 'Corriente',
      quantity: 2,
      totalSale: 24000,
      saleDate: '2023-10-01',
      createdAt: '2023-10-01T00:00:00Z',
      userId: 1,
      statusSales: 1
    };

    service.updateSale(saleId, updatedSale).subscribe(sale => {
      expect(sale).toEqual(updatedSale);
    });

    const req = httpMock.expectOne(`${updateUrl}/${saleId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedSale);
    req.flush(updatedSale);
  });

  it('debería eliminar una venta', () => {
    const saleId = 1;

    service.deleteSale(saleId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${deleteUrl}/${saleId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});