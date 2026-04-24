import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../cartservices.service'; // Path verify karein
import Swal from 'sweetalert2';

@Component({
  selector: 'app-addtocart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './addtocart.component.html',
  styleUrls: ['./addtocart.component.css']
})
export class AddtocartComponent implements OnInit {
  cartItems: any[] = [];
  subtotal: number = 0;

  // Modern injection method
  private cartService = inject(CartService);
  private router = inject(Router);

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    // 1. Service se items laao (Guest ya User dono ke liye chalega)
    this.cartItems = this.cartService.getCartItems();
    
    // 2. Subtotal calculate karo
    this.calculateTotal();
    
    console.log("Cart Items Loaded:", this.cartItems);
  }

  calculateTotal() {
    this.subtotal = this.cartService.getSubtotal();
  }

  // Cart se item delete karna
removeItem(id: number) {
  Swal.fire({
    title: 'Remove Item?',
    text: "Kya aap is item ko cart se hatana chahte hain?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',   // Delete button red
    cancelButtonColor: '#3085d6',  // Cancel button blue
    confirmButtonText: 'Yes, remove it!',
    cancelButtonText: 'No, keep it'
  }).then((result) => {
    if (result.isConfirmed) {
      // 1. Service se item remove karein
      this.cartService.removeFromCart(id);
      
      // 2. List ko refresh karein
      this.loadCart();

      // 3. Stylish Success Toast
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
      });

      Toast.fire({
        icon: 'success',
        title: 'Item removed from cart'
      });
    }
  });
}

  // Quantity control: Badhane ke liye
  increaseQty(item: any) {
    item.quantity = (item.quantity || 1) + 1;
    this.cartService.updateCart(this.cartItems);
    this.calculateTotal();
  }

  // Quantity control: Kam karne ke liye
  decreaseQty(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
      this.cartService.updateCart(this.cartItems);
      this.calculateTotal();
    } else {
      this.removeItem(item.id);
    }
  }

  // Checkout sirf tab maange jab user Buy kare
  onCheckout() {
  const user = localStorage.getItem('currentUser');

  if (!user) {
    // 1. Error Alert: Agar user logged in nahi hai
    Swal.fire({
      icon: 'warning',
      title: 'Login Required!',
      text: 'Order complete karne ke liye aapko login karna hoga.',
      confirmButtonColor: '#b8860b', // Hamara Classic Gold shade
      confirmButtonText: 'Go to Login',
      showCancelButton: true,
      cancelButtonText: 'Stay here',
      backdrop: `rgba(0,0,0,0.4)`
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/check-out']); // Ya login page ka path
      }
    });
    
  } else {
    // 2. Success Alert: Order place hone par
    this.cartService.placeOrder({
      orderId: 'ORD' + Date.now(),
      items: this.cartItems,
      total: this.subtotal
    });

    Swal.fire({
      icon: 'success',
      title: 'Order Placed!',
      html: `
        <div class="p-2">
          <p class="mb-2">Aapka order successfully place ho gaya hai.</p>
          <strong style="color: #b8860b;">Total Amount: ₹${this.subtotal}</strong>
        </div>
      `,
      confirmButtonColor: '#1e293b', // Deep Navy/Black
      confirmButtonText: 'Return to Home',
      timer: 4000, // 4 seconds baad automatically home par le jayega
      timerProgressBar: true,
      showClass: {
        popup: 'animate__animated animate__fadeInDown' // Animations ke liye
      }
    }).then(() => {
      this.router.navigate(['/home']);
    });
  }
}
}