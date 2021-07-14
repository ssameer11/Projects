// import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-payment',
//   templateUrl: './payment.component.html',
//   styleUrls: ['./payment.component.scss']
// })
// export class PaymentComponent implements OnInit {

//   constructor() { }

//   ngOnInit(): void {
//   }

// }

import { HttpClient } from '@angular/common/http';
let http: HttpClient = null;
import { Component } from '@angular/core';
import { BACKEND_URL } from 'src/app/auth/api_keys';
import Stripe from 'stripe';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})

export class PaymentComponent {
  
  strikeCheckout:any = null;
  data: any;

  constructor(private http: HttpClient) { 
  }

  ngOnInit() {
    http = this.http;
    this.stripePaymentGateway();
  }
  
  checkout(amount) {
    this.stripePaymentGateway();
    const strikeCheckout = (<any>window).StripeCheckout.configure({
      key: 'pk_test_51HuEHPA0aJg8piPjouQGFtRpE9LFjTi4h4ZGKUE7U7lcy8rC3jcfIkfW4kzHjgHYqMb7lBzHNbF4PblDQQQGiK2a00DDIF6z62',
      locale: 'auto',
      token: (stripeToken: any) => {
        this.http.post(`${BACKEND_URL}/sellers/payment`,{token: stripeToken,amount: amount*100}).subscribe(resData => {
        })
      }
    });
  
    strikeCheckout.open({
      name: 'RemoteStack',
      description: 'Payment widgets',
      amount: amount * 100
    });
  }
  
  stripePaymentGateway() {
    if(!window.document.getElementById('stripe-script')) {
      const scr = window.document.createElement("script");
      scr.id = "stripe-script";
      scr.type = "text/javascript";
      scr.src = "https://checkout.stripe.com/checkout.js";

      scr.onload = () => {
        this.strikeCheckout = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51HuEHPA0aJg8piPjouQGFtRpE9LFjTi4h4ZGKUE7U7lcy8rC3jcfIkfW4kzHjgHYqMb7lBzHNbF4PblDQQQGiK2a00DDIF6z62',
          locale: 'auto',
          token: function (token: any) {
            alert('Payment via stripe successfull!');
          }
        });
      }
        
      window.document.body.appendChild(scr);
    }
  }


}