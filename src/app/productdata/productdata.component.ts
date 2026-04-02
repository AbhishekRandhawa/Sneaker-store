import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // 1. Router import karein
import { ProductService } from '../product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-productdata',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productdata.component.html',
  styleUrl: './productdata.component.css'
})
export class ProductdataComponent implements OnInit {
  product: any;
  selectedSize: number | null = null;
  sizes = [7, 8, 9, 10, 11];

  private route = inject(ActivatedRoute);
  private productservice = inject(ProductService);
  private router = inject(Router); // 2. Router inject karein

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.product = this.productservice.getProductById(id);

    if (!this.product) {
      console.error("Bhai, product nahi mila ID:", id);
    }
  }

  selectSize(size: number) {
    this.selectedSize = size;
  }

  // 3. Buy Now Function
  buyNow() {
    if (!this.selectedSize) {
      alert('Oye! Pehle shoe size toh select kar le bhai! 👟');
      return;
    }

    // Checkout page par bhej rahe hain aur sath mein data bhi bhej rahe hain
    this.router.navigate(['/check-out'], {
      state: {
        product: this.product,
        selectedSize: this.selectedSize
      }
    });
  }
}