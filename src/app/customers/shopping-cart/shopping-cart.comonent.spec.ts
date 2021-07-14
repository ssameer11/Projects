import { HttpClient } from "@angular/common/http";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { Router } from "@angular/router";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { of } from "rxjs";
import { Outfit } from "src/app/shared/outfit.modle";
import { CustomersService } from "../customers.service";
import { ShoppingCartComponent } from "./shopping-cart.component";


const outfit = new Outfit('https://www.google.com/','THIS IS THE TITLE Customers','THIS IS Description',222,'MALE',20,4,[],'outfitId',{_id: 'userId'});
const cart : {_id: string,outfit: Outfit,count: number}[] = [{_id: 'cartItemId',outfit: {...outfit},count: 11}];

describe('ShoppingCartComponent',() => {
    let fixture: ComponentFixture<ShoppingCartComponent>;
    let component: ShoppingCartComponent;
    let customersServiceSpy: jasmine.SpyObj<CustomersService>;
    let store: MockStore;
    let routerSpy: jasmine.SpyObj<Router>;
    let httpSpy: jasmine.SpyObj<HttpClient>;
    beforeEach(waitForAsync(() => {
        let mockCustomersService = {
            updateCart: jasmine.createSpy('updateCart'),
            removeFromCart: jasmine.createSpy('removeFromCart')
        }
        let mockRouter = jasmine.createSpyObj('Router',['navigate']);
        let mockHttpClient = jasmine.createSpyObj('HttpClient',['post']);
        TestBed.configureTestingModule({
            declarations: [ShoppingCartComponent],
            providers: [provideMockStore({}),{provide: Router,useValue: mockRouter},
                        {provide: HttpClient,useValue: mockHttpClient},
                        {provide: CustomersService,useValue: mockCustomersService},
                        ]
        }).compileComponents()
    })) 

    beforeEach(() => {
        fixture = TestBed.createComponent(ShoppingCartComponent);
        component = fixture.componentInstance;
        store = TestBed.inject(MockStore);
        routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        customersServiceSpy = TestBed.inject(CustomersService) as jasmine.SpyObj<CustomersService>;
        httpSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
        store.overrideSelector('customers',{cart});
        fixture.detectChanges();
    })

    it('should be created and correctly initialized',() => {
        let spy = spyOn(component,'stripePaymentGateway').and.callThrough();
        expect(component).toBeDefined();
        component.ngOnInit();
        expect(spy).toHaveBeenCalledTimes(1);
    })

    it('should navigate to route when clicked ',() => {
        const id = cart[0].outfit._id;
        const el = fixture.debugElement.nativeElement.querySelectorAll('.clickable_area')[0];
        el.click();
        expect(routerSpy.navigate).toHaveBeenCalledOnceWith(['shared','outfit-detail',`${id}`]);
    })

    it('should update changedItemsData when input value is changed and should update values through service on ngOnDestory',() => {
        const el = fixture.debugElement.nativeElement.querySelectorAll('.cart_item')[0] as HTMLDivElement;
        let input = el.querySelectorAll('input')[0] as HTMLInputElement;
        input.type = 'number';
        input.value = '200';
        input.dispatchEvent(new Event('input'))
        fixture.detectChanges();
        const id = cart[0]._id;
        let expectedChangedItemsData: {[key: string]: {updatedCount: number}} = {};
        expectedChangedItemsData[id] = {updatedCount: 200};
        expect(component.changedItemsData).toEqual(expectedChangedItemsData);
        component.ngOnDestroy();
        expect(customersServiceSpy.updateCart).toHaveBeenCalledOnceWith(expectedChangedItemsData);
    })

    it('should call checkout on clicking buyItem',() => {
        let el = fixture.debugElement.nativeElement.querySelector('.cart_item') as HTMLDivElement;
        let buyItemButton = el.querySelector('.delete_and_input').querySelector('button') as HTMLButtonElement;
        let spy = spyOn(component,'checkout');
        buyItemButton.click();
        // fixture.detectChanges();
        expect(spy).toHaveBeenCalledTimes(1);
    })

    it('should call checkout and ngOnDestroy on clicking buyAll',() => {
        let buyAllButton = fixture.debugElement.nativeElement.querySelector('.buy_all-button') as HTMLButtonElement;
        let spy = spyOn(component,'checkout');
        let ngOnDestroySpy = spyOn(component,'ngOnDestroy');
        buyAllButton.click();
        fixture.detectChanges();
        expect(ngOnDestroySpy).toHaveBeenCalledTimes(1);
        expect(spy).toHaveBeenCalledTimes(1);
    })

    it('should change the removedItemsData on cilcking remove and should remove the data through service on ngOnDestroy',waitForAsync(() => {
        let removeButton = fixture.debugElement.nativeElement.querySelector('.cart_item').querySelector('.remove-button') as HTMLDivElement;
        let dataBefore = {...component.removedItemsData};
        jasmine.clock().install();
        removeButton.click();
        jasmine.clock().tick(600);
        expect(component.removedItemsData).not.toEqual(dataBefore);
        component.ngOnDestroy();
        expect(customersServiceSpy.removeFromCart).toHaveBeenCalledOnceWith(component.removedItemsData);
        jasmine.clock().uninstall();
    }))

    it('should call ngOnDestroy on reload or close ',() => {
        const spy = spyOn(component,'ngOnDestroy');
        component.windowClose();
        expect(spy).toHaveBeenCalledTimes(1);
    })
})


