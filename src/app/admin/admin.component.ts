import { Component, inject } from '@angular/core';
import { ProductService } from '../product.service';
import { CommonModule } from '@angular/common';
import { FormsModule, FormBuilder, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent,SidebarComponent,RouterOutlet,RouterLink,NgxPaginationModule,ReactiveFormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
private productservice = inject(ProductService)
private router = inject(Router)
p: number = 1;
product:any[]=[];
onEditModeon=false;
selectedImagePreview: string | null = null;


productForm = new FormGroup({
    id: new FormControl(0),
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    price: new FormControl(0, [Validators.required, Validators.min(1)]),
    img: new FormControl('', [Validators.required]),
    des: new FormControl('', [Validators.required, Validators.maxLength(200)])
  });

ngOnInit(){
  this.productservice.products$.subscribe(res=>{
    this.product=res;
  })
}

onSubmit() {
    // ✅ Step 2: Check if form is valid
   if (this.productForm.invalid) {
      this.productForm.markAllAsTouched(); // Saare error messages dikhane ke liye
      return;
    }

    const formData = this.productForm.value;

    if (this.onEditModeon) {
      this.productservice.updateProduct(formData as any);
      Swal.fire('Updated', 'Product updated successfully', 'success');
    } else {
      this.productservice.addProduct(formData as any);
      Swal.fire('Added', 'Product added successfully', 'success');
    }
    
    this.resetForm();
  }

onEdit(prod: any) {
    this.onEditModeon = true;
    this.productForm.patchValue(prod); // ✅ Form mein purana data bharne ke liye
  }

  isChildRouteActive(): boolean {
  // router.url se current path check karte hain
  const currentUrl = this.router.url.split('?')[0]; 
  
  // Agar URL sirf '/admin' hai, toh returns false (yani inventory dikhao)
  // Agar URL '/admin/user-settings' hai, toh returns true (yani settings dikhao)
  return currentUrl !== '/admin' && currentUrl !== '/admin/';
}

onFileSelected(event: any) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const base64String = reader.result as string;
      
      // 🚀 FIX: Reactive Form mein value aise set karte hain
      this.productForm.patchValue({
        img: base64String
      });

      this.selectedImagePreview = base64String;
      
      // SweetAlert Preview
      Swal.fire({
        title: 'Image Selected!',
        imageUrl: this.selectedImagePreview,
        imageAlt: 'Product Image',
        imageHeight: 200,
        confirmButtonText: 'Looks Good!',
        confirmButtonColor: '#1e1b4b'
      });
    };
    reader.readAsDataURL(file);
  }
}

onDelete(id: number) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',   // Delete ke liye Red color
    cancelButtonColor: '#3085d6',  // Cancel ke liye Blue color
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it'
  }).then((result) => {
    if (result.isConfirmed) {
      // 1. Service se product delete karein
      this.productservice.deleteProduct(id);

      // 2. Success message dikhayein
      Swal.fire(
        'Deleted!',
        'Your product has been removed from inventory.',
        'success'
      );
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      // Optional: Agar user cancel kare toh kya dikhana hai
      Swal.fire(
        'Cancelled',
        'Your product is safe :)',
        'error'
      );
    }
  });
}

removeImage() {
  // 1. Form control se value hatayein
  this.productForm.patchValue({
    img: ''
  });
  
  // 2. Preview variable ko null karein
  this.selectedImagePreview = null;

  // Optional: User ko inform karne ke liye chota alert
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true
  });
  Toast.fire({
    icon: 'info',
    title: 'Image removed'
  });
}

resetForm() {
    this.productForm.reset({ id: 0, name: '', price: 0, img: '', des: '' });
    this.onEditModeon = false;
    this.selectedImagePreview = null;
  }
}
