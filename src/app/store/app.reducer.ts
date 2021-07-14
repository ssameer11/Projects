import { ActionReducerMap } from "@ngrx/store";
import * as fromCustomers from '../customers/store/customers.reducer';
import * as fromSellers from '../sellers/store/sellers.reducer';
import * as fromAuth from '../auth/store/auth.reducer';
import * as fromShared from "../shared/store/shared.reducer";


export interface AppState {
    customers: fromCustomers.State,
    sellers: fromSellers.State,
    auth: fromAuth.State,
    shared: fromShared.State
}


export const appReducer: ActionReducerMap<AppState> = {
    customers: fromCustomers.customersReducer,
    sellers: fromSellers.sellersReducer,
    auth: fromAuth.authReducer,
    shared: fromShared.sharedReducer
}