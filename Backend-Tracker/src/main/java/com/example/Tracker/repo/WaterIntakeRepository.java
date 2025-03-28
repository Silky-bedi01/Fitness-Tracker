package com.example.Tracker.repo;

import com.example.Tracker.model.Users;
import com.example.Tracker.model.WaterIntake;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface WaterIntakeRepository extends JpaRepository<WaterIntake, Long> {
    // Get water intake records by user object and date range
    List<WaterIntake> findByUserAndTimestampBetween(Users user, LocalDateTime startDate, LocalDateTime endDate);
    List<WaterIntake> findByUserId(Long userId);
}


