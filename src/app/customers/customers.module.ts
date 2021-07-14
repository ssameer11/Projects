import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SharedModule } from "../shared/shared.module";
import { CustomersRoutes } from "./customers-routes.module";
import { CustomersComponent } from "./customers.component";
import { ShoppingCartComponent } from "./shopping-cart/shopping-cart.component";
import { CustomersService } from './customers.service';
import { AddToCartComponent } from './shopping-cart/add-to-cart/add-to-cart.component';
import { FormsModule } from "@angular/forms";
@NgModule({
    declarations: [
        CustomersComponent,
        ShoppingCartComponent,
        AddToCartComponent
        
    ],
    providers: [
        CustomersService
    ],
    imports: [
        CustomersRoutes,
        RouterModule,
        SharedModule,
        FormsModule
    ]
})
export class CustomersModule {

}