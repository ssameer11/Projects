import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../auth/auth.guard";
import { CustomersComponent } from "./customers.component";
import { AddToCartComponent } from "./shopping-cart/add-to-cart/add-to-cart.component";
import { ShoppingCartResolver } from "./shopping-cart/shopping-cart-resolver.service";
import { ShoppingCartComponent } from "./shopping-cart/shopping-cart.component";

const customersRoutes: Routes = [
    {path: '',component: CustomersComponent,children: [
        {path: '',pathMatch: 'full',redirectTo: '//shared/outfit-list?fromSeller=false'},
        {path: 'add-to-cart/:id',canActivate: [AuthGuard],component: AddToCartComponent},
        {path: 'shopping-cart',canActivate: [AuthGuard],component: ShoppingCartComponent,resolve: [ShoppingCartResolver]}
    ]}
]

@NgModule({
    imports: [RouterModule.forChild(customersRoutes)],
    exports: [RouterModule]
})
export class CustomersRoutes {}