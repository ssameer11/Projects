import { Outfit } from '../outfit.modle';
import * as fromSharedActions from './shared.actions';
import * as sharedStateData from './shared.reducer';

describe('SharedReducer',() => {
    let reducer = sharedStateData.sharedReducer;
    const outfit = new Outfit('https://www.google.com/','THIS IS THE TITLE Customers','THIS IS Description',222,'MALE',20,4,[],'outfitId',{_id: 'userId'});

    it('should set the value of is Loading on toggleIsLoading',() => {
        let initialState = {...sharedStateData.initialState};
        let action = fromSharedActions.ToggleIsLoading({payload: {value: true}});
        let expected: sharedStateData.State = {...initialState,isLoading: true};
        let result = reducer(initialState,action);
        expect(result).toEqual(expected);
    })

    it('should set the value of error Message on addErrorMessage',() => {
        let initialState = {...sharedStateData.initialState};
        let errMsg = 'THE ERROR MESSAGE';
        let action = fromSharedActions.AddErrorMessage({payload: {errorMessage: errMsg}});
        let expected: sharedStateData.State = {...initialState,errorMessage: errMsg};
        let result = reducer(initialState,action);
        expect(result).toEqual(expected);
    })

    it('should clear the value of error message on ClearErrorMessage',() => {
        let initialState = {...sharedStateData.initialState,errorMessage: 'THE ERROR MESSAGE'};
        let action = fromSharedActions.ClearErrorMesssage();
        let expected: sharedStateData.State = {...initialState,errorMessage: null};
        let result = reducer(initialState,action);
        expect(result).toEqual(expected);
    })

    it('should set the selected outfit on setOutfit',() => {
        let initialState = {...sharedStateData.initialState};
        let mockSelectedOutfitData = {outfit: {...outfit}, fromSeller: false};
        let action = fromSharedActions.SetOutfit({payload: {...mockSelectedOutfitData}});
        let expected: sharedStateData.State = {...initialState, selectedOutfitData: {...mockSelectedOutfitData}};
        let result = reducer(initialState,action);
        expect(result).toEqual(expected);
    })
})