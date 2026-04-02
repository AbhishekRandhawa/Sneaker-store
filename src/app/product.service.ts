import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // LocalStorage Key
  private productstoragekey = "myinventory";

  // Default Data
  private defaultProducts = [];
  

  private productsubject: BehaviorSubject<any[]>;
  products$: Observable<any[]>;

  constructor() {
    const savedProducts = localStorage.getItem(this.productstoragekey);
    const initialProducts = savedProducts ? JSON.parse(savedProducts) : this.defaultProducts;
    
    // Agar pehli baar hai toh defaults save kar dein
    if (!savedProducts) {
      this.syncProductStorage(this.defaultProducts);
    }

    this.productsubject = new BehaviorSubject<any[]>(initialProducts);
    this.products$ = this.productsubject.asObservable();
  }

  // --- Helpers ---
  private syncProductStorage(products: any[]) {
    localStorage.setItem(this.productstoragekey, JSON.stringify(products));
  }

  // --- Admin Methods ---

  // 1. Naya Product Add karna
  addProduct(product: any) {
    const current = this.productsubject.value;
    // Auto-increment ID logic
    product.id = current.length > 0 ? Math.max(...current.map((p: any) => p.id)) + 1 : 1;
    
    const updated = [...current, product];
    this.productsubject.next(updated);
    this.syncProductStorage(updated);
  }

  // 2. Product Delete karna
  deleteProduct(id: number) {
    const updated = this.productsubject.value.filter(p => p.id !== id);
    this.productsubject.next(updated);
    this.syncProductStorage(updated);
  }

  // 3. Product Update/Edit karna
  updateProduct(updatedProd: any) {
    const updatedList = this.productsubject.value.map(p => p.id === updatedProd.id ? updatedProd : p);
    this.productsubject.next(updatedList);
    this.syncProductStorage(updatedList);
  }

  // --- Display Methods ---

  // Sabhi products get karna (Home page ke liye)
  getProducts() { 
    return this.products$; 
  }

  // ID se ek specific product nikalna (Product Detail page ke liye)
  getProductById(id: number) {
    const products = this.productsubject.value;
    return products.find(p => p.id === id);
  }
}