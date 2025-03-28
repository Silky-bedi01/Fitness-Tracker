package com.example.Tracker.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Workout {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Users user; // The user who performed the workout

    @Enumerated(EnumType.STRING)
    private WorkoutType exerciseType; // Predefined workout types

    private int duration; // In minutes
    private String intensity; // Low, Medium, High

    // Strength Training (Optional Fields)
    private Integer sets;
    private Integer reps;
    private Double weightLifted;

    // System-Calculated Fields
    private double caloriesBurned;
    private int stepsCount;
    private String notes;

    private LocalDateTime timestamp; // When the workout was performed

    public Workout() {
        this.timestamp = LocalDateTime.now();
    }

    // Getters and Setters

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Users getUser() {
        return user;
    }

    public void setUser(Users user) {
        this.user = user;
    }

    public WorkoutType getExerciseType() {
        return exerciseType;
    }

    public void setExerciseType(WorkoutType exerciseType) {
        this.exerciseType = exerciseType;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public String getIntensity() {
        return intensity;
    }

    public void setIntensity(String intensity) {
        this.intensity = intensity;
    }

    public Integer getSets() {
        return sets;
    }

    public void setSets(Integer sets) {
        this.sets = sets;
    }

    public Integer getReps() {
        return reps;
    }

    public void setReps(Integer reps) {
        this.reps = reps;
    }

    public Double getWeightLifted() {
        return weightLifted;
    }

    public void setWeightLifted(Double weightLifted) {
        this.weightLifted = weightLifted;
    }

    public double getCaloriesBurned() {
        return caloriesBurned;
    }

    public void setCaloriesBurned(double caloriesBurned) {
        this.caloriesBurned = caloriesBurned;
    }

    public int getStepsCount() {
        return stepsCount;
    }

    public void setStepsCount(int stepsCount) {
        this.stepsCount = stepsCount;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
