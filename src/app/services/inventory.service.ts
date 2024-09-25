import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = 'http://35.188.66.64:8201/api/inventory/all';
  private createUrl = 'http://35.188.66.64:8201/api/inventory/create';
  private searchUrl = 'http://35.188.66.64:8201/api/inventory/search';
  private deleteUrl = 'http://35.188.66.64:8201/api/inventory/delete';
  private updateUrl = 'http://35.188.66.64:8201/api/inventory/update';

  constructor(private http: HttpClient) { }

  getInventories(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(this.apiUrl);
  }

  createInventory(inventory: Inventory): Observable<Inventory> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<Inventory>(this.createUrl, inventory, { headers });
  }

  getInventoryById(id: number): Observable<Inventory> {
    return this.http.get<Inventory>(`${this.searchUrl}/${id}`);
  }

  deleteInventory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.deleteUrl}/${id}`);
  }

  updateInventory(id: number, inventory: Inventory): Observable<Inventory> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<Inventory>(`${this.updateUrl}/${id}`, inventory, { headers });
  }
}