package com.example.Tracker.service;

import com.example.Tracker.model.Users;
import com.example.Tracker.model.WaterIntake;
import com.example.Tracker.repo.UserRepository;
import com.example.Tracker.repo.WaterIntakeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class WaterIntakeService {

    @Autowired
    private WaterIntakeRepository waterIntakeRepository;
    @Autowired
    private UserRepository userRepository;

    // Log water intake
    public WaterIntake logWaterIntake(WaterIntake waterIntake) {
        return waterIntakeRepository.save(waterIntake);
    }

    // Get water intake history for a user
//    public List<WaterIntake> getWaterIntakeHistory(Users user, LocalDateTime startDate, LocalDateTime endDate) {
//        return waterIntakeRepository.findByUserAndTimestampBetween(user, startDate, endDate);
//    }
    public List<WaterIntake> getWaterIntakeHistory(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Users not found"));
        return waterIntakeRepository.findByUserAndTimestampBetween(user, startDate, endDate);
    }
    public List<WaterIntake> getWaterIntakeHistory(Long userId){
        return waterIntakeRepository.findByUserId(userId);
    }


    public void deleteWaterIntake(Long id) {
        waterIntakeRepository.deleteById(id);
    }
}
