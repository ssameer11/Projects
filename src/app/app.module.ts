import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AppRoutes } from './app-routes.module';
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component';
import { CustomersModule } from './customers/customers.module';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { SellersModule } from './sellers/sellers.module';
import { SharedRoutesModule } from './shared-routes/shared.module';
import { SharedModule } from './shared/shared.module';
import { appReducer } from './store/app.reducer';
import { AuthEffects } from './auth/store/auth.effects';
import { AuthModule } from './auth/auth.module';
import { CoreModule } from './core.module';
import { SellersEffects } from './sellers/store/sellers.effects';
import { CustomersEffects } from './customers/store/customers.effects';
import { FormsModule } from '@angular/forms';
import { SharedEffects } from './shared/store/shared.effects';
import { environment } from '../environments/environment';
import { ServiceWorkerModule } from '@angular/service-worker';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    // SharedModule,
    SharedModule,
    FormsModule,
    BrowserModule,
    CustomersModule,
    SellersModule,
    AuthModule,
    SharedRoutesModule,
    HttpClientModule,
    RouterModule,
    AppRoutes,
    StoreModule.forRoot(appReducer),
    EffectsModule.forRoot([AuthEffects,SellersEffects,CustomersEffects,SharedEffects]),
    CoreModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
      // Register the ServiceWorker as soon as the app is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
