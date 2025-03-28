package com.example.Tracker.model;

public class AuthResponse {
    private String token;
    private Long id;
    private String message;

    public AuthResponse(String token, String message) {
        this.token = token;
        this.message = message;
    }

    public Long getId() {
        return id;
    }

    // Getters
    public String getToken() { return token; }
    public String getMessage() { return message; }
}

