import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing"
import { Form, FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { BehaviorSubject, of } from "rxjs";
import { ResizeWindowService } from "src/app/resize-window.service";
import { Outfit } from "src/app/shared/outfit.modle";
import { categories } from "src/app/shared/utility";
import { SellersService } from "../sellers.service";
import { OutfitEditComponent } from "./outfit-edit.component"

const outfit = new Outfit('https://www.google.com/','THIS IS THE TITLE Customers','THIS IS Description',222,'MALE',20,4,[['instruction 1 name','instruction 1 value']],'outfitId',{_id: 'userId'});
const outfits = [{...outfit}];
    describe('OutfitEditComponent',() => {
    let fixture: ComponentFixture<OutfitEditComponent>;
    let component: OutfitEditComponent;
    let sellersServiceSpy: jasmine.SpyObj<SellersService>;
    let resizeWindowSErviceSpy: jasmine.SpyObj<ResizeWindowService>;
    let activatedRouteSubject = new BehaviorSubject({outfitData: {outfit: outfits[0]}})
    let mockActivatedRoute = {
        data: activatedRouteSubject
    };
    let mockSellersService = jasmine.createSpyObj('SellersService',['createOutfit','updateOutfit']);
    let mockResizeWindowService = {
        deviceDimensions: of({width: 450,height: 1000})
    }
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [OutfitEditComponent],
            imports: [ReactiveFormsModule],
            providers: [{provide: SellersService, useValue: mockSellersService},
                        {provide: ActivatedRoute, useValue: mockActivatedRoute},
                        {provide: ResizeWindowService, useValue: mockResizeWindowService}]
        }).compileComponents();
    }))

    beforeEach(() => {
        activatedRouteSubject.next({outfitData: {outfit: outfits[0]}});
        fixture = TestBed.createComponent(OutfitEditComponent);
        component = fixture.componentInstance;
        sellersServiceSpy = TestBed.inject(SellersService) as jasmine.SpyObj<SellersService>;
        resizeWindowSErviceSpy = TestBed.inject(ResizeWindowService) as jasmine.SpyObj<ResizeWindowService>;
        fixture.detectChanges();
    })

    it('should be created and initialised correctly for edit mode',() => {
        expect(component).toBeDefined();
        const dummyForm = createDummyForm(outfits[0]);
        expect(component.outfitForm.value).toEqual(dummyForm.value);
    })

    it('should be created and initialised correctly for new product',() => {
        activatedRouteSubject.next({outfitData: {outfit: null}});
        fixture.detectChanges();
        expect(component.outfitForm.value).toEqual(createDummyForm().value);
    })

    it('should get the instructions controls on getControls',() => {
        let dummyForm = createDummyForm(outfits[0]);
        let dummyControls = (dummyForm.get('instructions') as FormArray).controls;
        expect(component.controls.length).toEqual(dummyControls.length);
    })

    it('should return a form array on populate instructions ',() => {
        expect(component['populateInstructions']()).toBeInstanceOf(FormArray);
    })

    it('should return formGroup from formData',() => {
        expect(component['formGroupToFormData']()).toBeInstanceOf(FormData);
    })

    it('should add instruction to the instructions array',() => {
        const instructionsLengthBefore = (component.outfitForm.get('instructions') as FormArray).length;
        let addInstructionButton = fixture.debugElement.nativeElement.querySelector('.add_instructions-button') as HTMLButtonElement;
        addInstructionButton.click(); 
        const instructionsLengthAfter = (component.outfitForm.get('instructions') as FormArray).length;
        expect(instructionsLengthAfter).toBeGreaterThan(instructionsLengthBefore);
    })

    it('should remove instruction from the instructions array',() => {
        const instructionsLengthBefore = (component.outfitForm.get('instructions') as FormArray).length;
        let removeInstructionButton = fixture.debugElement.nativeElement.querySelector('.remove_instruction-button') as HTMLButtonElement;
        removeInstructionButton.click(); 
        const instructionsLengthAfter = (component.outfitForm.get('instructions') as FormArray).length;
        expect(instructionsLengthAfter).toBeLessThan(instructionsLengthBefore);
    })

    it('should parse the data before submiting and make a edit call through sellersService',waitForAsync(() => {
        const submitButton = fixture.debugElement.nativeElement.querySelector('.submit-button') as HTMLButtonElement;
        let spy = spyOn<any>(component,'formGroupToFormData').and.callThrough();
        submitButton.click();
        expect(sellersServiceSpy.updateOutfit).toHaveBeenCalledTimes(1);
    }))

    it('should parse the data before submitting and make a create outfit call to sellers service',() => {
        activatedRouteSubject.next({outfitData: {outfit: null}});
        fixture.detectChanges();
        const submitButton = fixture.debugElement.nativeElement.querySelector('.submit-button') as HTMLButtonElement;
        submitButton.click();
        expect(sellersServiceSpy.createOutfit).toHaveBeenCalledTimes(1);
    })
})

const createDummyForm = (outfit?: Outfit): FormGroup => {
    const dummyFormGruop = new FormGroup({
        'title': new FormControl(outfit ? outfit.title : ''),
        'image': new FormControl('',[Validators.required]),
        'description': new FormControl(outfit ? outfit.description : '',[Validators.required]),
        'price': new FormControl(outfit ? outfit.price : '',[Validators.required]),
        'stockCount': new FormControl(outfit ? outfit.stockCount : '',[Validators.required]),
        'rating': new FormControl(outfit ? outfit.rating : '',[Validators.required]),
        'category': new FormControl(outfit ? outfit.category : categories[0],[Validators.required]),
        'instructions': new FormArray(outfit ? [new FormGroup({
            'name': new FormControl(outfit.instructions[0][0]),
            'value': new FormControl(outfit.instructions[0][1])
        })] : [])
    })

    return dummyFormGruop;
}