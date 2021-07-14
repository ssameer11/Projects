import { Location } from "@angular/common";
import { AfterViewInit, Component, Input, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd, NavigationStart, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { filter, map, switchMap, take } from "rxjs/operators";
import { AuthService } from "../auth/auth.service";
import { ResizeWindowService } from "../resize-window.service";
import { categories, lsNames } from "../shared/utility";
import { AppState } from "../store/app.reducer";

@Component({
    selector: "app-header",
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit , OnDestroy{
    fromSeller: boolean = false;
    public categories = categories;
    @Input() searchStringValue = '';
    @Input() categoryValue = categories[0];
    currentActive: actives;
    actives = actives;
    isMobile = false;
    showMenu = false;
    widthSubscription: Subscription;
    isLoggedIn: boolean = false;

    constructor(private authService: AuthService,
                private router: Router,
                private store: Store<AppState>,
                private route: ActivatedRoute,
                private location: Location,
                private resizeWindowService: ResizeWindowService) {}


    ngOnInit() {
        this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(d => {
            this.initializeCurrentActive();
        })
        this.route.queryParams.pipe(
            map(qParams => {
                let pValue = qParams.fromSeller;
                this.setParamsValue(pValue);
            }),
            switchMap(() => {
                return this.store.select('auth')
            })
        ).subscribe(authState => {
            this.isLoggedIn = !!authState.user;
        })
        
        this.widthSubscription = this.resizeWindowService.deviceDimensions.subscribe(data => {
            this.isMobile = data.width <= 420;
        })
    }
    onLogout() {
        this.onHideMobileMenu();
        this.authService.logout();
        window.location.reload();
    }

    onSellerOrCustomer(data) {
        this.saveFilters();
        const fromSeller = data ? true : false
        this.currentActive = fromSeller ? actives.seller : actives.home;
        this.router.navigate(['shared','outfit-list'],{queryParams: {fromSeller}});
        this.onHideMobileMenu();
    }

    onCart() {
        this.saveFilters();
        this.currentActive = actives.shoppingCart;
        this.onHideMobileMenu();
        this.router.navigateByUrl('/customers/shopping-cart');
    }
    onFilter() {
        this.saveFilters();
        const qParams: {[key: string]: any} = {};
        qParams.fromSeller = this.fromSeller;
        this.searchStringValue.length > 0 ? (qParams.title = this.searchStringValue) : null;
        this.categoryValue != 'None' ? (qParams.category = this.categoryValue) : null;
        qParams.filterChanged = true;
        qParams.page = 1;
        this.router.navigate(['shared','outfit-list'],{queryParams: qParams})
    }

    clearFilter() {
        this.searchStringValue.length == 0 ? this.onFilter() : null;
    }
    setParamsValue(pValue: string) {
        this.fromSeller = pValue == 'true';
    }

    initializeCurrentActive() {
        if(this.fromSeller) {
            this.currentActive = actives.seller;
        } else if(this.location.path().includes('shopping-cart')) {
            this.currentActive = actives.shoppingCart;
        } else {
            this.currentActive = actives.home;
        }
        this.setFilters();
    }


    onShowMobileMenu() {
        this.showMenu = true;
    }

    onHideMobileMenu(element?: HTMLElement) {
        if(this.showMenu) {
            if(element) {
                element.style.animation = 'hide-menu 300ms 1 forwards';
                setTimeout(() => {
                    this.showMenu = false;
                },300)
            } else {
                const el = (document.getElementsByClassName('mobile-menu_list') as HTMLCollection)[0] as HTMLElement;
                if(el) {
                    el.style.animation = 'hide-menu 300ms 1 forwards';
                }
                setTimeout(() => {
                    this.showMenu = false;
                },300)
            }
        }
    }

    ngOnDestroy() {
        if(this.widthSubscription) {
            this.widthSubscription.unsubscribe();
        }
    }




    saveFilters() {
        let current = this.fromSeller ? lsNames.SELLER : lsNames.CUSTOMER;
        let pageData = JSON.parse(localStorage.getItem(current));
        if(pageData && this.currentActive !== this.actives.shoppingCart) {
            pageData.category = this.categoryValue !== 'None' ? this.categoryValue : undefined;
            pageData.searchString = this.searchStringValue !== '' ? this.searchStringValue : undefined;
            localStorage.setItem(current,JSON.stringify(pageData));
        }
    }

    setFilters() {
        let current = this.fromSeller ? lsNames.SELLER : lsNames.CUSTOMER;
        let pageData = JSON.parse(localStorage.getItem(current)) || {};
        this.categoryValue = (pageData.category && this.currentActive !== this.actives.shoppingCart) ? pageData.category : 'None';
        this.searchStringValue = (pageData.searchString && this.currentActive !== this.actives.shoppingCart) ? pageData.searchString : '';
    }

}

enum actives {
    home,
    shoppingCart,
    seller
}