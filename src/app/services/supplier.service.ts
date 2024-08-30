import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Supplier {
  supplierId: number;
  supplierName: string;
  suppliedProduct: string;
  phone: string;
  createdAt: string;
  userId: string;
  statusSupplier: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private apiUrl = 'http://localhost:8080/api/supplier/all';
  private createUrl = 'http://localhost:8080/api/supplier/create';

  constructor(private http: HttpClient) { }

  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.apiUrl);
  }

  createSupplier(supplier: Supplier): Observable<Supplier> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Supplier>(this.createUrl, supplier, { headers });
  }
}