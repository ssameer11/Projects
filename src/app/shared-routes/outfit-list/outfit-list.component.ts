import { Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { map, switchMap, take, tap } from "rxjs/operators";
import { CustomersService } from "src/app/customers/customers.service";
import { ResizeWindowService } from "src/app/resize-window.service";
import { Outfit } from "src/app/shared/outfit.modle";
import { lsNames } from "src/app/shared/utility";
import { AppState } from "src/app/store/app.reducer";
import { SellersService } from "../../sellers/sellers.service";

@Component({
    selector: 'app-outfit-list',
    templateUrl: './outfit-list.component.html',
    styleUrls: ['./outfit-list.component.scss']
})
export class OutfitListComponent implements OnInit, OnDestroy {
    itemsPerPage: number;
    outfits: Outfit[] = [];
    currentPage: number = 1;
    lastPage: number = 0;
    fromSeller: boolean;
    isMobile = false;
    widthSubscription: Subscription;
    constructor(private router: Router
                ,private store: Store<AppState>
                ,private sellersService: SellersService
                ,private customersService: CustomersService
                ,private route: ActivatedRoute
                ,private resizeWindowService: ResizeWindowService) {
                }

    
    ngOnInit() {
        this.route.queryParams.pipe(
            map(qParams => {
                if(this.currentPage) this.setPageData(this.currentPage,this.itemsPerPage);
                this.fromSeller = qParams.fromSeller == 'true' ? true : false; 
                this.initializePageData();
        }),
            switchMap(() => {
                if(this.fromSeller) {
                    return this.store.select('sellers');
                }
                return this.store.select('customers');
            })
        ).subscribe(selectedState => {
            this.outfits = selectedState.outfits;
            this.lastPage = selectedState.lastPage;
        })
        
         this.widthSubscription = this.resizeWindowService.deviceDimensions.subscribe(data => {
            this.isMobile = data.width <= 420;
        })
    }

    onFirstPage() {
        this.currentPage = 1;
        this.fetchOutfitsThroughService();
    }

    onPreveousPage() {
        this.currentPage = Math.max(this.currentPage-1,1);
        this.fetchOutfitsThroughService();
    }

    onCurrentPage() {
        this.fetchOutfitsThroughService();
    }

    onNextPage() {
        this.currentPage = Math.min(this.lastPage,this.currentPage+1);
        this.fetchOutfitsThroughService()
    }

    onCreateOutfit() {
        this.router.navigate(['sellers','new'])
    }

    private setPageData(page?: number,itemsPerPage?: number) {
        const current = this.fromSeller ? lsNames.SELLER : lsNames.CUSTOMER;
        const data = JSON.parse(localStorage.getItem(current));
        if(page && itemsPerPage) {
            const pageData = {page: page,itemsPerPage: itemsPerPage};
            data ? localStorage.setItem(current,JSON.stringify({...data,...pageData})) : localStorage.setItem(current,JSON.stringify({...pageData})); 
        }
    }

    private initializePageData() {
        let current = this.fromSeller ? lsNames.SELLER : lsNames.CUSTOMER; 
        let data = JSON.parse(localStorage.getItem(current));
        data = data ? data : {page: 1,itemsPerPage: 12};
        if(data) {
            this.currentPage = data.page;
            this.itemsPerPage = data.itemsPerPage;
        }
    }

    private fetchOutfitsThroughService() {
        if(this.fromSeller) {
            this.sellersService.fetchOutfits(this.currentPage,this.itemsPerPage);
        } else {
            this.customersService.fetchOutfits(this.currentPage,this.itemsPerPage);
        }
    }

    ngOnDestroy() {
        if(this.widthSubscription) {
            this.widthSubscription.unsubscribe();
        }
        this.setPageData(this.currentPage,this.itemsPerPage);
    }

    @HostListener('window:beforeunload')
    onReload() {
        this.ngOnDestroy();
    }
}