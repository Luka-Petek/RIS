package com.projekt.fullstack_backend.exception;

public class RecipeNotFoundException extends RuntimeException {
    public RecipeNotFoundException(Long id) {
        super("Recept z ID " + id + " ni bil najden");
    }
}
