// order.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private allOrdersKey = "all_orders"; 
  private userSessionKey = "currentuser";

  // 1. Saare orders mangwana (Common logic)
  getAllOrdersForAdmin(): any[] {
    const data = localStorage.getItem(this.allOrdersKey);
    const orders = data ? JSON.parse(data) : [];
    console.log("Admin Data Fetched:", orders); // Isse check karein data aa raha hai ya nahi
    return orders;
  }

  // 2. Naya Order save karna (Hamesha 'all_orders' mein)
  PlaceOrder(orderDetail: any) {
    const orders = this.getAllOrdersForAdmin();
    orders.push(orderDetail);
    localStorage.setItem(this.allOrdersKey, JSON.stringify(orders));
    console.log("Order Saved in all_orders!", orderDetail);
  }

  // 3. User ke liye filter karna (Most Important)
// order.service.ts
getUserOrderHistory(): any[] {
  // DHAYAN DEIN: Aapke storage mein key ka naam 'users' hai
  const userStr = localStorage.getItem('users'); 
  const allOrdersStr = localStorage.getItem(this.allOrdersKey);
  
  if (!userStr || !allOrdersStr) {
    console.log("Data nahi mila. Users:", !!userStr, "Orders:", !!allOrdersStr);
    return [];
  }

  const user = JSON.parse(userStr);
  const allOrders = JSON.parse(allOrdersStr);

  // Email nikalna
  const loginEmail = user.email ? user.email.toLowerCase().trim() : '';
  console.log("Logged In User Email:", loginEmail);

  return allOrders.filter((order: any) => {
    // Order ke andar wala email
    const orderEmail = order.shippingDetails?.email ? order.shippingDetails.email.toLowerCase().trim() : '';
    
    // Debugging ke liye console zaroor dekhein
    console.log(`Comparing Login Email [${loginEmail}] with Order Email [${orderEmail}]`);
    
    return orderEmail === loginEmail;
  });
}

  updateOrderStatus(orderId: string, newStatus: string) {
    let orders = this.getAllOrdersForAdmin();
    orders = orders.map((order: any) => 
      order.orderId === orderId ? { ...order, status: newStatus } : order
    );
    localStorage.setItem(this.allOrdersKey, JSON.stringify(orders));
  }
}