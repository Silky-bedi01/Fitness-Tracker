package com.example.Tracker.controller;

import com.example.Tracker.JwtUtil;
import com.example.Tracker.model.Meal;
import com.example.Tracker.model.Workout;
import com.example.Tracker.model.WorkoutType;
import com.example.Tracker.service.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/workout")
@CrossOrigin(origins="http://localhost:5173")
public class WorkoutController {
    @Autowired
    WorkoutService workoutService;
    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping("/types")
    public ResponseEntity<List<String>> getWorkoutTypes() {
        List<String> workoutTypes = Arrays.stream(WorkoutType.values())
                .map(Enum::name)
                .toList();
        return ResponseEntity.ok(workoutTypes);
    }

    // Log a workout
    @PostMapping("/log")
    public ResponseEntity<?> logWorkout(@RequestBody Workout workout,
                                        @RequestHeader("Authorization") String token) {
        String jwt = token.replace("Bearer ", "");
        if (!jwtUtil.validateToken(jwt)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }
        Workout savedWorkout = workoutService.saveWorkout(workout);
        return ResponseEntity.ok(savedWorkout);
    }

    @GetMapping("/history")
    public ResponseEntity<?> getMealHistory(
            @RequestHeader("Authorization") String token,
            @RequestParam String startDate,
            @RequestParam String endDate) {

        String jwt = token.replace("Bearer ", "");
        if (!jwtUtil.validateToken(jwt)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }
        Long userId = jwtUtil.extractUserId(jwt);

        try {
            LocalDateTime start = LocalDateTime.parse(startDate.trim());
            LocalDateTime end = LocalDateTime.parse(endDate.trim());

            if (end.isBefore(start)) {
                return ResponseEntity.badRequest().body("End date must be after start date.");
            }

            List<Workout> history = workoutService.getWorkoutHistory(userId,start,end);
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
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }
        Long userId = jwtUtil.extractUserId(jwt);

        List<Workout> history = workoutService.getWorkoutHistory(userId);
        return ResponseEntity.ok(history);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteWorkout(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token) {

        String jwt = token.replace("Bearer ", "");
        if (!jwtUtil.validateToken(jwt)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }
        workoutService.deleteWorkout(id);

        return ResponseEntity.ok("Workout deleted successfully!");
    }

    @GetMapping("/streak")
    public ResponseEntity<?> getStreak(
            @RequestHeader("Authorization") String token
    ){
        String jwt = token.replace("Bearer ", "");
        if (!jwtUtil.validateToken(jwt)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }
        Long userId = jwtUtil.extractUserId(jwt);
//        System.out.println("userId"+userId);
        int streak=workoutService.getStreak(userId);
        return ResponseEntity.ok(streak);
    }

}
