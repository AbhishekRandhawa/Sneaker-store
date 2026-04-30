import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../order.service'; // Service ka naam check karein
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ordermanagement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ordermanagement.component.html',
  styleUrl: './ordermanagement.component.css'
})
export class OrdermanagementComponent implements OnInit {
  orders: any[] = [];
  
  // Nayi consolidated service use karein
  private orderService = inject(OrderService);

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    // Service ka naya method jo 'all_orders' key se data lata hai
    this.orders = this.orderService.getAllOrdersForAdmin();
  }

  changeStatus(orderId: string, newStatus: string) {
    // Service ka naya method jo status update karta hai
    this.orderService.updateOrderStatus(orderId, newStatus);
    
    this.loadOrders(); // UI refresh

    Swal.fire({
      title: 'Success!',
      text: `Order status updated to ${newStatus}`,
      icon: 'success',
      toast: true,
      position: 'top-end',
      timer: 2000,
      showConfirmButton: false
    });
  }

  getBadgeClass(status: string) {
    switch (status) {
      case 'Pending': return 'bg-warning text-dark';
      case 'Approved': return 'bg-info';
      case 'Shipped': return 'bg-success';
      case 'Rejected': return 'bg-danger';
      default: return 'bg-secondary';
    }
  }
}