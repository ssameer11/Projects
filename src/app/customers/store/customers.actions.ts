// import { Action } from "@ngrx/store";
// import { Outfit } from "src/app/shared/outfit";

import { createAction, props } from "@ngrx/store";
import { ICartItem, Outfit } from "src/app/shared/outfit.modle";

// export const FETCH_OUTFITS = '[customers] Fetch Outfits';
// export const SET_OUTFITS = '[customers] Set Outfits';

// export class FetchOutfits implements Action {
//     readonly type = FETCH_OUTFITS;
// }

// export class SetOutfits implements Action {
//     readonly type = SET_OUTFITS;
//     constructor(public payload: Outfit[]){}
// }

// export type CustomersActions = FetchOutfits | SetOutfits;

export const FetchOutfits = createAction('[Customers] Fetch Outfits',props<{payload: {[key: string]: any}}>());

export const SetOutfits = createAction('[Customers] Set Outfits',
                            props<{outfits: Outfit[],lastPage: number}>()
                            )

export const AddToCart = createAction('[Customer] Add To Cart',props<{payload: {outfitId: string,count: number}}>())

export const FetchCart = createAction('[Customers] FetchCart');

export const SetCart = createAction('[Customers] Set Cart',props<{payload: {cart: ICartItem[]}}>());

export const UpdateCart = createAction('[Customers] Update Cart',props<{payload: {itemsToBeUpdated: {[key: string]: {updatedCount: number}}}}>());

export const RemoveFromCart = createAction('[Customers] Remove From Cart',props<{payload: {id: {[key: string]: boolean}}}>());