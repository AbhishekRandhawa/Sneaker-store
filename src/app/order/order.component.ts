import { Component, inject } from '@angular/core';
import { OrderService } from '../order.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductService } from '../product.service';
import Swal from 'sweetalert2';
import { CartService } from '../cartservices.service';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent {
public orderservice = inject(OrderService)
public router = inject(Router)
public productservice = inject(ProductService)
public cartservice = inject(CartService)
myorder : any[]=[]


ngOnInit(){
  this.myorder = this.orderservice.getOrderHistory().reverse();
}

// OrderComponent ke andar Reorder function ko aise sahi karein:

Reorder(order: any) {
  // Check karein ki order aur items exist karte hain
  if (order && order.items) {
    order.items.forEach((item: any) => {
      // 🚀 FIX: Yahan function ka naam (e.g., addToCart) likhna zaroori hai
      this.cartservice.addToCart(item); 
      // Agar aapne ProductService inject kiya hai toh: this.productservice.addToCart(item);
    });

    Swal.fire({
      title: 'Items Added!',
      text: 'Order items have been added back to your cart.',
      icon: 'success',
      confirmButtonColor: '#1e1b4b'
    }).then(() => {
      this.router.navigate(['/cart']);
    });
  }
}
}

