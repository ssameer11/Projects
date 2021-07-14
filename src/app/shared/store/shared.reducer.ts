import { createReducer, on } from "@ngrx/store"
import { Outfit } from "../outfit.modle";
import * as fromSharedActions from './shared.actions';

export interface State {
    isLoading: boolean;
    errorMessage: string;
    selectedOutfitData: {
        outfit: Outfit,
        fromSeller: boolean
    }
}

export const initialState: State = {
    isLoading: false,
    errorMessage: null,
    selectedOutfitData: {
        outfit: null,
        fromSeller: null
    }
}

export const sharedReducer = createReducer(initialState,
                                on(fromSharedActions.ToggleIsLoading,(state,action) => {
                                    return {...state,isLoading: action.payload.value}
                                }),
                                on(fromSharedActions.AddErrorMessage,(state,action) => {
                                    return {...state,errorMessage: action.payload.errorMessage}
                                }),
                                on(fromSharedActions.ClearErrorMesssage,(state,action) => {
                                    return {...state,errorMessage: null}
                                }),
                                on(fromSharedActions.SetOutfit,(state,action) => {
                                    return {
                                        ...state,
                                        selectedOutfitData: {
                                            outfit: action.payload.outfit,
                                            fromSeller: action.payload.fromSeller
                                        }
                                    }
                                }))