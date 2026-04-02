import { WishlistService } from './../wishlist.service';
import { AddtocartComponent } from './../addtocart/addtocart.component';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from './../product.service';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartService } from '../cartservices.service';
import Swal from 'sweetalert2';
import { FilterPipe } from '../filter.pipe';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,RouterLink,FormsModule,FilterPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
productlist:any[] = [];
  filteredProducts: any[] = [];
 maxPrice: number = 30000;
  sortOrder: string = '';
   searchText: string = '';



private service             = inject(ProductService)
private router              = inject(Router)
private cartservice         = inject(CartService)
private  wishlistService    = inject(WishlistService)

  ngOnInit() {
    this.service.getProducts().subscribe((data: any[]) => {
      this.productlist = data;
      this.applyfilter(); 
    });
  }


isInCart(productId: number): boolean {
  return this.cartservice.getCartItems().some((item: any) => item.id === productId);
}

applyfilter() {
  // Search logic ko bhi yahan include kar dete hain taaki pipe ki zaroorat na rahe 
  // aur sorting/price ke saath search bhi sync chale
  let temp = [...this.productlist];

  // 1. Price Filter
  temp = temp.filter(p => Number(p.price) <= this.maxPrice);

  // 2. Search Filter (Optional: Agar aap pipe nahi use karna chahte)
  if (this.searchText) {
    temp = temp.filter(p => 
      p.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  // 3. Sort Filter
  if (this.sortOrder === 'low') {
    temp.sort((a, b) => a.price - b.price);
  } else if (this.sortOrder === 'high') {
    temp.sort((a, b) => b.price - a.price);
  }

  this.filteredProducts = temp; // ✅ Hamesha filteredProducts ko update karo
}

add(product: any) {
  this.cartservice.addToCart(product);
  console.log("Navigating to cart...");
 // navigate ki jagah navigateByUrl use karein
}

goToCart(){
this.router.navigate(['/cart']);
}addToWishlist(product: any) {
  // Service call
  this.wishlistService.addToWishlist(product);

  // Stylish Toast Notification
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end', // Right corner mein dikhega
    showConfirmButton: false,
    timer: 2500, // 2.5 seconds mein gayab
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
  });

  Toast.fire({
    icon: 'success',
    title: 'Added to Wishlist!',
    text: `${product.name} is now in your favorites 💖`,
    background: '#fff',
    color: '#333',
    iconColor: '#e91e63' // Pinkish heart color
  });
}

viewProduct(id: number) {
  console.log("Navigating to product:", id);
  this.router.navigate(['/product', id]); 
}

}
