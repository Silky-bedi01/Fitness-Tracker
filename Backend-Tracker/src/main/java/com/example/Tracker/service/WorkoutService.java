package com.example.Tracker.service;

import com.example.Tracker.model.Workout;
import com.example.Tracker.model.WorkoutType;
import com.example.Tracker.repo.WorkoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class WorkoutService {
    @Autowired
    WorkoutRepository workoutRepository;

    private static final int AVG_STEPS_PER_MINUTE = 120; // Approximate step rate for cardio workouts

    // Save a workout
    public Workout saveWorkout(Workout workout) {
        if(workout.getCaloriesBurned()==0){
            double calories = calculateCalories(workout.getExerciseType(), workout.getDuration(), workout.getIntensity());
            workout.setCaloriesBurned(calories);
        }

        if(workout.getStepsCount()==0){
            int steps = estimateSteps(workout.getExerciseType(), workout.getDuration());
            workout.setStepsCount(steps);
        }

        return workoutRepository.save(workout);
    }

    // Get user's workout history
    public List<Workout> getWorkoutHistory(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        return workoutRepository.findByUserIdAndTimestampBetween(userId, startDate, endDate);
    }
    public List<Workout> getWorkoutHistory(Long userId) {
        return workoutRepository.findByUserId(userId);
    }

    // Calorie burn calculation
    private double calculateCalories(WorkoutType type, int duration, String intensity) {
        double baseRate = switch (type) {
            case RUNNING -> 10;
            case WALKING -> 4;
            case CYCLING -> 8;
            case SWIMMING -> 12;
            case YOGA -> 3;
            case WEIGHT_TRAINING -> 6;
            case HIIT -> 12;
            case PILATES -> 5;
            case DANCE -> 7;
            case JUMP_ROPE -> 11;
            case ROWING -> 9;
            case MARTIAL_ARTS -> 10;
            case HIKING -> 6;
            case STRENGTH_TRAINING -> 7;
            case CROSSFIT -> 13;
            case CARDIO -> 8;
        };

        double multiplier = switch (intensity.toUpperCase()) {
            case "MEDIUM" -> 1.2;
            case "HIGH" -> 1.5;
            default -> 1.0;
        };

        return baseRate * duration * multiplier;
    }

    // Estimate step count
    private int estimateSteps(WorkoutType type, int duration) {
        return switch (type) {
            case RUNNING, WALKING, HIKING -> duration * AVG_STEPS_PER_MINUTE;
            default -> 0;
        };
    }

    public void deleteWorkout(Long id) {
        if (!workoutRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Workout not found");
        }
        workoutRepository.deleteById(id);
    }

    public int getStreak(Long userId) {
        List<Workout> workouts= workoutRepository.findByUserIdOrderByTimestampDesc(userId);
        if(workouts.isEmpty()){
            return 0;
        }
        int streak=0;
        Set<LocalDate> workoutDates = workouts.stream()
                .map(workout -> workout.getTimestamp().toLocalDate())
                .collect(Collectors.toSet());
        LocalDate today = LocalDate.now();

        while (workoutDates.contains(today.minusDays(streak))) {
            streak++;
        }
        System.out.println(streak);
        return streak;

    }
}
