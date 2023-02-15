import { Ingredient } from './../shared/ingredient.modal';
import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShoppingListService {
    ingredientsChanged = new Subject<Ingredient[]>();
    startedEditing = new Subject<number>();

    private ingredients: Ingredient[] = [
    ];

    getIngredients() {
        return [...this.ingredients];
    }

    getIngredient(index: number) {
        return this.ingredients[index];
    }

    addIngredient(newIngredient: Ingredient) {
        this.ingredients.push(newIngredient);
        this.ingredientsChanged.next([...this.ingredients]);
    }

    addIngredients(ingredients: Ingredient[]) {
        this.ingredients.push(...ingredients);
        this.ingredientsChanged.next([...this.ingredients]);
    }

    updateIngredient(index: number, newIngredient: Ingredient) {
        this.ingredients[index] = newIngredient;
        this.ingredientsChanged.next([...this.ingredients]);
    }

    deleteIngredient(index: number) {
        this.ingredients.splice(index,1);
        this.ingredientsChanged.next([...this.ingredients]);
    }
}