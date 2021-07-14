import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing"
import { ChildrenOutletContexts, RouterModule } from "@angular/router";
import { AuthComponent } from "./auth.component";

describe('AuthComponent',() => {
    let fixture: ComponentFixture<AuthComponent>;
    let component: AuthComponent;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [AuthComponent],
            imports: [RouterModule],
            providers: [ChildrenOutletContexts]
        }).compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(AuthComponent);
        component = fixture.componentInstance;
    })

    it('should be created',() => {
        expect(component).toBeDefined();
    })
})