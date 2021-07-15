import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, map, switchMap } from "rxjs/operators";
import { BACKEND_URL } from "src/app/auth/api_keys";
import { SellersService } from "src/app/sellers/sellers.service";
import { Outfit } from "src/app/shared/outfit.modle";
import { AddErrorMessage } from "src/app/shared/store/shared.actions";
import { AppState } from "src/app/store/app.reducer";

@Component({
    selector: "app-outfit-detail",
    templateUrl: './outfit-detail.component.html',
    styleUrls: ['./outfit-detail.component.scss']
})
export class OutfitDetailComponent implements OnInit{
    outfitIdx: number;
    fromSeller: boolean;
    selectedOutfit: Outfit;
    canEdit: boolean;
    stockCount: number;
    stars: number[] = [];
    isLoggedIn: boolean = false;
    strikeCheckout:any = null;

    constructor(private store: Store<AppState>,
                private sellersService: SellersService,
                private router: Router,
                private http: HttpClient) {}

    ngOnInit() {
        this.stripePaymentGateway();
        this.store.select('auth').pipe(
            map(authState => {
                if(authState.user && new Date(authState.user._tokenExpirationDate) > new Date()) {
                    this.isLoggedIn = true;
                    return authState.user.userId; 
                }
                return false;
            }),
            switchMap(userId => {
                return this.store.select('shared').pipe(map(
                  sharedState => {
                    this.selectedOutfit = sharedState.selectedOutfitData.outfit;
                    this.stars = new Array(+this.selectedOutfit.rating).fill(1);
                    this.stockCount = this.selectedOutfit.stockCount;
                    this.fromSeller = sharedState.selectedOutfitData.fromSeller;
                    this.canEdit = (userId && (userId === this.selectedOutfit.creator._id));
                }
                ))
            })
        ).subscribe();
        
    }

    onBuyNow() {
      this.checkout();
   }

    onAddTocart() {
      this.router.navigateByUrl(`customers/add-to-cart/${this.selectedOutfit._id}`)
    }

    onEdit() {
      if(this.canEdit) this.router.navigateByUrl(`sellers/${this.selectedOutfit._id}/edit`);
    }    

    onDelete() {
        this.sellersService.deleteOutfit(this.selectedOutfit._id);
    }

    checkout() {
        const amount = this.selectedOutfit.price;
        if(!this.isLoggedIn) {
            this.router.navigateByUrl('/auth');
            return;
        }
        const strikeCheckout = (<any>window).StripeCheckout.configure({
          key: 'pk_test_51HuEHPA0aJg8piPjouQGFtRpE9LFjTi4h4ZGKUE7U7lcy8rC3jcfIkfW4kzHjgHYqMb7lBzHNbF4PblDQQQGiK2a00DDIF6z62',
          locale: 'auto',
          currency: 'INR',
          token: (stripeToken: any) => {
            this.http.post(`${BACKEND_URL}/sellers/payment/${this.selectedOutfit._id}`,{token: stripeToken,amount: amount}).pipe(
              catchError(err => {
                this.store.dispatch(AddErrorMessage({payload: {errorMessage: err.error.message}}))
                return of();
              })
            ).subscribe(resData => {
            })
          }
        });
      
        strikeCheckout.open({
          name: 'RemoteStack',
          description: 'Payment widgets',
          amount: amount*100
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