import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing"
import { FooterComponent } from "./footer.component";

describe('FooterComponent',() => {
    let fixture: ComponentFixture<FooterComponent>;
    let component: FooterComponent;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [FooterComponent]
        }).compileComponents()
    }))

    beforeEach(() => {
        fixture = TestBed.createComponent(FooterComponent);
        component = fixture.componentInstance;
    })

    it('should be created',() => {
        expect(component).toBeDefined();
    })
})