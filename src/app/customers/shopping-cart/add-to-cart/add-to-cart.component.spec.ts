import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing"
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { of } from "rxjs";
import { CustomersService } from "../../customers.service";
import { AddToCartComponent } from "./add-to-cart.component"

describe('AddToCartComponent',() => {
    let fixture: ComponentFixture<AddToCartComponent>;
    let component: AddToCartComponent;
    let mockActivatedRoute = {
        params: of({id: 'theOutfitId'})
    }
    let customersServiceSpy = jasmine.createSpyObj('CustomersService',['addToCart']);
    let customersService: jasmine.SpyObj<CustomersService>;
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [AddToCartComponent],
            imports: [FormsModule],
            providers: [{provide: ActivatedRoute,useValue: mockActivatedRoute},
                        {provide: CustomersService,useValue: customersServiceSpy}]
        }).compileComponents();
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(AddToCartComponent);
        component = fixture.debugElement.componentInstance;
        customersService = TestBed.inject(CustomersService) as jasmine.SpyObj<CustomersService>;
        component.cartCount = 10;
        fixture.detectChanges();
    })

    it('should get created with correct parameters',() => {
        expect(component).toBeDefined();
        expect(component.outfitId).toEqual('theOutfitId');
        expect(component.cartCount).toEqual(10);
    })

    it('should call customersService.addToCart method with correct parameters',() => {
        component.onAddToCart();
        expect(customersService.addToCart).toHaveBeenCalledOnceWith(component.outfitId,component.cartCount);
    })
})