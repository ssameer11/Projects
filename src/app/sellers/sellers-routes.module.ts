import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../auth/auth.guard";
import { OutfitDetailResolver } from "../shared-routes/outfit-detail/outfit-detail-resolver.service";
import { OutfitListResolver } from "../shared-routes/outfit-list/outfit-list-resolver.service";
import { OutfitEditComponent } from "./outfit-edit/outfit-edit.component";
import { PaymentComponent } from "./payment/payment.component";
// import { OutfitListComponent } from "../shared-routes/outfit-list/outfit-list.component";
import { SellersComponent } from "./sellers.component";
// canActivate: [AuthGuard],

const sellersRoutes: Routes = [
    {path: '',component: SellersComponent,canActivate: [AuthGuard],children: [
        {path: '',pathMatch: 'full',redirectTo: 'outfit-list'},
        {path: 'new',resolve: {outfitData: OutfitDetailResolver},component: OutfitEditComponent},
        {path: ':id/edit',component: OutfitEditComponent,resolve: {outfitData: OutfitDetailResolver}},
        {path: 'payment/:id',canActivate: [AuthGuard],component: PaymentComponent}
    ]}
]

@NgModule({
    imports: [RouterModule.forChild(sellersRoutes)],
    exports: [RouterModule]
})
export class SellersRoutes {}