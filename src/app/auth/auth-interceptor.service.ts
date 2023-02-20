import { exhaustMap, map, take } from 'rxjs/operators';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthService } from './auth.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';

@Injectable({ providedIn: 'root' })
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private authService: AuthService, private store: Store<fromApp.AppState>) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return this.store.select('auth').pipe(
            take(1),
            map(authState => authState.user),
            exhaustMap(user => {
                if (!user) {
                    return next.handle(req);
                }
                const modifedReq = req.clone({
                    params: new HttpParams().set('auth', user.token)
                });
                return next.handle(modifedReq)
            })
        )
    }
}