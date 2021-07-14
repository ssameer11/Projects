import { HttpClient } from "@angular/common/http";
import { ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { BACKEND_URL } from "src/app/auth/api_keys";
import { Outfit } from "src/app/shared/outfit.modle";
import { AppState } from "src/app/store/app.reducer";
import { CustomersService } from "../customers.service";
import { FetchCart } from "../store/customers.actions";

@Component({
    selector: 'app-shopping-cart',
    templateUrl: './shopping-cart.component.html',
    styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit, OnDestroy{
    cart: {_id: string,outfit: Outfit,count: number}[] = null;
    changedItemsData: {[id: string]: {updatedCount: number}} = {};
    itemsToBeChanged: number = 0;
    itemsToBeRemoved: number = 0;
    removedItemsData: {[key: string]: boolean} = {};
    strikeCheckout:any = null;
    itemsMoreThanInStock: {[key: string]: boolean} = {};
    ngOnInit() {
        this.stripePaymentGateway();
        this.store.select('customers').subscribe(customersState => {
            this.cart = customersState.cart
        })     
    }


    constructor(private customersService: CustomersService,
                private router: Router,
                private store: Store<AppState>,
                private http: HttpClient) {}

    onClick(id: string) {
        // this.router.navigate(['shared','outfit-detail'],{queryParams: {fromCart: true,index: i}});
        this.router.navigate(['shared','outfit-detail',`${id}`]);
    }

    onCountChange(id: string,newCount: number,originalCount: number) {
        if(newCount !== originalCount) {
            let newObj = {updatedCount: newCount}
            if(!this.changedItemsData[id]) this.itemsToBeChanged += 1;
            this.changedItemsData[id] = newObj;
        } else {
            // remove it from the update list
            delete this.changedItemsData[id];
            this.itemsToBeChanged -= 1;
        }
    }

    onBuyCartItem(itemId: string,index: number) {
        const cartItem = this.cart[index];
        const count = this.changedItemsData[itemId] ? this.changedItemsData[itemId].updatedCount : cartItem.count;
        // DONT HAVE THIS MANY ITEMS AVAILABLE AT THE MOMENT 
        if(cartItem.outfit.stockCount < count) {
            return ;
        }   
        // CALCULATE THE PRICE AND CALL THE PAYMENT 
        const totalPrice = +count * (+cartItem.outfit.price);
        this.checkout({amount: totalPrice,outfitId: cartItem.outfit._id,count: count,cartItemId: cartItem._id});
    }

    onBuyAll() {
        this.ngOnDestroy();
        let totalPrice = 0;
        for(let item of this.cart) {
            let count = item.count;
            if(this.changedItemsData[item._id]) count = this.changedItemsData[item._id].updatedCount;
            if(count > item.outfit.stockCount) {
                this.itemsMoreThanInStock[item._id] = true;
            } else {
                totalPrice += +count*(+item.outfit.price);
            }
        }

        this.checkout({amount: totalPrice});
    }

    ngOnDestroy() {
        for(let key in this.changedItemsData) {
            if(this.changedItemsData[key].updatedCount === 0) {
                this.removedItemsData[key] = true;
                delete this.changedItemsData[key];
            }
        }
        if(this.itemsToBeChanged) {
            this.customersService.updateCart(this.changedItemsData);
        }
        if(this.itemsToBeRemoved) {
            this.customersService.removeFromCart(this.removedItemsData);
        }
    }

    onRemove(id: string,theItem: HTMLElement,theParent: HTMLElement) {
        theParent.classList.add('animate-move');
        theItem.classList.add('animate-rotate');
        setTimeout(() => {
            this.removedItemsData[id] = true;
            if(this.itemsToBeRemoved == this.cart.length) this.cart = [];
        },600)
        this.itemsToBeRemoved += 1;
    }

   

    checkout(data: {amount: number,outfitId?: string,count?: number,cartItemId?: string}) {
        // const amount = this.selectedOutfit.price;
        const strikeCheckout = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51HuEHPA0aJg8piPjouQGFtRpE9LFjTi4h4ZGKUE7U7lcy8rC3jcfIkfW4kzHjgHYqMb7lBzHNbF4PblDQQQGiK2a00DDIF6z62',
          locale: 'auto',
          currency: 'INR',
          token: (stripeToken: any) => {
            if(data.cartItemId) {
                this.http.post(`${BACKEND_URL}/sellers/payment/${data.outfitId}`,{token: stripeToken,amount: data.amount,count: data.count,cartItemId: data.cartItemId}).subscribe(resData => {
                    this.store.dispatch(FetchCart());
                })
            } else {
                this.http.post(`${BACKEND_URL}/sellers/payment/cart`,{token: stripeToken,amount: data.amount}).subscribe(resData => {
                    this.store.dispatch(FetchCart());
                })
            }
            // http.post
          }
        });
      
        strikeCheckout.open({
          name: 'RemoteStack',
          description: 'Payment widgets',
          amount: data.amount*100
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


    @HostListener('window:beforeunload')
    windowClose() {
        this.ngOnDestroy();
    }
}