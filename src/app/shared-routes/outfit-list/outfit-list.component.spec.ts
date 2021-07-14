import { async, ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing"
import { ActivatedRoute, Router } from "@angular/router";
import { MockStore, provideMockStore } from "@ngrx/store/testing"
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { CustomersService } from "src/app/customers/customers.service";
import { ResizeWindowService } from "src/app/resize-window.service";
import { SellersService } from "src/app/sellers/sellers.service";
import { SellersEffects } from "src/app/sellers/store/sellers.effects";
import { OutfitItemComponent } from "src/app/shared/outfit-item/outfit-item.component";
import { Outfit } from "src/app/shared/outfit.modle";
import { OutfitListComponent } from "./outfit-list.component"

// const activatedRouteData = new BehaviorSubject({fromSeller: 'true'});

describe('OutfitListComponent',() => {
    let fixture: ComponentFixture<OutfitListComponent>;
    let component: OutfitListComponent;
    let store: MockStore;
    let router: Router;
    let route: ActivatedRoute;
    let sellersServiceSpy: jasmine.SpyObj<SellersService>;
    let customersServiceSpy: jasmine.SpyObj<CustomersService>;
    let resizeWindowService: ResizeWindowService;
    const outfit = new Outfit('https://www.google.com/','THIS IS THE TITLE Customers','THIS IS Description',222,'MALE',20,4,[],'outfitId',{_id: 'userId'});
    const customersOutfits = [{...outfit}]
    const sellersOutfits = [{...outfit, title: 'Sellers Title'}];
    let subjectMock = new BehaviorSubject<{width: number,height: number}>({width: 500,height: 1000});
    let mockResizeWindowService = {
        deviceDimensions: subjectMock.asObservable()
    }
    
    let mockActivatedRoute = {
        // queryParams: activatedRouteData
        queryParams: of({fromSeller: 'true'})
        // queryParams: new Subject()
    }
    beforeEach(waitForAsync(() => {
        let sellersServiceMock = jasmine.createSpyObj('SellersService',['fetchOutfits']);
        let customersServiceMock = jasmine.createSpyObj('CustomersService',['fetchOutfits']);
        let mockRouter = jasmine.createSpyObj('Router',['navigate']);
        TestBed.configureTestingModule({
            declarations: [OutfitListComponent,OutfitItemComponent],
            providers: [{provide: ResizeWindowService, useValue: mockResizeWindowService},
                        provideMockStore({}),
                        {provide: Router, useValue: mockRouter},
                        {provide: ActivatedRoute, useValue: mockActivatedRoute},
                        {provide: SellersService, useValue: sellersServiceMock},
                        {provide: CustomersService, useValue: customersServiceMock}]
        }).compileComponents();
    }))

    beforeEach(() => {
        store = TestBed.inject(MockStore);
        fixture = TestBed.createComponent(OutfitListComponent);
        component = fixture.componentInstance;
        sellersServiceSpy = TestBed.inject(SellersService) as jasmine.SpyObj<SellersService>;
        customersServiceSpy = TestBed.inject(CustomersService) as jasmine.SpyObj<CustomersService>;
        router = TestBed.inject(Router);
        route = TestBed.inject(ActivatedRoute);
        resizeWindowService = TestBed.inject(ResizeWindowService);
        // fixture.detectChanges();
    })

    beforeEach(() => {
        store.overrideSelector('customers',{outfits: customersOutfits});
        store.overrideSelector('sellers',{outfits: sellersOutfits});
        // store.refreshState();
        fixture.detectChanges();
    })

    it('should be created and correctly initialized',() => {
        expect(component).toBeDefined();
        expect(component.currentPage).toEqual(1);
        expect(component.itemsPerPage).toEqual(12);
        const spy = spyOn<any>(component,'initializePageData').and.callThrough();
        component.ngOnInit();
        expect(spy).toHaveBeenCalled();
    })
    it('should correctly initialize page data for seller',() => {
        const spy = spyOn<any>(component,'fetchOutfitsThroughService').and.callThrough();
        component.onFirstPage();
        expect(spy).toHaveBeenCalled();
        expect(sellersServiceSpy.fetchOutfits).toHaveBeenCalled();
    })
    it('should correctly initialize page data for customer', () => {
        // activatedRouteData.next({fromSeller: 'false'});
        component.fromSeller = false;
        fixture.detectChanges();
        const spy = spyOn<any>(component,'fetchOutfitsThroughService').and.callThrough();
        component.onFirstPage();
        expect(spy).toHaveBeenCalled();
        expect(customersServiceSpy.fetchOutfits).toHaveBeenCalled();
    })

    it('should navigate to route on create outfit',() => {
        component.onCreateOutfit();
        expect(router.navigate).toHaveBeenCalledOnceWith(['sellers','new']);
    })

    it('should store page data on destroy or reload ',() => {
        const spy = spyOn<any>(component,'setPageData').and.callThrough();
        component.onReload();
        expect(spy).toHaveBeenCalledOnceWith(component.currentPage,component.itemsPerPage);
    })
})