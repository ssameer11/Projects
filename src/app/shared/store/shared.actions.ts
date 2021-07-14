import { createAction, props } from "@ngrx/store";
import { Outfit } from "../outfit.modle";

export const ToggleIsLoading = createAction('[Shared] Toggle IsLoading',props<{payload: {value: boolean}}>());

export const AddErrorMessage = createAction('[Shared] Add Error Message',props<{payload: {errorMessage: string}}>());

export const ClearErrorMesssage = createAction('[Shared] Clear Error Message');

export const FetchOutfit = createAction('[Shared] Fetch Outfit',props<{payload: {outfitId: string,fromSeller: boolean}}>());

export const SetOutfit = createAction('[Shared] Set Outfit',props<{payload: {outfit: Outfit,fromSeller: boolean}}>())