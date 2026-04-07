import { Component, inject } from '@angular/core';
import { WishlistService } from '../wishlist.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { CartService } from '../cartservices.service';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent {

  private wishlistservice = inject(WishlistService)
  private cartservice = inject(CartService);
  items:any[]=[]

    ngOnInit() {
    this.items = this.wishlistservice.getWishlistItems();
  }

 moveToCart(product: any) {
  // 1. Cart mein add karo
  this.cartservice.addToCart(product);

  // 2. Wishlist se SILENTLY remove karo (Swal ke bina)
  this.wishlistservice.removeFromWishlist(product.id);

  // 3. UI Update karo
  this.items = this.wishlistservice.getWishlistItems();

  // 4. Success Toast dikhao
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true
  });

  Toast.fire({
    icon: 'success',
    title: 'Moved to Cart 🛒'
  });
}

removeItem(id: number, productName: string = 'this item') {
  Swal.fire({
    title: 'Are you sure?',
    text: `Do you want to remove "${productName}" from your wishlist?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, remove it!',
    cancelButtonText: 'No, keep it'
  }).then((result) => {
    if (result.isConfirmed) {
      // 1. Service se remove karein
      this.wishlistservice.removeFromWishlist(id);
      
      // 2. UI Refresh karein
      this.items = this.wishlistservice.getWishlistItems();

      // 3. Success Toast dikhayein
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });

      Toast.fire({
        icon: 'success',
        title: 'Removed from Wishlist'
      });
    }
  });
}


}
