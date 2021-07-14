import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { AppState } from "src/app/store/app.reducer";
import { Outfit } from "../outfit.modle";

@Component({
    selector: 'app-outfit-item',
    templateUrl: './outfit-item.component.html',
    styleUrls: ['./outfit-item.component.scss']
})
export class OutfitItemComponent implements OnInit{
    @Input() outfitIdx: number;
    @Input() fromSeller: boolean;
    theSubscription: Subscription;
    outfit: Outfit;
    stars: number[] = [];
    animate = false;
    constructor(private store: Store<AppState>,private router: Router) {}

    ngOnInit() {
        if(this.fromSeller) {
            this.store.select('sellers').subscribe(sellerState => {
                this.outfit = sellerState.outfits[this.outfitIdx];
                if(this.outfit) this.stars = new Array(+this.outfit.rating).fill(1);
            })
        } else {
            this.store.select('customers').subscribe(customersState => {
                this.outfit = customersState.outfits[this.outfitIdx];
                if(this.outfit) {
                    this.stars = new Array(+this.outfit.rating).fill(1);
                }
            })
        }
    }

    onClick() {
        this.animate = true;
        // this.router.navigate(['shared','outfit-detail'],{queryParams: {index: this.outfitIdx}});
        this.router.navigate(['shared','outfit-detail',`${this.outfit._id}`],{queryParams: {fromSeller: this.fromSeller}});
    }
    
}