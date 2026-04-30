import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrdermanagementService {

  constructor() { }

  // 1. Saare orders Local Storage se nikaalne ke liye
  getOrders() {
    const orders = localStorage.getItem('orders');
    return orders ? JSON.parse(orders) : [];
  }

  // 2. Order status update karne ke liye (Approve karne ke liye)
  updateStatus(orderId: number, newStatus: string) {
    let orders = this.getOrders();
    
    // Uss order ko dhundo jiski ID match karti hai
    orders = orders.map((order: any) => {
      if (order.id === orderId) {
        return { ...order, status: newStatus }; // Status change kar do (e.g., 'Approved')
      }
      return order;
    });

    // Wapas Local Storage mein save kar do
    localStorage.setItem('orders', JSON.stringify(orders));
  }
}