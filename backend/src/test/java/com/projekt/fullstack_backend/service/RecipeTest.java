package com.projekt.fullstack_backend.service;

import com.projekt.fullstack_backend.model.Recipe;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;


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

    @Test
    @DisplayName("Instructions morajo biti nastavljene in ne smejo biti prazne (pozitiven scenarij)")
    void testInstructionsNotBlank() {
        assertNotNull(recipe.getInstructions());
        assertFalse(recipe.getInstructions().isBlank());
    }

    @Test
    @DisplayName("Če nastavimo name na prazen niz, mora getter vrniti prazen niz (negativen/vnosni scenarij)")
    void testBlankName() {
        recipe.setName("");
        assertEquals("", recipe.getName());
        assertTrue(recipe.getName().isEmpty());
    }
}
