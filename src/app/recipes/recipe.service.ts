import { ShoppingListService } from './../shopping-list/shopping-list.service';
import { Ingredient } from './../shared/ingredient.modal';
import { Injectable } from "@angular/core";
import { Recipe } from "./recipe.model";
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RecipeService {
    recipesChanged = new Subject<Recipe[]>();

    // private recipes: Recipe[] = [
    //     new Recipe('Vegan Bahn Mi',
    //         'A great sub when you don\'t feel like cooking!',
    //         'https://cdn.pickuplimes.com/cache/4f/6f/4f6f70bad48b5a0830425b86b39816ee.jpg',
    //         [new Ingredient('Tofu', 1), new Ingredient('buns', 2)]),
    //     new Recipe('Vegan Chocolate Cake',
    //         'A good chocolate cake can be enjoyed on just about any special occasion: birthdays, anniversaries, graduations, potluck parties. It\'s a classic! This chocolate cake is the new and improved version of our original recipe: it\'s delicious, moist, and fluffy, and no one will even guess it\'s completely plant-based!',
    //         'https://cdn.pickuplimes.com/cache/e8/d2/e8d2767ce7ba58f8bf0ffb62b17415c8.jpg',
    //         [new Ingredient('Flour', 500), new Ingredient('Soy Milk', 1)]),
    // ];

    private recipes: Recipe [] = [];

    constructor(private shoppingListService: ShoppingListService) { }

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.recipesChanged.next([...this.recipes]);
    }

    getRecipies() {
        return [...this.recipes];
    }

    addIngredientsToShoppingList(ingredients: Ingredient[]) {
        this.shoppingListService.addIngredients(ingredients);
    }

    getRecipeById(id: number) {
        return this.recipes[id];
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.recipesChanged.next([...this.recipes]);
    }

    updateRecipe(index: number, newRecipe: Recipe) {
        this.recipes[index] = newRecipe;
        this.recipesChanged.next([...this.recipes]);
    }

    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.recipesChanged.next([...this.recipes]);
    }
}