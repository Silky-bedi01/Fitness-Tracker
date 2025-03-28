package com.example.Tracker.dto;

import com.example.Tracker.model.Meal;
import com.example.Tracker.model.WaterIntake;
import com.example.Tracker.model.Workout;

import java.util.List;

public class ProgressResponse {

    private List<Workout> workoutHistory;
    private List<Meal> mealHistory;
    private List<WaterIntake> waterIntakeHistory;

    public ProgressResponse() {}

    public ProgressResponse(List<Workout> workoutHistory, List<Meal> mealHistory, List<WaterIntake> waterIntakeHistory) {
        this.workoutHistory = workoutHistory;
        this.mealHistory = mealHistory;
        this.waterIntakeHistory = waterIntakeHistory;
    }

    // Getters and Setters
    public List<Workout> getWorkoutHistory() {
        return workoutHistory;
    }

    public void setWorkoutHistory(List<Workout> workoutHistory) {
        this.workoutHistory = workoutHistory;
    }

    public List<Meal> getMealHistory() {
        return mealHistory;
    }

    public void setMealHistory(List<Meal> mealHistory) {
        this.mealHistory = mealHistory;
    }

    public List<WaterIntake> getWaterIntakeHistory() {
        return waterIntakeHistory;
    }

    public void setWaterIntakeHistory(List<WaterIntake> waterIntakeHistory) {
        this.waterIntakeHistory = waterIntakeHistory;
    }

    @Override
    public String toString() {
        return "ProgressResponse{" +
                "workoutHistory=" + workoutHistory +
                ", mealHistory=" + mealHistory +
                ", waterIntakeHistory=" + waterIntakeHistory +
                '}';
    }
}
