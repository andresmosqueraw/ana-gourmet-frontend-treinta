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
  totalInventory: number = 0;
  totalSales: number = 0;
  totalSuppliers: number = 0;

  inventories: any[] = [];  // Store inventory data here

  constructor(
    private inventoryService: InventoryService,
    private saleService: SaleService,
    private supplierService: SupplierService
  ) {}

  ngOnInit(): void {
    this.loadInventoryChart();
    this.loadSalesChart();
    this.loadSuppliersChart();
    this.calculateTotals();
    this.loadInventories();
  }

  // Gráfico de inventarios (Area Chart)
  // Gráfico de inventarios (Bar Chart)
loadInventoryChart(): void {
  this.inventoryService.getInventories().subscribe(data => {
    const productNames = data.map(inventory => inventory.productName);
    const quantities = data.map(inventory => inventory.quantity);

    const options = {
      series: [
        {
          name: 'Cantidad en inventario',
          data: quantities,
          color: "#31C48D", // Color para barras
        }
      ],
      chart: {
        type: 'bar',
        height: 400,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: false, // Configuración para barras verticales
          columnWidth: '70%',
          borderRadius: 4
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: productNames,
        labels: {
          style: {
            fontFamily: "Inter, sans-serif",
            cssClass: 'text-xs font-normal text-gray-500 dark:text-gray-400'
          }
        }
      },
      yaxis: {
        labels: {
          formatter: function (val: number) {
            return val.toFixed(0);
          },
          style: {
            fontFamily: "Inter, sans-serif",
            cssClass: 'text-xs font-normal text-gray-500 dark:text-gray-400'
          }
        }
      },
      grid: {
        show: true,
        strokeDashArray: 4,
        padding: {
          left: 10,
          right: 10
        }
      },
      tooltip: {
        shared: true,
        intersect: false,
        y: {
          formatter: function (val: number) {
            return val.toFixed(0);
          }
        }
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

  // Función para calcular totales
  calculateTotals(): void {
    this.inventoryService.getInventories().subscribe(data => {
      this.totalInventory = data.reduce((sum, inventory) => sum + inventory.quantity, 0);
    });

    this.saleService.getSales().subscribe(data => {
      this.totalSales = data.reduce((sum, sale) => sum + sale.totalSale, 0);
    });

    this.supplierService.getSuppliers().subscribe(data => {
      this.totalSuppliers = data.length;
    });
  }

  loadInventories(): void {
    this.inventoryService.getInventories().subscribe((data) => {
      this.inventories = data;  // Store the data for rendering
    });
  }
}