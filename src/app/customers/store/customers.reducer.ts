import { createReducer, on } from "@ngrx/store";
import { ICartItem, Outfit } from "src/app/shared/outfit.modle";
import * as fromCustomerActions from './customers.actions';

export interface State {
    outfits: Outfit[],
    lastPage: number,
    errorMessage: string,
    cart: ICartItem[],
    isLoading: boolean
}

const initialState: State = {
    outfits: [],
    lastPage: 1,
    cart: null,
    errorMessage: null,
    isLoading: false
}

// export function sellersReducer(state = initialState,action1: fromCustomerActions.fromCustomerActions) {
//     switch(action1.type) {
//         case fromCustomerActions.SET_OUTFITS:
//             const newState: State = {
//                 ...state,
//                 outfits: [...action1.payload]
//             }
//             return newState;
//         default:
//             return {...state}
//     }
// }

export const customersReducer = createReducer(initialState,
                                        on(fromCustomerActions.SetOutfits,(state,action) => {
                                            return {
                                                ...state,
                                                outfits: [...action.outfits],
                                                lastPage: action.lastPage
                                            }
                                        }),
                                        on(fromCustomerActions.SetCart,(state,action) => {
                                            return {
                                                ...state,
                                                cart: action.payload.cart
                                            }
                                        }))