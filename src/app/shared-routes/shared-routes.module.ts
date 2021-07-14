import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../auth/auth.guard";
import { OutfitListResolver } from "./outfit-list/outfit-list-resolver.service";
import { OutfitDetailResolver } from "./outfit-detail/outfit-detail-resolver.service";
import { OutfitDetailComponent } from "./outfit-detail/outfit-detail.component";
import { OutfitListComponent } from "./outfit-list/outfit-list.component";
import { SharedComponent } from "./shared.component";
import { ShoppingCartResolver } from '../customers/shopping-cart/shopping-cart-resolver.service';
// ,runGuardsAndResolvers: 'always'
// this.router.routeReuseStrategy.shouldReuseRoute = () => false;
const sharedRoutes: Routes = [
    {path:'', component: SharedComponent,children: [
        {path: '',pathMatch: 'full', redirectTo: 'outfit-list'},
        // {path: 'error',component: ErrorComponent},
        {path: 'outfit-list',canActivate: [AuthGuard],runGuardsAndResolvers: 'always',resolve: [OutfitListResolver],component: OutfitListComponent},
        // {path: 'outfit-detail',runGuardsAndResolvers: 'always',resolve: {outfitData: OutfitDetailResolver},component: OutfitDetailComponent},
        {path: 'outfit-detail/:id',resolve: {outfitData: OutfitDetailResolver},component: OutfitDetailComponent},
    ]}
]

@NgModule({
    imports: [RouterModule.forChild(sharedRoutes)],
    exports: [RouterModule]
})
export class SharedRoutes {}