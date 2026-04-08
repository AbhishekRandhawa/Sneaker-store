import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { ProductService } from '../product.service';
import { Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css']
})
export class SalesComponent implements OnInit, AfterViewInit {
  @ViewChild('salesChart') salesChart!: ElementRef;
  
  private productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  bestSeller: any = null;
  totalRevenue: number = 0;
  lowStockMsg: string = '';
  chart: any;

  ngOnInit() {
    // 1. Listen to product changes
    this.productService.products$.subscribe(products => {
      if (products && products.length > 0) {
        this.calculateStats(products);
        // Agar chart pehle se bana hai toh data update karo
        if (this.chart) {
          this.updateChart(products);
        }
      }
    });
  }

ngAfterViewInit() {
  setTimeout(() => {
    this.initChart();
    
    // Naya method use karein jo seedha Array deta hai
    const currentProducts = this.productService.getProductsValue(); 

    if (currentProducts && currentProducts.length > 0) {
      this.updateChart(currentProducts);
    }
  }, 100);
}
  calculateStats(products: any[]) {
    this.totalRevenue = products.reduce((acc, p) => acc + (Number(p.price) || 0), 0);
    
    // Best Seller Logic
    this.bestSeller = [...products].sort((a, b) => Number(b.price) - Number(a.price))[0];

    const lowStockCount = products.filter(p => !p.img || Number(p.price) < 1000).length;
    this.lowStockMsg = `${lowStockCount} products need attention!`;
    
    this.cdr.detectChanges();
  }

  initChart() {
    const ctx = this.salesChart.nativeElement.getContext('2d');
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [{
          label: 'Product Prices (₹)',
          data: [],
          backgroundColor: 'rgba(30, 58, 138, 0.8)',
          borderColor: '#1e3a8a',
          borderWidth: 1,
          borderRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  }

  updateChart(products: any[]) {
    this.zone.run(() => {
      const topProducts = products.slice(0, 8); // Top 8 products dikhayenge
      this.chart.data.labels = topProducts.map(p => p.name);
      this.chart.data.datasets[0].data = topProducts.map(p => p.price);
      this.chart.update();
      this.cdr.detectChanges();
    });
  }
}