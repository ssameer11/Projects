import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from './auth/auth.service';
import * as fromSharedActions from './shared/store/shared.actions';
import { AppState } from './store/app.reducer';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  isLoading: boolean = false;
  errorMessage: string = null;
  constructor(private authService: AuthService,private store: Store<AppState>) {}

  ngOnInit() {
    this.authService.autoLogin();
    this.store.select('shared').subscribe(sharedState => {
      this.isLoading = sharedState.isLoading;
      this.errorMessage = sharedState.errorMessage;
    })
  }

  onClick() {
    if(this.errorMessage) this.store.dispatch(fromSharedActions.ClearErrorMesssage())
  }
}
