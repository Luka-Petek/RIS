package com.projekt.fullstack_backend.service;

import com.projekt.fullstack_backend.model.Recipe;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RecipeTest {

    private Recipe recipe;

    @BeforeEach
    void setUp() {
        recipe = new Recipe();
        recipe.setName("Pancakes");
        recipe.setIngredients("Flour, eggs, milk, sugar, butter, pinch of salt.");
        recipe.setInstructions("Mix the batter, heat a pan, and cook until golden.");
    }

    @Test
    void testNameRecipe() {
        assertEquals("Pancakes", recipe.getName());
    }

    @Test
    void testIngredientsRecipe() {
        assertNotNull(recipe.getIngredients());
        assertTrue(recipe.getIngredients().contains("eggs"));
    }

    @Test
    void testRecipeNoIntructions() {
        recipe.setInstructions(null);
        assertNull(recipe.getInstructions());
    }
}
