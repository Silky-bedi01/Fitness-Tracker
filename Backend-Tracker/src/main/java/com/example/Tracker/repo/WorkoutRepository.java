package com.example.Tracker.repo;

import com.example.Tracker.model.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.time.LocalDateTime;

public interface WorkoutRepository extends JpaRepository<Workout, Long> {
    // Find workouts by user
    List<Workout> findByUserId(Long userId);
    List<Workout> findByUserIdAndTimestampBetween(Long userId, LocalDateTime startDate,LocalDateTime endDate);
    List<Workout> findByUserIdOrderByTimestampDesc(Long userId);

}
