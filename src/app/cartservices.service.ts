import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private USER_SESSION_KEY = 'currentUser';

  private cartCount = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCount.asObservable();

  constructor() {
    this.refreshCartCount();
  }

  // --- Dynamic Keys ---
  private getCartKey(): string {
    const user = JSON.parse(localStorage.getItem(this.USER_SESSION_KEY) || '{}');
    return user.email ? `cart_${user.email}` : 'cart_guest';
  }

  private getWishlistKey(): string {
    const user = JSON.parse(localStorage.getItem(this.USER_SESSION_KEY) || '{}');
    return user.email ? `wishlist_${user.email}` : 'wishlist_guest';
  }

  private getOrderKey(): string {
    const user = JSON.parse(localStorage.getItem(this.USER_SESSION_KEY) || '{}');
    return user.email ? `orders_${user.email}` : 'orders_guest';
  }

  // --- 🛒 CART LOGIC ---
  refreshCartCount() {
    this.cartCount.next(this.getCartItems().length);
  }

  getCartItems(): any[] {
    const key = this.getCartKey();
    const cart = localStorage.getItem(key);
    return cart ? JSON.parse(cart) : [];
  }

  updateCart(cart: any[]) {
    const key = this.getCartKey();
    localStorage.setItem(key, JSON.stringify(cart));
    this.cartCount.next(cart.length);
  }

  addToCart(product: any) {
    let cart = this.getCartItems();                                                                         
    
    const index = cart.findIndex((item: any) => item.id === product.id);
    if (index !== -1) {
      cart[index].quantity = (cart[index].quantity || 1) + 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    this.updateCart(cart);
  }

  removeFromCart(productId: number) {
    const updatedCart = this.getCartItems().filter((item: any) => item.id !== productId);
    this.updateCart(updatedCart);
  }

  getSubtotal(): number {
    return this.getCartItems().reduce((acc, item) => acc + (Number(item.price) * (item.quantity || 1)), 0);
  }

  clearCart() {
    localStorage.removeItem(this.getCartKey());
    this.cartCount.next(0);
  }

  // --- 💖 WISHLIST LOGIC ---
  getWishlistItems(): any[] {
    const key = this.getWishlistKey();
    const list = localStorage.getItem(key);
    return list ? JSON.parse(list) : [];
  }

  addToWishlist(product: any) {
    let list = this.getWishlistItems();
    const exists = list.find((item: any) => item.id === product.id);
    if (!exists) {
      list.push(product);
      localStorage.setItem(this.getWishlistKey(), JSON.stringify(list));
      alert(`${product.name} added to Wishlist! 💖`);
    } else {
      alert("Already in Wishlist!");
    }
  }

  removeFromWishlist(productId: number) {
    let list = this.getWishlistItems().filter((item: any) => item.id !== productId);
    localStorage.setItem(this.getWishlistKey(), JSON.stringify(list));
  }

  // --- 📦 ORDER LOGIC ---
  placeOrder(orderDetails: any) {
    const key = this.getOrderKey();
    const orders = JSON.parse(localStorage.getItem(key) || '[]');
    orders.push(orderDetails);
    localStorage.setItem(key, JSON.stringify(orders));
    this.clearCart();
  }

  getOrderHistory() {
    const key = this.getOrderKey();
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  }
}