package com.example.Tracker.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
@Entity
public class WaterIntake {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Users user; // The user who logged the water intake

    private double waterAmount;
    private LocalDateTime timestamp; // When the water was logged

    public WaterIntake() {
        this.timestamp = LocalDateTime.now(); // Automatically set timestamp on creation
    }

    // Getters and Setters
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

    public double getWaterAmount() {
        return waterAmount;
    }

    public void setWaterAmount(double waterAmount) {
        this.waterAmount = waterAmount;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
