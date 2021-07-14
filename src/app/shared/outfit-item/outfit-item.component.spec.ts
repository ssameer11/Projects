import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing"
import { OutfitItemComponent } from "./outfit-item.component"
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Router } from "@angular/router";
import { of } from "rxjs";
import { Outfit } from "../outfit.modle";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";


describe('OutfitItemComponent',() => {
    let component: OutfitItemComponent;
    let fixture: ComponentFixture<OutfitItemComponent>;
    let store: MockStore;
    let mockRouter = {
        navigate : jasmine.createSpy('navigate')
    }
    let router: Router;
    const outfit = new Outfit('https://www.google.com/','THIS IS THE TITLE Customers','THIS IS Description',222,'MALE',20,4,[],'outfitId',{_id: 'userId'});
    const customerOutfits = [{...outfit}]
    const sellerOutfits = [{...outfit, title: 'Sellers Title'}];

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule(
            {declarations: [OutfitItemComponent],
            imports: [FormsModule],
            providers: [provideMockStore({}),{provide: Router,useValue: mockRouter}]}
            ).compileComponents();            
    }))

    beforeEach(() => {
        store = TestBed.inject(MockStore);
        router = TestBed.inject(Router);
        fixture = TestBed.createComponent(OutfitItemComponent);
        component = fixture.componentInstance; 
    })

    beforeEach(() => {
        component.outfitIdx = 0;
        component.fromSeller = true;
        store.overrideSelector('customers',{outfits: customerOutfits});
        store.overrideSelector('sellers',{outfits: sellerOutfits});
        fixture.detectChanges();
    })
    it('should be created',() => {
        expect(component).toBeDefined();
    })
    it('should play animation and redirect when clicked ',() => {
        let outfitItem = fixture.debugElement.nativeElement.querySelector('.outfit_item') as HTMLDivElement;
        component.fromSeller = false;
        component.ngOnInit();
        outfitItem.click();
        expect(router.navigate).toHaveBeenCalledOnceWith(['shared','outfit-detail',`${component.outfit._id}`],{queryParams: {fromSeller: false}})
    })
})