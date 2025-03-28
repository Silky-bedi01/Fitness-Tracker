package com.example.Tracker.controller;

import com.example.Tracker.JwtUtil;
import com.example.Tracker.model.Meal;
import com.example.Tracker.service.MealService;
import com.example.Tracker.service.NutritionixService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;

@RestController
@RequestMapping("/api/meals")
@CrossOrigin(origins = "http://localhost:5173")
public class MealController {

    @Autowired
    private MealService mealService;

    @Autowired
    private NutritionixService nutritionixService;

    @Autowired
    private JwtUtil jwtUtil;

    // Log a meal
    @PostMapping("/log")
    public ResponseEntity<Meal> logMeal(
            @RequestBody Meal meal,
            @RequestHeader("Authorization") String token) {

        String jwt = token.replace("Bearer ", "");
        if (!jwtUtil.validateToken(jwt)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Long userId = jwtUtil.extractUserId(jwt);

        Meal savedMeal = mealService.logMeal(meal);
        return ResponseEntity.ok(savedMeal);
    }

    // Get meal history for logged-in user
    @GetMapping("/history")
    public ResponseEntity<?> getMealHistory(
            @RequestHeader("Authorization") String token,
            @RequestParam String startDate,
            @RequestParam String endDate) {

        String jwt = token.replace("Bearer ", "");
        if (!jwtUtil.validateToken(jwt)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
        }
        Long userId = jwtUtil.extractUserId(jwt);

        try {
            LocalDateTime start = LocalDateTime.parse(startDate.trim());
            LocalDateTime end = LocalDateTime.parse(endDate.trim());

            if (end.isBefore(start)) {
                return ResponseEntity.badRequest().body("End date must be after start date.");
            }

            List<Meal> history = mealService.getMealHistory(userId,start,end);
            return ResponseEntity.ok(history);
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body("Invalid date format. Use YYYY-MM-DDTHH:MM:SS.");
        }
    }
    @GetMapping("/all_history")
    public ResponseEntity<?> getAllMealHistory(
            @RequestHeader("Authorization") String token) {

        String jwt = token.replace("Bearer ", "");
        if (!jwtUtil.validateToken(jwt)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
        }
        Long userId = jwtUtil.extractUserId(jwt);

        List<Meal> history = mealService.getMealHistory(userId);
        return ResponseEntity.ok(history);

    }

    // Get food suggestions from Nutritionix
    @GetMapping("/autocomplete")
    public ResponseEntity<List<String>> getFoodSuggestions(@RequestParam String query) {
        List<String> suggestions = nutritionixService.getFoodSuggestions(query);
        return ResponseEntity.ok(suggestions);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMeal(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token) {

        String jwt = token.replace("Bearer ", "");
        if (!jwtUtil.validateToken(jwt)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }

        mealService.deleteMeal(id);

        return ResponseEntity.ok("Meal deleted successfully!");
    }
}
