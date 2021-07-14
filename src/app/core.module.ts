import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AuthInterceptor } from "./auth/auth-interceptor.service";
import { AuthGuard } from "./auth/auth.guard";
import { AuthService } from "./auth/auth.service";
import { OtpGuard } from "./auth/otp/otp.guard";
import { OutfitDetailResolver } from "./shared-routes/outfit-detail/outfit-detail-resolver.service";
import { OutfitListResolver } from "./shared-routes/outfit-list/outfit-list-resolver.service";
import { ResizeWindowService } from './resize-window.service'
import { ShoppingCartResolver } from "./customers/shopping-cart/shopping-cart-resolver.service";
@NgModule(
    {
    providers: [
        AuthService,
        AuthGuard,
        OtpGuard,
        OutfitListResolver,
        OutfitDetailResolver,
        ShoppingCartResolver,
        {provide: HTTP_INTERCEPTORS,
        useClass: AuthInterceptor,
        multi: true},
        ResizeWindowService
    ]
})
export class CoreModule {}