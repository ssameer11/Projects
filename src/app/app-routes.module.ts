import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const appRoutes: Routes = [
    {path: '',pathMatch: 'full', redirectTo: '/customers'},
    {path: 'customers', loadChildren: () => import('./customers/customers.module').then(m => m.CustomersModule)},
    {path: 'sellers', loadChildren: () => import('./sellers/sellers.module').then(m => m.SellersModule)},
    {path: 'shared', loadChildren: () => import('./shared-routes/shared.module').then(m => m.SharedRoutesModule)},
    {path: 'auth',loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)}
]

@NgModule({
    imports: [RouterModule.forRoot(appRoutes,{preloadingStrategy: PreloadAllModules})],
    exports: [RouterModule]
})
export class AppRoutes {}