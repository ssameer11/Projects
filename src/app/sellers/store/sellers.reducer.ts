import { createReducer, on } from "@ngrx/store";
import { Outfit } from "src/app/shared/outfit.modle";
import * as fromSellersActions from './sellers.actions';

export interface State {
    outfits: Outfit[],
    lastPage: number,
    errorMessage: string
}

export const initialState: State = {
    outfits: [],
    lastPage: 1,
    errorMessage: null
}

export const sellersReducer = createReducer(initialState,
                                        on(fromSellersActions.SetOutfits,(state,action) => {
                                            return {
                                                ...state,
                                                outfits: [...action.outfits],
                                                lastPage: action.lastPage
                                            }
                                        }))