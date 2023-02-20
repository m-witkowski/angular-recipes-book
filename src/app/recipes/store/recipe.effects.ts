import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from "rxjs";
import { Recipe } from '../recipe.model';
import * as RecipesActions from '../store/recipe.actions';
import * as fromApp from '../../store/app.reducer';

@Injectable()
export class RecipesEffects {
    fetchRecipes$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(RecipesActions.FETCH_RECIPES),
            switchMap(() => {
                return this.http.
                    get<Recipe[]>
                    (
                        'https://ng-course-recipe-book-6545a-default-rtdb.europe-west1.firebasedatabase.app/recipes.json'
                    )
            }),
            map(recipes => {
                return recipes.
                    map(recipe => ({ ...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] }));
            }),
            map((recipes: Recipe[]) => {
                return new RecipesActions.SetRecipes(recipes)
            })
        )
    });

    storeRecipes$ = createEffect(() => {
        return this.actions$.pipe(
            ofType(RecipesActions.STORE_RECIPES),
            withLatestFrom(this.store.select('recipes')),
            switchMap(([_, recipesState]) => {
                return this.http.put(
                    'https://ng-course-recipe-book-6545a-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
                    recipesState.recipes)
            })
        )
    }, { dispatch: false });

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<fromApp.AppState>) { }
}