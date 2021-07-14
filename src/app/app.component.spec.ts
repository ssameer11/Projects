import { NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing"
import { Router, RouterModule } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing"
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { AppComponent } from "./app.component";
import { AuthService } from "./auth/auth.service";
import { FooterComponent } from "./footer/footer.component";
import { HeaderComponent } from "./header/header.component";
import { ResizeWindowService } from "./resize-window.service";

describe('AppComponent',() => {
    let fixture: ComponentFixture<AppComponent>;
    let component: AppComponent;
    let store: MockStore;
    let authServiceSpy: jasmine.SpyObj<AuthService>;

    beforeEach(waitForAsync(() => {
        const mockAuthService = jasmine.createSpyObj('AuthService',['autoLogin']);
        TestBed.configureTestingModule({
            declarations: [AppComponent],
            // imports: [RouterTestingModule,RouterModule],
            providers: [
                provideMockStore({}),
                {provide: AuthService, useValue: mockAuthService},
            ],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents();
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;
        store = TestBed.inject(MockStore);
        authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    })

    beforeEach(() => {
        store.overrideSelector('shared',{isLoading: false,errorMessage: null});
        fixture.detectChanges();
    })

    it('should be created and initialised correctly ',() => {
        expect(component).toBeDefined();
        expect(component.errorMessage).toBeNull();
        expect(component.isLoading).toBeFalse();
    })
})