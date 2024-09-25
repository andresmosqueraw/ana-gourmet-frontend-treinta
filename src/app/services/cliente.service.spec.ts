import { TestBed } from '@angular/core/testing';
import { ClienteService } from './cliente.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

interface Cliente {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  userId: string;
  statusCustomer: string;
}

describe('ClienteService', () => {
  let service: ClienteService;
  let httpMock: HttpTestingController;
  const apiUrl = 'http://35.188.66.64:8080/api/customer/all';
  const createUrl = 'http://35.188.66.64:8080/api/customer/create';
  const searchUrl = 'http://35.188.66.64:8080/api/customer/search';
  const deleteUrl = 'http://35.188.66.64:8080/api/customer/delete';
  const updateUrl = 'http://35.188.66.64:8080/api/customer/update';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClienteService]
    });
    service = TestBed.inject(ClienteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('debería recuperar los clientes', () => {
    const dummyCustomers: Cliente[] = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        phone: '3000000000',
        createdAt: '2023-09-24T00:00:00Z',
        userId: '1',
        statusCustomer: '1'
      },
      {
        id: 2,
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '3000000001',
        createdAt: '2023-09-24T00:00:00Z',
        userId: '1',
        statusCustomer: '1'
      }
    ];

    service.getCustomers().subscribe(customers => {
      expect(customers.length).toBe(2);
      expect(customers).toEqual(dummyCustomers);
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('GET');
    req.flush(dummyCustomers);
  });

  it('debería crear un cliente', () => {
    const newCustomer: Cliente = {
      id: 3,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '3000000000',
      createdAt: '2023-09-24T00:00:00Z',
      userId: '1',
      statusCustomer: '1'
    };

    service.createCustomer(newCustomer).subscribe(customer => {
      expect(customer).toEqual(newCustomer);
    });

    const req = httpMock.expectOne(createUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newCustomer);
    req.flush(newCustomer);
  });

  it('debería obtener un cliente por ID', () => {
    const customerId = 1;
    const customer: Cliente = {
      id: customerId,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '3000000000',
      createdAt: '2023-09-24T00:00:00Z',
      userId: '1',
      statusCustomer: '1'
    };

    service.getCustomerById(customerId).subscribe(data => {
      expect(data).toEqual(customer);
    });

    const req = httpMock.expectOne(`${searchUrl}/${customerId}`);
    expect(req.request.method).toBe('GET');
    req.flush(customer);
  });

  it('debería actualizar un cliente', () => {
    const customerId = 1;
    const updatedCustomer: Cliente = {
      id: customerId,
      name: 'John Doe',
      email: 'john@example.com',
      phone: '3000000000',
      createdAt: '2023-09-24T00:00:00Z',
      userId: '1',
      statusCustomer: '1'
    };

    service.updateCustomer(customerId, updatedCustomer).subscribe(customer => {
      expect(customer).toEqual(updatedCustomer);
    });

    const req = httpMock.expectOne(`${updateUrl}/${customerId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedCustomer);
    req.flush(updatedCustomer);
  });

  it('debería eliminar un cliente', () => {
    const customerId = 1;

    service.deleteCustomer(customerId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${deleteUrl}/${customerId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});