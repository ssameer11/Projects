import { IUser, User } from "src/app/shared/user.model";
import * as fromAuthActions from "./auth.actions";
import * as authStateData from "./auth.reducer";


describe('AuthReducer',() => {
    let reducer = authStateData.authReducer;
    let dummyUserData: IUser = {
        email: 'email',
        _token: 'token',
        _tokenExpirationDate: new Date(),
        userId: 'userId'
    };
    let dummyUser = new User(dummyUserData.email,dummyUserData.userId,dummyUserData._token,dummyUserData._tokenExpirationDate);

    it('should add the user to the state on authenticationSuccess',() => {
        let initialState = {...authStateData.initialState};
        let action = fromAuthActions.AuthenticationSuccess({payload: dummyUserData});
        let result = reducer(initialState,action);
        let expected: authStateData.State = {...initialState,user: dummyUser};
        expect(result).toEqual(expected);
    })

    it('should clear the user from the state on logout and clear the ls',() => {
        let initialState = {...authStateData.initialState,user: dummyUser};
        let action = fromAuthActions.Logout();
        let lsSpy = spyOn(localStorage,'clear');
        let result = reducer(initialState,action);
        let expected: authStateData.State = {...initialState,user: null};
        expect(result).toEqual(expected);
        expect(lsSpy).toHaveBeenCalledTimes(1);
    })

    it('should add the Error Message on AddErrorMessage',() => {
        let initialState = {...authStateData.initialState};
        let errMsg = 'THE ERROR MESSAGE';
        let action = fromAuthActions.AddErrorMessage({payload: {errorMessage: errMsg}});
        let result = reducer(initialState,action);
        let expected: authStateData.State = {...initialState,errorMessage: errMsg};
        expect(result).toEqual(expected);
    })
})