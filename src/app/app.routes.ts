import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthLayoutComponent } from './auth-layout/auth-layout.component';
import { ProductdataComponent } from './productdata/productdata.component';
import { AddtocartComponent } from './addtocart/addtocart.component';
import { authGuard, roleGuard } from './auth.service';
import { WishlistComponent } from './wishlist/wishlist.component';
import { OrderComponent } from './order/order.component';
import { AdminComponent } from './admin/admin.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { SettingComponent } from './setting/setting.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: AuthLayoutComponent,
    canActivate: [authGuard], 
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent }
    ]
  },
  { path: 'home', component: HomeComponent, canActivate: [authGuard,roleGuard], data: { role: 'user' }},
  { path: 'cart', component: AddtocartComponent, canActivate: [authGuard,roleGuard] ,data: { role: 'user' }},
  { path: 'product/:id', component: ProductdataComponent, canActivate: [authGuard,roleGuard],data: { role: 'user' } },
  
  // { path: 'admin', component: AdminComponent, canActivate: [authGuard,roleGuard] , data: { role: 'admin' } }, 
  { path: 'my-orders', component: OrderComponent, canActivate: [authGuard,roleGuard],data: { role: 'user' } }, 
  { path: 'my-wishlist', component: WishlistComponent, canActivate: [authGuard,roleGuard],data: { role: 'user' } }, // 👈 Inpar bhi guard lagayein
  { path: 'check-out', component: CheckoutComponent, canActivate: [authGuard,roleGuard],data: { role: 'user' } },
  // {path: "user-settings", component:SettingComponent, canActivate: [authGuard,roleGuard],data: { role: 'admin' } }, // 👈 Inpar bhi guard lagayein
{ 
  path: 'admin', 
  component: AdminComponent, 
  canActivate: [authGuard, roleGuard], 
  data: { role: 'admin' },
  children: [
    // 🚀 Isse 'admin/user-settings' active hoga
    { path: 'user-settings', component: SettingComponent } 
  ]
},

  // Default redirect logic
  { path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirect to home, guard will handle login if needed
  { path: '**', redirectTo: '/home' } 
];