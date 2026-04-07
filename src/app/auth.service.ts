import { CanActivateFn, Router } from '@angular/router';
import { UserService } from './user.service';
import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs'; // 👈 Observable ke liye

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router); 
  userName = signal<string>(localStorage.getItem('loggedUserName') || '');
  
  // 🟢 Real-time Status Update ke liye BehaviorSubject
  private loginStatus = new BehaviorSubject<boolean>(this.isuserloggedin());
  loginStatus$ = this.loginStatus.asObservable(); // Isse Navbar subscribe karega

  constructor(private userservice: UserService) { 
    const savename = localStorage.getItem('userName');
    if(savename){
      this.userName.set(savename)
    }
  }

setUserName(name: string) {
    localStorage.setItem('loggedUserName', name);
    this.userName.set(name);
  }

  Login(email: string, password: string): string | null {

    const users = this.userservice.getregisteredUser();
    
    // 1. Admin Check
    if (email === 'admin@gmail.com' && password === 'admin123') {
      localStorage.setItem("isloggedin", 'true');
      localStorage.setItem("role", 'admin');
      this.loginStatus.next(true);
      return 'admin';
    }

    // 2. User Check (Structure and Case Sensitivity Fix)
    if (users && Array.isArray(users)) {
      const userFound = users.find(u => 
        u.email?.trim().toLowerCase() === email.trim().toLowerCase() && 
        u.password === password
      );

      if (userFound) {
        localStorage.setItem("isloggedin", 'true');
        localStorage.setItem("role", 'user');
        this.loginStatus.next(true);
        return 'user';
      }
    }
    return null;
  }

Logout(): void {

  localStorage.removeItem('loggedUserName');
    this.userName.set('');
    // ❌ localStorage.clear();  <-- Ye gunahgaar hai! Isse users delete ho jaate hain.
    
    // ✅ Sirf session hatayein, users ka data (Database) rehne dein.
    localStorage.removeItem("isloggedin");
    localStorage.setItem("isloggedin", 'false'); // Extra safety
    localStorage.removeItem("role"); 

    this.loginStatus.next(false); // Navbar ko signal bhejo
    this.router.navigate(['/auth/login']);
  }

  isuserloggedin(): boolean {
    return localStorage.getItem('isloggedin') === 'true';
  }

  getRole(): string {
    return localStorage.getItem('role') || ''; 
  }
}

// 🛡️ 1. Auth Guard (Strict Fix)
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isLoggedIn = authService.isuserloggedin();
  const url = state.url;

  // Login page par guard ko bypass karein taaki loop na bane
  if (url.includes('/auth/login') || url.includes('/auth/register')) {
    return true;
  }

  if (!isLoggedIn) {
    router.navigate(['/auth/login']);
    return false;
  }
  return true;
};

// 🛡️ 2. Role Guard (Loop-Proof Logic)
export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const userRole = authService.getRole();
  const expectedRole = route.data['role'];

  // 1. Agar Role match ho gaya toh direct access
  if (authService.isuserloggedin() && userRole === expectedRole) {
    return true;
  }

  // 2. Agar Role mismatch hai toh redirection (Loop-Preventing Check)
  if (userRole === 'admin') {
    // Admin ko sirf admin page par rakho
    if (state.url !== '/admin') {
      router.navigate(['/admin']);
      return false;
    }
  } else if (userRole === 'user') {
    // User ko sirf user pages par rakho
    if (state.url !== '/home') {
      router.navigate(['/home']);
      return false;
    }
  } else {
    // Agar koi role nahi hai toh login bhejo
    router.navigate(['/auth/login']);
    return false;
  }

  return false;
};