import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing"
import { FormsModule } from "@angular/forms";
import { Store } from "@ngrx/store";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { OtpComponent } from "./otp.component"

describe('OtpComponent',() => {
    let fixture: ComponentFixture<OtpComponent>;
    let component: OtpComponent;
    let store: MockStore;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [OtpComponent],
            imports: [FormsModule],
            providers: [provideMockStore({})]
        }).compileComponents
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(OtpComponent);
        component = fixture.componentInstance;
        store = TestBed.inject(MockStore);
        component.otpValue = 123456;
        fixture.detectChanges();
    })

    it('should get created and initialized correctly',() => {
        expect(component).toBeDefined();
        expect(component.otpValue).toEqual(123456);
    })

    it('should dispatch signup action on submit',() => {
        const spy = spyOn(store,'dispatch').and.callFake(() => {});
        const form = fixture.debugElement.nativeElement.querySelector('form') as HTMLFormElement;
        form.dispatchEvent(new Event('submit'));
        expect(spy).toHaveBeenCalledTimes(1);
    })
})