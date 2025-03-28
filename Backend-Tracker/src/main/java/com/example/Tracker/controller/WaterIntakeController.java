package com.example.Tracker.controller;

import com.example.Tracker.model.Users;
import com.example.Tracker.model.WaterIntake;
import com.example.Tracker.service.WaterIntakeService;
import com.example.Tracker.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;

@RestController
@RequestMapping("/api/water")
@CrossOrigin(origins="http://localhost:5173")
public class WaterIntakeController {

    @Autowired
    private WaterIntakeService waterIntakeService;

    @Autowired
    private JwtUtil jwtUtil;

    // Log water intake
    @PostMapping("/log")
    public ResponseEntity<?> logWaterIntake(
            @RequestHeader("Authorization") String token,
            @RequestBody WaterIntake waterIntake) {
        String jwt = token.replace("Bearer ", "");
        if (!jwtUtil.validateToken(jwt)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
        }
        Long userId = jwtUtil.extractUserId(jwt);

        if (waterIntake.getWaterAmount() <= 0) {
            return ResponseEntity.badRequest().body("Water amount must be greater than 0.");
        }

        WaterIntake savedWaterIntake = waterIntakeService.logWaterIntake(waterIntake);
        return ResponseEntity.ok(savedWaterIntake);
    }

    @GetMapping("/history")
    public ResponseEntity<?> getWaterIntakeHistory(
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

            List<WaterIntake> history = waterIntakeService.getWaterIntakeHistory(userId, start, end);
            return ResponseEntity.ok(history);
        } catch (DateTimeParseException e) {
            return ResponseEntity.badRequest().body("Invalid date format. Use YYYY-MM-DDTHH:MM:SS.");
        }
    }
    @GetMapping("/all_history")
    public ResponseEntity<?> getAllWaterIntakeHistory(
            @RequestHeader("Authorization") String token) {

        String jwt = token.replace("Bearer ", "");
        if (!jwtUtil.validateToken(jwt)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
        }
        Long userId = jwtUtil.extractUserId(jwt);

        List<WaterIntake> history = waterIntakeService.getWaterIntakeHistory(userId);
        return ResponseEntity.ok(history);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteWaterIntake(
            @PathVariable Long id,
            @RequestHeader("Authorization") String token) {

        String jwt = token.replace("Bearer ", "");
        if (!jwtUtil.validateToken(jwt)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }

        waterIntakeService.deleteWaterIntake(id);

        return ResponseEntity.ok("Water intake deleted successfully!");
    }
}
