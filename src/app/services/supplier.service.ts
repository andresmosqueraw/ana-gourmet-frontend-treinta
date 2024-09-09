import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Supplier {
  supplierId: number;
  supplierName: string;
  supplierProduct: string;
  phone: string;
  createdAt: string;
  userId: string;
  statusSupplier: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private apiUrl = 'http://localhost:8090/api/supplier/all';
  private createUrl = 'http://localhost:8090/api/supplier/create';
  private searchUrl = 'http://localhost:8090/api/supplier/search';
  private deleteUrl = 'http://localhost:8090/api/supplier/delete';
  private updateUrl = 'http://localhost:8090/api/supplier/update';

  constructor(private http: HttpClient) { }

  getSuppliers(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.apiUrl);
  }

  createSupplier(supplier: Supplier): Observable<Supplier> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Supplier>(this.createUrl, supplier, { headers });
  }

  getSupplierById(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.searchUrl}/${id}`);
  }

  deleteSupplier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.deleteUrl}/${id}`);
  }

  updateSupplier(id: number, supplier: Supplier): Observable<Supplier> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Supplier>(`${this.updateUrl}/${id}`, supplier, { headers });
  }
}
