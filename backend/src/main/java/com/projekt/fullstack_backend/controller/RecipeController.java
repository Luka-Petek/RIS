package com.projekt.fullstack_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.projekt.fullstack_backend.exception.RecipeNotFoundException;
import com.projekt.fullstack_backend.model.Recipe;
import com.projekt.fullstack_backend.repository.RecipeRepository;

@RestController
@CrossOrigin("http://localhost:3001")
public class RecipeController {
    
    @Autowired
    private RecipeRepository recipeRepository;

    @PostMapping("/recipe")
    public Recipe newRecipe(@RequestBody Recipe newRecipe) {
        return recipeRepository.save(newRecipe);
    }

    @GetMapping("/recipes")
    public List<Recipe> getAllRecipes() {
        return recipeRepository.findAll();  
    }

    @GetMapping("/recipe/{id}")
    public Recipe getRecipeById(@PathVariable Long id) {
        return recipeRepository.findById(id)
                    .orElseThrow(() -> new RecipeNotFoundException(id));
    }

    @PutMapping("/recipe/{id}")
    public Recipe updateRecipe(@RequestBody Recipe newRecipe, @PathVariable Long id) {
        return recipeRepository.findById(id)
                    .map(recipe -> {
                        recipe.setName(newRecipe.getName());
                        recipe.setIngredients(newRecipe.getIngredients());
                        recipe.setInstructions(newRecipe.getInstructions());
                        return recipeRepository.save(recipe);
                    }).orElseThrow(() -> new RecipeNotFoundException(id));
    }

    @DeleteMapping("/recipe/{id}")
    public String deleteRecipe(@PathVariable Long id) {
        if (!recipeRepository.existsById(id)) {
            throw new RecipeNotFoundException(id);
        }
        recipeRepository.deleteById(id);
        return "Recept z ID " + id + " je bil odstranjen";
    }
}
