import { Routes } from '@angular/router';
import { authGuard, roleGuard } from './auth.service';



export const routes: Routes = [
  {
    path: 'auth',
    // Isse hum lazy load kar rahe hain
    loadComponent: () => import('./auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    canActivate: [authGuard], 
    children: [
      { 
        path: 'login', 
        loadComponent: () => import('./login/login.component').then(m => m.LoginComponent) 
      },
      { 
        path: 'register', 
        loadComponent: () => import('./register/register.component').then(m => m.RegisterComponent) 
      }
    ]
  },
  { 
    path: 'home', 
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent), 
    canActivate: [authGuard, roleGuard], 
    data: { role: 'user' }
  },
  { 
    path: 'cart', 
    loadComponent: () => import('./addtocart/addtocart.component').then(m => m.AddtocartComponent), 
    canActivate: [authGuard, roleGuard], 
    data: { role: 'user' }
  },
  { 
    path: 'product/:id', 
    loadComponent: () => import('./productdata/productdata.component').then(m => m.ProductdataComponent), 
    canActivate: [authGuard, roleGuard], 
    data: { role: 'user' } 
  },
  { 
    path: 'my-orders', 
    loadComponent: () => import('./order/order.component').then(m => m.OrderComponent), 
    canActivate: [authGuard, roleGuard], 
    data: { role: 'user' } 
  },
  { 
    path: 'my-wishlist', 
    loadComponent: () => import('./wishlist/wishlist.component').then(m => m.WishlistComponent), 
    canActivate: [authGuard, roleGuard], 
    data: { role: 'user' } 
  },
  { 
    path: 'check-out', 
    loadComponent: () => import('./checkout/checkout.component').then(m => m.CheckoutComponent), 
    canActivate: [authGuard, roleGuard], 
    data: { role: 'user' } 
  },
  { 
    path: 'admin', 
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent), 
    canActivate: [authGuard, roleGuard], 
    data: { role: 'admin' },
    children: [
      { 
        path: 'user-settings', 
        loadComponent: () => import('./setting/setting.component').then(m => m.SettingComponent) 
      },
      { 
        path: 'chart', 
        loadComponent: () => import('./sales/sales.component').then(m => m.SalesComponent) 
      },
      { 
        path: 'bulkupload', 
        loadComponent: () => import('./bulkupload/bulkupload.component').then(m => m.BulkuploadComponent) 
      },
      {
        path: 'ordersmanagement',
        loadComponent: () => import('./ordermanagement/ordermanagement.component').then(m => m.OrdermanagementComponent)
      }

    ]
  },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' } 
];