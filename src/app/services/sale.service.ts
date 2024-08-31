import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Sale {
  saleId: number;
  customerId: number;
  typeLunch: string;
  quantity: number;
  totalSale: number;
  saleDate: string;
  createdAt: string;
  userId: number;
  statusSales: number;
}

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private apiUrl = 'http://localhost:8100/api/sale/all';
  private createUrl = 'http://localhost:8100/api/sale/create';
  private searchUrl = 'http://localhost:8100/api/sale/search';
  private deleteUrl = 'http://localhost:8100/api/sale/delete';
  private updateUrl = 'http://localhost:8100/api/sale/update';

  constructor(private http: HttpClient) { }

  getSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.apiUrl);
  }

  createSale(sale: Sale): Observable<Sale> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Sale>(this.createUrl, sale, { headers });
  }

  getSaleById(id: number): Observable<Sale> {
    return this.http.get<Sale>(`${this.searchUrl}/${id}`);
  }

  deleteSale(id: number): Observable<void> {
    return this.http.delete<void>(`${this.deleteUrl}/${id}`);
  }

  updateSale(id: number, sale: Sale): Observable<Sale> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Sale>(`${this.updateUrl}/${id}`, sale, { headers });
  }
}