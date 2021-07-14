import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing"
import { FormsModule } from "@angular/forms";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { AuthService } from "../auth.service";
import { SignupComponent } from "./signup.component";

describe('SignupComponent',() => {
    let fixture: ComponentFixture<SignupComponent>;
    let component: SignupComponent;
    let store: MockStore;
    let authServiceSpy: jasmine.SpyObj<AuthService>;

    beforeEach(waitForAsync(() => {
        const mockAuthService = jasmine.createSpyObj('AuthService',['login']);
        TestBed.configureTestingModule({
            declarations: [SignupComponent],
            imports: [FormsModule],
            providers: [provideMockStore({}),
                        {provide: AuthService, useValue: mockAuthService}]
        }).compileComponents();
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(SignupComponent);
        component = fixture.componentInstance;
        store = TestBed.inject(MockStore);
        authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        fixture.detectChanges();
    })

    it('should be created',() => {
        expect(component).toBeDefined();
    })

    it('should dispatch a signup action in signup mode on submit',() => {
        const signupForm = fixture.debugElement.nativeElement.querySelector('form') as HTMLFormElement;
        const spy = spyOn(store,'dispatch').and.callFake(() => {});
        signupForm.dispatchEvent(new Event('submit'));
        expect(spy).toHaveBeenCalledTimes(1);
    })

    it('should call login through auth service in login mode on submit',() => {
        const switchModeButton = fixture.debugElement.nativeElement.querySelector('.switch_mode-button') as HTMLButtonElement; 
        const signupForm = fixture.debugElement.nativeElement.querySelector('form') as HTMLFormElement;
        switchModeButton.click();
        signupForm.dispatchEvent(new Event('submit'));
        expect(authServiceSpy.login).toHaveBeenCalledTimes(1);
    })
})