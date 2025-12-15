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
        recipe.setName("");
        recipe.setIngredients("Flour, eggs, milk, sugar, butter, pinch of salt.");
        recipe.setInstructions("Mix the batter, heat a pan, and cook until golden on both sides.");
    }

    @Test
    void testNameRecipe() {
        assertEquals("Pancakes", recipe.getName());
    }

    @Test
    void testIngredientsRecipe() {
        assertNotNull(recipe.getIngredients());
        assertTrue(recipe.getIngredients().contains("eggs"));
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

    @Test
    @DisplayName("Ingredients morajo biti nastavljeni in ne smejo biti prazni")
    void testIngredientsNotNull() {
        assertNotNull(recipe.getIngredients());
        assertFalse(recipe.getIngredients().isBlank());
    }

   @Test
   @DisplayName("Recipe je veljaven če so name in ingredients nastavljeni, instructions pa je lahko prazen")
   void testRecipeValidity() {
    recipe.setInstructions(""); 
    assertNotNull(recipe.getName());
    assertFalse(recipe.getName().isBlank());
    assertNotNull(recipe.getIngredients());
    assertFalse(recipe.getIngredients().isBlank());
    assertNotNull(recipe.getInstructions());
   
    }

    @Test
    @DisplayName("Nastavitev negativnega ID-ja za preverjanje Long polja")
    void testSetNegativeId() {
        Long invalidId = -5L;

        recipe.setId(invalidId);

        assertEquals(invalidId, recipe.getId());
        assertTrue(recipe.getId() < 0, "ID bi mogu bit pozitiven");
    }

    @Test
    @DisplayName("Preverjanje, če so navodila dejansko NULL")
    void testInstructionsSetToNull() {
        recipe.setInstructions(null);
        assertNull(recipe.getInstructions());
    }

}
