import { Component } from "@angular/core";

@Component({
    selector: "app-shared",
    host: {
        class: 'router_outlet_style'
    },
    templateUrl: './shared.component.html',
    styleUrls: ['./shared.component.scss']
})
export class SharedComponent {
    constructor() {}
}