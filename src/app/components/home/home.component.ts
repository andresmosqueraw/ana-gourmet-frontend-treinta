import { Component, OnInit } from '@angular/core';
import { InventoryService } from '../../services/inventory.service';
import { SaleService } from '../../services/sale.service';
import { SupplierService } from '../../services/supplier.service';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private inventoryService: InventoryService,
    private saleService: SaleService,
    private supplierService: SupplierService
  ) {}

  ngOnInit(): void {
    this.loadInventoryChart();
    this.loadSalesChart();
    this.loadSuppliersChart();
  }

  // Gráfico de inventarios (Area Chart)
  loadInventoryChart(): void {
    this.inventoryService.getInventories().subscribe(data => {
      const productNames = data.map(inventory => inventory.productName);
      const quantities = data.map(inventory => inventory.quantity);

      const options = {
        chart: {
          type: 'area',
          height: '100%',
          maxWidth: '100%'
        },
        series: [
          {
            name: 'Cantidad en inventario',
            data: quantities
          }
        ],
        xaxis: {
          categories: productNames
        }
      };

      const chart = new ApexCharts(document.getElementById('inventory-chart'), options);
      chart.render();
    });
  }

  // Gráfico de ventas (Line Chart)
  loadSalesChart(): void {
    this.saleService.getSales().subscribe(data => {
      const saleDates = data.map(sale => sale.saleDate);
      const totalSales = data.map(sale => sale.totalSale);

      const options = {
        chart: {
          type: 'line',
          height: '100%',
          maxWidth: '100%'
        },
        series: [
          {
            name: 'Ventas Totales',
            data: totalSales
          }
        ],
        xaxis: {
          categories: saleDates
        }
      };

      const chart = new ApexCharts(document.getElementById('sales-chart'), options);
      chart.render();
    });
  }

  // Gráfico de proveedores (Donut Chart)
  loadSuppliersChart(): void {
    this.supplierService.getSuppliers().subscribe(data => {
      const supplierProducts = data.map(supplier => supplier.supplierProduct);
      const supplierCounts = supplierProducts.reduce((acc: { [key: string]: number }, product: string) => {
        acc[product] = (acc[product] || 0) + 1;
        return acc;
      }, {});      

      const productNames = Object.keys(supplierCounts);
      const counts = Object.values(supplierCounts);

      const options = {
        chart: {
          type: 'donut',
          height: '100%',
          maxWidth: '100%'
        },
        series: counts,
        labels: productNames
      };

      const chart = new ApexCharts(document.getElementById('suppliers-chart'), options);
      chart.render();
    });
  }
}