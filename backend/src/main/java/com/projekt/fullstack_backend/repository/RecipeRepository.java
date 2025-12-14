package com.projekt.fullstack_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.projekt.fullstack_backend.model.Recipe;

public interface RecipeRepository extends JpaRepository<Recipe, Long> {
}
