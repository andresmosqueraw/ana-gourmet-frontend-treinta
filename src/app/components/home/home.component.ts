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
  suppliers: any[] = [];    // Store suppliers data here

  constructor(
    private inventoryService: InventoryService,
    private saleService: SaleService,
    private supplierService: SupplierService
  ) {}

  ngOnInit(): void {
    this.loadInventoryChart();
    this.loadSalesChart();
    this.loadSuppliersChart();
    this.loadSalesByDayChart();
    this.loadSupplierGrowthChart();
    this.loadSalesByProductChart();
    this.loadSalesByCustomerChart();
    this.loadTopInventoryProductsChart();
    this.calculateTotals();
    this.loadInventories();
    this.loadSuppliers(); 
  }  

  // Función para obtener el nombre del proveedor por su ID
  getSupplierName(supplierId: number): string {
    const supplier = this.suppliers.find(s => s.supplierId === supplierId);
    return supplier ? supplier.supplierName : 'Proveedor no encontrado';
  }

  loadSuppliers(): void {
    this.supplierService.getSuppliers().subscribe((data) => {
      this.suppliers = data;  // Store the suppliers for rendering
    });
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

  // Gráfico de ventas por día de la semana (Pie Chart)
  loadSalesByDayChart(): void {
    this.saleService.getSales().subscribe(data => {
      const salesByDay = data.reduce((acc: { [key: string]: number }, sale) => {
        const day = new Date(sale.saleDate).toLocaleString('es-ES', { weekday: 'long' });
        acc[day] = (acc[day] || 0) + sale.totalSale;
        return acc;
      }, {});

      const days = Object.keys(salesByDay);
      const sales = Object.values(salesByDay);

      const options = {
        chart: {
          type: 'pie',
          height: '100%',
          maxWidth: '100%'
        },
        series: sales,
        labels: days
      };

      const chart = new ApexCharts(document.getElementById('sales-by-day-chart'), options);
      chart.render();
    });
  }

  // Gráfico de crecimiento de proveedores por día (Line Chart)
  loadSupplierGrowthChart(): void {
    this.supplierService.getSuppliers().subscribe(data => {
      // Agrupar proveedores por día
      const suppliersByDay = data.reduce((acc: { [key: string]: number }, supplier) => {
        const day = new Date(supplier.createdAt).toLocaleString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
        acc[day] = (acc[day] || 0) + 1;
        return acc;
      }, {});

      const days = Object.keys(suppliersByDay); // Días en los que se registraron proveedores
      const suppliersCount = Object.values(suppliersByDay); // Cantidad de proveedores por día

      const options = {
        chart: {
          type: 'line',
          height: '100%',
          maxWidth: '100%'
        },
        series: [{
          name: 'Proveedores',
          data: suppliersCount
        }],
        xaxis: {
          categories: days,
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
        }
      };

      const chart = new ApexCharts(document.getElementById('supplier-growth-chart'), options);
      chart.render();
    });
  }

  // Gráfico de cantidad total vendida por tipo de producto (Bar Chart)
  loadSalesByProductChart(): void {
    this.saleService.getSales().subscribe(data => {
      const salesByProduct = data.reduce((acc: { [key: string]: number }, sale) => {
        acc[sale.typeLunch] = (acc[sale.typeLunch] || 0) + sale.quantity;
        return acc;
      }, {});

      const products = Object.keys(salesByProduct);
      const quantities = Object.values(salesByProduct);

      const options = {
        chart: {
          type: 'bar',
          height: '100%',
          maxWidth: '100%'
        },
        series: [{
          name: 'Cantidad Vendida',
          data: quantities
        }],
        xaxis: {
          categories: products
        }
      };

      const chart = new ApexCharts(document.getElementById('sales-by-product-chart'), options);
      chart.render();
    });
  }

  // Gráfico de distribución de ventas por cliente (Pie Chart)
  loadSalesByCustomerChart(): void {
    this.saleService.getSales().subscribe(data => {
      const salesByCustomer = data.reduce((acc: { [key: string]: number }, sale) => {
        acc[sale.customerId] = (acc[sale.customerId] || 0) + sale.totalSale;
        return acc;
      }, {});

      const customers = Object.keys(salesByCustomer);
      const sales = Object.values(salesByCustomer);

      const options = {
        chart: {
          type: 'pie',
          height: '100%',
          maxWidth: '100%'
        },
        series: sales,
        labels: customers.map(id => `Cliente ${id}`)
      };

      const chart = new ApexCharts(document.getElementById('sales-by-customer-chart'), options);
      chart.render();
    });
  }

  // Gráfico de productos con mayor inventario (Horizontal Bar Chart)
  loadTopInventoryProductsChart(): void {
    this.inventoryService.getInventories().subscribe(data => {
      const topProducts = data.sort((a, b) => b.quantity - a.quantity).slice(0, 5);
      const productNames = topProducts.map(product => product.productName);
      const quantities = topProducts.map(product => product.quantity);

      const options = {
        chart: {
          type: 'bar',
          height: '100%',
          maxWidth: '100%'
        },
        plotOptions: {
          bar: {
            horizontal: true
          }
        },
        series: [{
          name: 'Cantidad',
          data: quantities
        }],
        xaxis: {
          categories: productNames
        }
      };

      const chart = new ApexCharts(document.getElementById('top-inventory-products-chart'), options);
      chart.render();
    });
  }
}