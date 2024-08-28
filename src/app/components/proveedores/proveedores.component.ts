import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../../services/supplier.service';
import { DataTable } from "simple-datatables";

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
        this.suppliers = data;

        // Usamos setTimeout para garantizar que la tabla esté en el DOM
        setTimeout(() => {
            this.initializeDataTable();
        }, 10);
    });
  }


  initializeDataTable(): void {
      const tableElement = document.getElementById("search-table") as HTMLTableElement;
      if (tableElement) {
          const dataTable = new DataTable(tableElement, {
              searchable: true,
              sortable: true
          });
      }
  }
}