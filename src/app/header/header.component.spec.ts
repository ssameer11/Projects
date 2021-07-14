import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { BehaviorSubject, of } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { ResizeWindowService } from "../resize-window.service";
import { categories } from "../shared/utility";
import { HeaderComponent } from "./header.component"

describe('HeaderComponent',() => {
    let activatedRouteData = new BehaviorSubject({fromSeller: true});
    let fixture: ComponentFixture<HeaderComponent>;
    let component: HeaderComponent;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let resizeWindowServiceSpy: jasmine.SpyObj<ResizeWindowService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;
    let store: MockStore;
    let saveFiltersSpy: any;
    let onHideMobileMenuSpy: any;
    beforeEach(waitForAsync(() => {
        let mockAuthService = jasmine.createSpyObj('AuthService',['logout']);
        let mockRouter = {
            navigate: jasmine.createSpy('navigate'),
            navigateByUrl: jasmine.createSpy('navigateByUrl'),
            events: of(new NavigationEnd(2,'dummyUrl','dummyUrlAfterRedirect'))
        }
        
        let mockActivatedRoute = {
            queryParams: activatedRouteData
        }

        let mockLocationService = jasmine.createSpyObj('Location',['path']);

        let mockResizeWindowService = {
            deviceDimensions: of({width: 450,height: 1000})
        }
        TestBed.configureTestingModule({
            declarations: [HeaderComponent],
            imports: [FormsModule],
            providers: [provideMockStore({}),
                        {provide: AuthService, useValue: mockAuthService},
                        {provide: Router, useValue: mockRouter},
                        {provide: ActivatedRoute, useValue: mockActivatedRoute},
                        {provide: Location, useValue: mockLocationService},
                        {provide: ResizeWindowService, useValue: mockResizeWindowService}]
        }).compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(HeaderComponent);
        component = fixture.componentInstance;
        store = TestBed.inject(MockStore);
        authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        resizeWindowServiceSpy = TestBed.inject(ResizeWindowService) as jasmine.SpyObj<ResizeWindowService>;
        routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        activatedRouteSpy = TestBed.inject(ActivatedRoute) as jasmine.SpyObj<ActivatedRoute>;
    })

    beforeEach(() => {
        saveFiltersSpy = spyOn(component,'saveFilters');
        onHideMobileMenuSpy = spyOn(component,'onHideMobileMenu');
        store.overrideSelector('auth',{user: 'dummyUser'});
        store.refreshState();
        fixture.detectChanges;
    })

    it('should be created',() => {
        expect(component).toBeDefined();
    })

    // it('should call authService.logout on logout and set the UI',() => {
    //     // THIS ALSO RELOADS THE PAGE SO BE CAREFULL OK 
    //     component.onLogout();
    //     expect(authServiceSpy.logout).toHaveBeenCalledTimes(1);
    //     expect(onHideMobileMenuSpy).toHaveBeenCalledTimes(1);
    // })

    it('should navigate to sellers and update other values outfit list on clicking sellers ',() => {
        component.onSellerOrCustomer(true);
        expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['shared','outfit-list'],{queryParams: {fromSeller: true}});
        expect(component.currentActive).toEqual(component.actives.seller);
        expect(onHideMobileMenuSpy).toHaveBeenCalledTimes(1);
        expect(saveFiltersSpy).toHaveBeenCalledTimes(1);
    })

    it('should set the UI and save the data and navigate to a URL on clicking on Cart',() => {
        component.onCart();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledOnceWith('/customers/shopping-cart');
        expect(component.currentActive).toEqual(component.actives.shoppingCart);
        expect(onHideMobileMenuSpy).toHaveBeenCalledTimes(1);
        expect(saveFiltersSpy).toHaveBeenCalledTimes(1);
    })

    it('should navigate to correct url with correct queryparameters on filter',() => {
        fixture.detectChanges();
        const filterDiv = fixture.debugElement.nativeElement.querySelector('.filters') as  HTMLDivElement;
        const categorySelect = filterDiv.querySelector('select') as HTMLSelectElement;
        categorySelect.value = categories[1];
        component.searchStringValue = 'SEARCH STRING';
        categorySelect.dispatchEvent(new Event('change'));
        fixture.detectChanges();
        const qParams: {[key: string]: any} = {};
        qParams.category = categories[1];
        qParams.page = 1;
        qParams.title = 'SEARCH STRING'
        qParams.fromSeller = component.fromSeller;
        qParams.filterChanged = true;
        expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['shared','outfit-list'],{queryParams: qParams})
    })

    it('should call filter on clearFilter',() => {
        component.searchStringValue = '';
        const spy = spyOn(component,'onFilter');
        component.clearFilter();
        expect(spy).toHaveBeenCalledTimes(1);
    })

    it('should call set filters on initializeCurrentActive',() => {
        const spy = spyOn(component,'setFilters');
        component.initializeCurrentActive();
        expect(spy).toHaveBeenCalledTimes(1);
    })
})