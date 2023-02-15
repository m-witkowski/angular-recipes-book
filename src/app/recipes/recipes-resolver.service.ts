import { RecipeService } from './recipe.service';
import { DataStorageService } from './../shared/data-storage.service';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Recipe } from "./recipe.model";
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {
    constructor(private dataStorageService: DataStorageService, private recipeService: RecipeService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
        const recipes = this.recipeService.getRecipies();

        return recipes.length === 0 ?
            this.dataStorageService.fetchRecipes() :
            recipes;

    }
}