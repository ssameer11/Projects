import { createAction, props } from "@ngrx/store";
import { LoginData, SignupData } from "src/app/shared/signupData.model";
import { IUser, User } from "src/app/shared/user.model";

export const AuthenticationSuccess = createAction('[Auth] Authentication Success',props<{payload: IUser}>());

export const GetOtp = createAction('[Auth] Get OTP',props<{payload: SignupData}>());

export const Signup = createAction('[Auth] Sign up',props<{payload: {otpToken: string,enteredOtp: string}}>());

export const Login = createAction('[Auth] Login',props<{payload: LoginData}>());

export const Logout = createAction('[Auth] Logout');

export const AddErrorMessage = createAction('[Auth] ErrorMessage',props<{payload: {errorMessage: string}}>())