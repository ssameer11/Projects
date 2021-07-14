import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing"
import { ErrorComponent } from "./error.component"

describe('ErrorComponent',() => {

    let fixture: ComponentFixture<ErrorComponent>;
    let component: ErrorComponent;
    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ErrorComponent]
        }).compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(ErrorComponent);
        component = fixture.componentInstance;
        component.errorMessage = 'THE DUMMY ERROR MESSAGE';
        fixture.detectChanges();
    })

    it('should get created and initialised',() => {
        expect(component).toBeDefined();
    })
})