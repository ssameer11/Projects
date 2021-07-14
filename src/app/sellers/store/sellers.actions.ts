import { createAction, props } from "@ngrx/store";
import { Outfit } from "src/app/shared/outfit.modle";

export const FetchOutfits = createAction('[Sellers] Fetch Outfits',props<{payload: {[key: string]: any}}>());

export const SetOutfits = createAction('[Sellers] Set Outfits',
                            props<{outfits: Outfit[],lastPage: number}>()
                            )
export const CreateOutfit = createAction('[Sellers] Create Outfit',props<{payload: {outfitData: FormData}}>())

export const UpdateOutfit = createAction('[Sellers] Update Outfit',props<{payload: {outfitData: FormData, outfitId: string}}>())

export const DeleteOutfit = createAction('[Sellers] Delete Outfit',props<{payload: {id: string}}>());