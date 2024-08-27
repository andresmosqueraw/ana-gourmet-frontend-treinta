import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../../services/supplier.service';


interface Supplier {
  supplierId: number;
  supplierName: string;
  suppliedProduct: string;
  phone: string;
  createdAt: string;
}

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css']
})
export class ProveedoresComponent implements OnInit {
  suppliers: Supplier[] = [];

  constructor(private supplierService: SupplierService) { }

  ngOnInit(): void {
    this.supplierService.getSuppliers().subscribe((data: Supplier[]) => {
      console.log('Data received:', data); // <-- Aquí para ver los datos en la consola
      this.suppliers = data;
    }, error => {
      console.error('Error fetching suppliers:', error);
    });
  }
  
}