import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { Router, RouterConfigOptions, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthLayoutComponent } from '../auth-layout/auth-layout.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,RouterLink,AuthLayoutComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
RegisterForm! : FormGroup;

constructor(private userService: UserService,private fb : FormBuilder, public router : Router) {}

ngOnInit(){
  this.RegisterForm = this.fb.group({
   name: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      mobile: ['', [Validators.required, Validators.pattern('^[6789]\\d{9}$')]], // Simplified regex
      email: ['', [Validators.required, Validators.email]],
      
      // Corrected spelling to match HTML
      address: this.fb.group({
        city: ['', Validators.required],
        state: ['', Validators.required],
        pincode: ['', [Validators.required, Validators.pattern('^[0-9]{6}$')]]
      }),

      language: ['', Validators.required], // Lowercase 'l' to match HTML
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required], // CamelCase to match HTML
      gender: ['', Validators.required],
      terms: [false, Validators.requiredTrue],
      attachment: [null]
    }, {
      validators: this.passwordMatchValidator // Small 'v' is mandatory here
    });

}
passwordMatchValidator(control: AbstractControl) {
    const password = control.get("password")?.value;
    const confirmPassword = control.get("confirmPassword")?.value;
    return password === confirmPassword ? null : { mismatch: true }; // fixed confirm variable
  }


onfileChange(event: any) {
  const file = event.target.files[0]; 
  if (file) {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

    // Agar allowed types mein NAHI hai (!) to error dikhao
    if (!allowedTypes.includes(file.type)) {
      this.RegisterForm.get('attachment')?.setErrors({ invalidFile: true });
      this.RegisterForm.patchValue({ attachment: null }); // Value clear karein
    } 
    else {
      // Agar sahi file hai, to value set karein aur error null karein
      this.RegisterForm.patchValue({ attachment: file });
      this.RegisterForm.get('attachment')?.setErrors(null);
    }
    
    // Form ko batayein ki value change ho gayi hai
    this.RegisterForm.get('attachment')?.updateValueAndValidity();
  }
}

// onregister() {
//   if (this.RegisterForm.valid) {
//     // 1. Form se naam nikaalo
//     const userName = this.RegisterForm.value.name; 

//     const isSaved = this.userService.registeruser(this.RegisterForm.value);

//     if (isSaved) {
//       // 2. Naam ko browser ki memory (LocalStorage) mein save karo
//       localStorage.setItem('loggedUserName', userName);

//       Swal.fire('Success', 'Account Created Successfully!', 'success');
//       this.router.navigate(['/auth/login']);
//     } else {
//       Swal.fire('Error', 'Email already registered. Try another one.', 'error');
//     }
//   }
// }

onregister() {
  if (this.RegisterForm.valid) {
    const userData = this.RegisterForm.value;
    const isSaved = this.userService.registeruser(userData);

    if (isSaved) {
      // 1. LocalStorage mein save kiya
      localStorage.setItem('loggedUserName', userData.name);

      // 2. AGAR aapne AuthService mein signal banaya hai, toh usey yahan set karein
      // this.authService.userName.set(userData.name); 

      Swal.fire({
        title: 'Success',
        text: 'Account Created Successfully!',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

      this.router.navigate(['/auth/login']);
    } else {
      Swal.fire('Error', 'Email already registered. Try another one.', 'error');
    }
  } else {
    // Agar form invalid hai toh user ko error dikhao
    this.RegisterForm.markAllAsTouched();
    Swal.fire('Info', 'Please fill all required fields correctly.', 'info');
  }
}
}
