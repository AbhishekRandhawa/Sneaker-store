import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';
import { AuthService } from '../auth.service';
import Swal from 'sweetalert2';

  @Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule,ReactiveFormsModule,RouterLink,AuthLayoutComponent],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
  })
  export class LoginComponent implements OnInit {
    LoginForm! : FormGroup

    constructor (private fb: FormBuilder , private authservice:AuthService, public router:Router){}

    ngOnInit(){
      this.LoginForm = this.fb.group({
    email :['', [Validators.required,Validators.email]],
    password : ['', [Validators.required, Validators.minLength(6)]]
      })

      
    }
onlogin() {
  if (this.LoginForm.valid) {
    const { email, password } = this.LoginForm.value;

    // Login service call (Ab ye role return karega)
    const role = this.authservice.Login(email, password);

    if (role) {
      // 1. Success Stylish Alert
      Swal.fire({
        title: 'Login Successful!',
        text: `Welcome back ${role}! Redirecting...`,
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
        willClose: () => {
          // 🚀 ROLE BASED REDIRECTION
          if (role === 'admin') {
            this.router.navigate(["/admin"]); // Admin ko admin page par bhejo
          } else {
            this.router.navigate(["/home"]);  // User ko home par bhejo
          }
        }
      });
    } else {
      // 2. Error Stylish Alert (Login Fail)
      Swal.fire({
        title: 'Login Failed',
        text: 'Invalid Email or Password. Please try again.',
        icon: 'error',
        confirmButtonColor: '#d33',
        confirmButtonText: 'Try Again'
      });
    }
  } else {
    // 3. Form Invalid Alert
    this.LoginForm.markAllAsTouched();
    Swal.fire({
      title: 'Wait!',
      text: 'Please fill all fields correctly.',
      icon: 'info',
      toast: true,
      position: 'top-end',
      timer: 3000,
      showConfirmButton: false
    });
  }
}

  logout(){
    this.authservice.Logout();
    this.router.navigate(["/login"])
  }
  }
