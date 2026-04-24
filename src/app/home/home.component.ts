import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from './../product.service';
import { CartService } from '../cartservices.service';
import { WishlistService } from './../wishlist.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  productlist: any[] = [];
  filteredProducts: any[] = [];
  maxPrice: number = 200000;
  sortOrder: string = '';
  searchText: string = '';

  private service = inject(ProductService);
  private router = inject(Router);
  private cartservice = inject(CartService);
  private wishlistService = inject(WishlistService);

  ngOnInit() {
    this.service.getProducts().subscribe((data: any[]) => {
      this.productlist = data.map(p => ({
        ...p,
        // Adding Sale & Rating properties
        rating: p.rating || (Math.random() * (5 - 3.8) + 3.8).toFixed(1),
        reviews: p.reviews || Math.floor(Math.random() * 900) + 100
      }));
      this.applyfilter();
    });
  }

  isInCart(productId: number): boolean {
    return this.cartservice.getCartItems().some((item: any) => item.id === productId);
  }

  applyfilter() {
    let temp = [...this.productlist];
    if (this.maxPrice) temp = temp.filter(p => (Number(p.price) / 2) <= this.maxPrice); // Sale price par filter
    if (this.searchText) temp = temp.filter(p => p.name.toLowerCase().includes(this.searchText.toLowerCase()));
    
    if (this.sortOrder === 'low') temp.sort((a, b) => (a.price/2) - (b.price/2));
    else if (this.sortOrder === 'high') temp.sort((a, b) => (b.price/2) - (a.price/2));

    this.filteredProducts = temp;
  }

  add(product: any) {
    const saleProduct = { ...product, price: product.price / 2 }; // Sale price ke saath cart mein add
    this.cartservice.addToCart(saleProduct);
  }

  goToCart() { this.router.navigate(['/cart']); }

  addToWishlist(product: any) {
    this.wishlistService.addToWishlist(product);
    Swal.fire({
      toast: true, position: 'top-end', showConfirmButton: false,
      timer: 2000, icon: 'success', title: 'Added to Wishlist!',
      iconColor: '#b8860b'
    });
  }

  viewProduct(id: number) { this.router.navigate(['/product', id]); }
}