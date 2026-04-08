import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productstoragekey = "myinventory";
  private defaultProducts = [];
  
  private productsubject: BehaviorSubject<any[]>;
  products$: Observable<any[]>;

  constructor() {
    const savedProducts = localStorage.getItem(this.productstoragekey);
    const initialProducts = savedProducts ? JSON.parse(savedProducts) : this.defaultProducts;
    
    if (!savedProducts) {
      this.syncProductStorage(this.defaultProducts);
    }

    this.productsubject = new BehaviorSubject<any[]>(initialProducts);
    this.products$ = this.productsubject.asObservable();
  }

  private syncProductStorage(products: any[]) {
    localStorage.setItem(this.productstoragekey, JSON.stringify(products));
  }

  bulkAddProducts(newProducts: any[]): Observable<boolean> {
    try {
      const current = this.productsubject.value;
      let lastId = current.length > 0 ? Math.max(...current.map((p: any) => p.id)) : 0;

      const formattedProducts = newProducts.map(product => {
        lastId++;
        return {
          ...product,
          id: lastId,
          price: Number(product.price),
          dateAdded: new Date()
        };
      });

      const updated = [...current, ...formattedProducts];
      this.productsubject.next(updated);
      this.syncProductStorage(updated);
      return of(true);
    } catch (error) {
      console.error("Bulk upload failed", error);
      return of(false);
    }
  }

  // --- FIX: Dono method rakhein taaki component ko jaisi zaroorat ho waisa data mile ---

  // Yeh UI components ke liye hai jo sync rehna chahte hain (Observable)
  getProducts(): Observable<any[]> { 
    return this.products$; 
  }

  // Yeh Chart aur Logic ke liye hai jise turant Array chahiye (Value)
  getProductsValue(): any[] {
    return this.productsubject.value;
  }

  // --- Baki Methods ---
  addProduct(product: any) {
    const current = this.productsubject.value;
    product.id = current.length > 0 ? Math.max(...current.map((p: any) => p.id)) + 1 : 1;
    const updated = [...current, product];
    this.productsubject.next(updated);
    this.syncProductStorage(updated);
  }

  deleteProduct(id: number) {
    const updated = this.productsubject.value.filter(p => p.id !== id);
    this.productsubject.next(updated);
    this.syncProductStorage(updated);
  }

  updateProduct(updatedProd: any) {
    const updatedList = this.productsubject.value.map(p => p.id === updatedProd.id ? updatedProd : p);
    this.productsubject.next(updatedList);
    this.syncProductStorage(updatedList);
  }

  getProductById(id: number) {
    return this.productsubject.value.find(p => p.id === id);
  }
}