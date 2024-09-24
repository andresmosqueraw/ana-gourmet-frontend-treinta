import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Cliente {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  userId: string;
  statusCustomer: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = 'http://localhost:8100/api/customer/all';
  private createUrl = 'http://localhost:8100/api/customer/create';
  private searchUrl = 'http://localhost:8100/api/customer/search';
  private deleteUrl = 'http://localhost:8100/api/customer/delete';
  private updateUrl = 'http://localhost:8100/api/customer/update';


  constructor(private http: HttpClient) { }

  getCustomers(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  createCustomer(customer: Cliente): Observable<Cliente> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Cliente>(this.createUrl, customer, { headers });
  }

  getCustomerById(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.searchUrl}/${id}`);
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.deleteUrl}/${id}`);
  }

  updateCustomer(id: number, customer: Cliente): Observable<Cliente> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Cliente>(`${this.updateUrl}/${id}`, customer, { headers });
  }
}