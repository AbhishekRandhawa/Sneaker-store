import { Component, inject, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from '../order.service';
import { CartService } from '../cartservices.service';
import { EmailService } from '../email.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

declare var Stripe: any; 

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit, AfterViewInit {
  checkoutForm!: FormGroup;
  cart: any[] = [];
  subtotal: number = 0;
  gst: number = 4.45;
  grandtotal: number = 0;

  stripe: any;
  cardElement: any;
  inprocessing = false;
  
 
  buyNowProduct: any = null;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private orderservice = inject(OrderService);
  private cartservice = inject(CartService);
  private emailService = inject(EmailService);

  constructor() {
  
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { product: any, selectedSize: number };

    if (state) {
      this.buyNowProduct = { ...state.product, size: state.selectedSize };
      console.log("Buy Now Mode Active: ", this.buyNowProduct);
    }
  }

  ngOnInit(): void {
    
    this.initForm();

  
    if (this.buyNowProduct) {
      this.cart = [this.buyNowProduct];
      this.subtotal = this.buyNowProduct.price;
    } else {
      this.cart = this.cartservice.getCartItems();
      this.subtotal = this.cartservice.getSubtotal();
    }

 
    if (this.cart.length === 0) {
      this.router.navigate(['/home']);
      return;
    }

    this.grandtotal = this.subtotal + this.gst;
  }

  ngAfterViewInit() {
    
    setTimeout(() => {
      if (typeof Stripe !== 'undefined') {
        this.stripe = Stripe('pk_test_51OXLkBCgTYG0LBH1TKnX4icXnEyw1xOIEJSZvAeKlmEq6RnSPbl9uqdwqY9UWKsvRJN6m3dE05ArIp6gNJ9kxpby00rl1GahFz');
        const elements = this.stripe.elements();
        
        this.cardElement = elements.create('card', {
          hidePostalCode: true,
          style: {
            base: {
              fontSize: '18px',
              color: '#32325d',
              '::placeholder': { color: '#aab7c4' },
            }
          }
        });

        this.cardElement.mount('#stripe-card-element');
      } else {
        console.error("Stripe script missing! Index.html mein script check karein.");
      }
    }, 500);
  }

  initForm() {
    this.checkoutForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      country: ['India', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      pincode: ['', [Validators.required, Validators.pattern('^[0-9]{4,6}$')]],
      paymentMethod: ['card', Validators.required]
    });
  }

  async onSubmit() {
    if (this.checkoutForm.invalid) {
      this.markFormGroupTouched(this.checkoutForm);
      Swal.fire('Form Invalid', 'Please fill all required fields correctly.', 'info');
      return;
    }

    this.inprocessing = true;
    const paymentMethod = this.checkoutForm.get('paymentMethod')?.value;

    if (paymentMethod === 'card') {
      const { token, error } = await this.stripe.createToken(this.cardElement);
      if (error) {
        Swal.fire('Payment Error', error.message, 'error');
        this.inprocessing = false;
      } else {
        this.processFinalOrder(token.id);
      }
    } else {
      this.processFinalOrder('CASH_ON_DELIVERY');
    }
  }

  processFinalOrder(paymentId: string) {
    const orderId = 'ORD' + Math.floor(Math.random() * 1000000);
    const shippingDetails = this.checkoutForm.value;

    const finalOrder = {
      orderId: orderId,
      date: new Date(),
      items: [...this.cart],
      total: this.grandtotal,
      paymentId: paymentId,
      status: 'Pending',
      shippingDetails: shippingDetails
    };

    // Email params taiyar karein
    const emailParams = {
      to_name: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
      order_id: orderId,
      total_amount: '₹' + this.grandtotal.toFixed(2),
      customer_email: shippingDetails.email,
      message: `Aapka order successfully place ho gaya hai! Total Items: ${this.cart.length}`
    };

    // Order service mein save karein
    this.orderservice.PlaceOrder(finalOrder); // Make sure OrderService has this method

    // Confirmation Email
    this.emailService.sendEmailData(emailParams)
      .then(() => console.log('Email Sent Successfully!'))
      .catch((err) => console.error('Email sending failed!', err));
    
    this.inprocessing = false;

    Swal.fire({
      icon: 'success',
      title: 'Order Placed!',
      text: 'Bhai, shoes jald hi aapke paas honge! Confirmation email sent.',
      timer: 3000,
      showConfirmButton: false
    }).then(() => {
      // Order ke baad cart clear karna (sirf agar cart mode tha)
      if (!this.buyNowProduct) {
        this.cartservice.clearCart(); 
      }
      this.router.navigate(['/my-orders']);
    });
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as any).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}