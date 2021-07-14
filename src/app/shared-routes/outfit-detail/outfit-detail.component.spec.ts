import { HttpClient } from "@angular/common/http";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing"
import { Router } from "@angular/router";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { SellersService } from "src/app/sellers/sellers.service";
import { Outfit } from "src/app/shared/outfit.modle";
import { OutfitDetailComponent } from "./outfit-detail.component";

describe('OutfitDetailComponent',() => {
    let fixture: ComponentFixture<OutfitDetailComponent>;
    let component: OutfitDetailComponent;
    let store: MockStore;
    let sellersServiceSpy: jasmine.SpyObj<SellersService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let httpClientSpy: jasmine.SpyObj<HttpClient>;
    const outfit = new Outfit('https://www.google.com/','THIS IS THE TITLE Customers','THIS IS Description',222,'MALE',20,4,[],'outfitId',{_id: 'userId'});
    const outfits = [{...outfit}]
    beforeEach(waitForAsync(() => {
        let mockRouter = jasmine.createSpyObj('Router',['navigate','navigateByUrl']);
        let mockHttpClient = jasmine.createSpyObj('HttpClient', ['get','post','delete','patch','put']);
        let mockSellersService = jasmine.createSpyObj('SellersService',['createOutfit','updateOutfit','deleteOutfit']);
        let mockAuthState = {user: {userId: 'userId',_tokenExpirationDate: (new Date().setHours(new Date().getHours() + 1))}}
        let mockSharedState = {selectedOutfitData: {outfit: outfits[0],fromSeller: true}};
        TestBed.configureTestingModule({
            declarations: [OutfitDetailComponent],
            providers: [provideMockStore(
                        {selectors: [
                            {selector: 'auth',value: mockAuthState},
                            {selector: 'shared', value: mockSharedState}
                        ]}),
                        {provide: Router, useValue: mockRouter},
                        {provide: HttpClient, useValue: mockHttpClient},
                        {provide: SellersService, useValue: mockSellersService}]
        }).compileComponents();

    }))


    beforeEach(() => {
        fixture = TestBed.createComponent(OutfitDetailComponent);
        component = fixture.componentInstance;
        routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        sellersServiceSpy = TestBed.inject(SellersService) as jasmine.SpyObj<SellersService>;
        httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
        store = TestBed.inject(MockStore);
        fixture.detectChanges();
    })

    it('should be created',() => {
        const spy = spyOn(component,'stripePaymentGateway');
        expect(component).toBeDefined();
        component.ngOnInit();
        expect(spy).toHaveBeenCalled();
    })

    it('should call checkout when called buyNow',() => {
        fixture.detectChanges();
        const spy  = spyOn(component,'checkout');
        component.onBuyNow();
        expect(spy).toHaveBeenCalled();
    })

    it('should navigate to a url when add to cart called',() => {
        fixture.detectChanges();
        component.onAddTocart();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(`customers/add-to-cart/${component.selectedOutfit._id}`)
    })

    it('should navigate to a url when edit called',() => {
        fixture.detectChanges();
        component.canEdit = true;
        component.onEdit();
        expect(routerSpy.navigateByUrl).toHaveBeenCalledWith(`sellers/${component.selectedOutfit._id}/edit`)
    })

    it('should call sellersService delete method on delete',() => {
        fixture.detectChanges();
        component.onDelete();
        expect(sellersServiceSpy.deleteOutfit).toHaveBeenCalledWith(component.selectedOutfit._id);
    })
})