import { switchMap, map } from 'rxjs';
import { Recipe } from './../recipe.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as ReceipesActions from '../store/recipe.actions';
import * as ShoppingListActions from './../../shopping-list/store/shopping-list.actions';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipeDetails: Recipe;
  id: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    this.route.params.pipe(
      map(params => {
        return +params['id'];
      }),
      switchMap(id => {
        this.id = id;
        return this.store.select('recipes');
      }),
      map((recipesState) => {
        return recipesState.recipes.find((_, index) => {
          return index === this.id;
        })
      }))
      .subscribe((recipe) => {
        this.recipeDetails = recipe;
      })
  }

  onAddToShoppingList() {
    this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipeDetails.ingredients));
  }

  onDeleteRecipe() {
    this.store.dispatch(new ReceipesActions.DeleteRecipe(this.id));
    this.router.navigate(['/recipes']);
  }
}
