package com.example.Tracker.controller;

import com.example.Tracker.JwtUtil;
import com.example.Tracker.dto.ProgressResponse;
import com.example.Tracker.model.Meal;
import com.example.Tracker.model.WaterIntake;
import com.example.Tracker.model.Workout;
import com.example.Tracker.service.MealService;
import com.example.Tracker.service.WaterIntakeService;
import com.example.Tracker.service.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;

@RestController
@RequestMapping("/api/progress")
@CrossOrigin(origins = "http://localhost:5173")
public class ProgressController {

    @Autowired
    private WaterIntakeService waterIntakeService;

    @Autowired
    private WorkoutService workoutService;

    @Autowired
    private MealService mealService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/data")
    public ResponseEntity<ProgressResponse> getProgress(
            @RequestHeader("Authorization") String token,
            @RequestParam String startDate,
            @RequestParam String endDate) {

        String jwt = token.replace("Bearer ", "").trim();
        if (!jwtUtil.validateToken(jwt)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid or expired token.");
        }
        Long userId = jwtUtil.extractUserId(jwt);

        LocalDateTime start, end;
        try {
            start = LocalDateTime.parse(startDate.trim());
            end = LocalDateTime.parse(endDate.trim());
        } catch (DateTimeParseException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid date format. Please use 'yyyy-MM-ddTHH:mm:ss'.");
        }

        List<Workout> workoutHistory = workoutService.getWorkoutHistory(userId, start, end);
        List<Meal> meals = mealService.getMealHistory(userId, start, end);
        List<WaterIntake> waterIntakeHistory = waterIntakeService.getWaterIntakeHistory(userId, start, end);

        ProgressResponse response = new ProgressResponse();
        response.setWorkoutHistory(workoutHistory);
        response.setMealHistory(meals);
        response.setWaterIntakeHistory(waterIntakeHistory);

        return ResponseEntity.ok(response);
    }
}
