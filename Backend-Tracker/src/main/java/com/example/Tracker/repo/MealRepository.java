package com.example.Tracker.repo;

import com.example.Tracker.model.Meal;
import com.example.Tracker.model.Workout;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface MealRepository extends JpaRepository<Meal, Long> {
    List<Meal> findByUserId(Long userId);
    List<Meal> findByUserIdAndTimestampBetween(Long userId, LocalDateTime startDate, LocalDateTime endDate);
}
