import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Actions, ofType, createEffect } from "@ngrx/effects";
import { catchError, map, of, switchMap, tap } from "rxjs";
import { environment } from 'src/environments/environment';

import * as AuthActions from './auth.actions';
import { Router } from '@angular/router';
import { User } from '../user.model';
import { AuthService } from '../auth.service';

export interface AuthResponseData {
    kind: string,
    idToken: string,
    email: string,
    refreshToken: string,
    expiresIn: string,
    localId: string,
    registered?: boolean
}

const handleAuthentication = (expiresIn: number, email: string, userId: string, token: string) => {
    const expirationDate = new Date(new Date().getTime() + +expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    localStorage.setItem('userData', JSON.stringify(user));
    return new AuthActions.AuthenticateSuccess({
        email,
        userId,
        token,
        expirationDate,
        redirect: true
    });
};

const handleError = (errorRes) => {
    let errorMessage = 'An unknown error occured!';
    if (!errorRes.error || !errorRes.error.error) {
        return of(new AuthActions.AuthenticateFail(errorMessage));
    }
    switch (errorRes.error.error.message) {
        case 'EMAIL_EXISTS':
            errorMessage = 'This email already exists!';
            break;
        case 'EMAIL_NOT_FOUND':
            errorMessage = 'This email does not exist!';
            break;
        case 'INVALID_PASSWORD':
            errorMessage = 'Wrong credentials!';
            break;
    }
    return of(new AuthActions.AuthenticateFail(errorMessage));
};

@Injectable()
export class AuthEffects {
    authSignup$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActions.SIGNUP_START),
            switchMap((signupAction: AuthActions.SignupStart) => {
                return this.httpClient.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
                    {
                        email: signupAction.payload.email,
                        password: signupAction.payload.password,
                        returnSecureToken: true
                    }).pipe(
                        tap(resData => {
                            this.authService.setLogoutTimer(+resData.expiresIn * 1000)
                        }),
                        map(resData => {
                            return handleAuthentication(
                                +resData.expiresIn,
                                resData.email,
                                resData.localId,
                                resData.idToken)
                        }),
                        catchError(errorRes => {
                            return handleError(errorRes)
                        }),
                    )
            })

        )
    })

    authLogin$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActions.LOGIN_START),
            switchMap((authData: AuthActions.LoginStart) => {
                return this.httpClient.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
                    {
                        email: authData.payload.email,
                        password: authData.payload.password,
                        returnSecureToken: true
                    }).pipe(
                        tap(resData => {
                            this.authService.setLogoutTimer(+resData.expiresIn * 1000)
                        }),
                        map(resData => {
                            return handleAuthentication(
                                +resData.expiresIn,
                                resData.email,
                                resData.localId,
                                resData.idToken)
                        }),
                        catchError(errorRes => {
                            return handleError(errorRes)
                        }),
                    )
            })

        );
    })

    authRedirect$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActions.AUTHENTICATE_SUCCESS),
            tap((authSuccessAction: AuthActions.AuthenticateSuccess) => {
                if (authSuccessAction.payload.redirect) {
                    this.router.navigate(['/'])
                }
            })
        )
    }, { dispatch: false })

    authLogout$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActions.LOGOUT),
            tap(() => {
                this.authService.clearLogoutTimer();
                localStorage.removeItem('userData');
                this.router.navigate(['/auth']);
            }))
    }, { dispatch: false })

    autoLogin$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(AuthActions.AUTO_LOGIN),
            map(() => {
                const userData: {
                    email: string,
                    id: string,
                    _token: string,
                    _tokenExpirationDate: string
                } = JSON.parse(localStorage.getItem('userData'));
                if (!userData) {
                    return { type: 'DUMMY' };
                }
                const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
                if (loadedUser.token) {
                    const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                    this.authService.setLogoutTimer(expirationDuration);
                    return new AuthActions.AuthenticateSuccess({
                        email: loadedUser.email,
                        userId: loadedUser.id,
                        token: loadedUser.token,
                        expirationDate: new Date(userData._tokenExpirationDate),
                        redirect: false
                    });
                }
                return { type: 'DUMMY' };
            })
        )
    })

    constructor(private actions$: Actions, private httpClient: HttpClient, private router: Router, private authService: AuthService) { }
}