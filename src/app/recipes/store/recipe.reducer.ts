import * as  RecipesActions from './recipe.actions';
import { Recipe } from "../recipe.model";

export interface State {
    recipes: Recipe[];
}

const initialState: State = {
    recipes: [],
}

export function RecipeReducer(state = initialState, action: RecipesActions.RecipesActions) {
    switch (action.type) {
        case RecipesActions.SET_RECIPES:
            return {
                ...state,
                recipes: [...action.payload]
            }
        case RecipesActions.ADD_RECIPE:
            return {
                ...state,
                recipes: [...state.recipes, action.payload]
            }
        case RecipesActions.UPDATE_RECIPE:
            const updatedRecipes = [...state.recipes];
            updatedRecipes[action.payload.index] = action.payload.newRecipe;
            return {
                ...state,
                recipes: updatedRecipes
            }
        case RecipesActions.DELETE_RECIPE:
            return {
                ...state,
                recipes: state.recipes.filter((_, id) => id !== action.payload)
            }
        default:
            return state;
    }
}