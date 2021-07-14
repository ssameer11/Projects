import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { OutfitEditComponent } from "./outfit-edit/outfit-edit.component";
import { OutfitListComponent } from "../shared-routes/outfit-list/outfit-list.component";
import { SellersRoutes } from "./sellers-routes.module";
import { SellersComponent } from "./sellers.component";
import { SellersService } from "./sellers.service";
import { PaymentComponent } from './payment/payment.component';

@NgModule({
    declarations: [
        SellersComponent,
        OutfitEditComponent,
        PaymentComponent
    ],
    providers: [SellersService],
    imports: [
        SellersRoutes,
        SharedModule,
        RouterModule,
        ReactiveFormsModule,
    ]
})
export class SellersModule {
    constructor() {}
}