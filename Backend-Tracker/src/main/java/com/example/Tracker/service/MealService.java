package com.example.Tracker.service;

import com.example.Tracker.model.Meal;
import com.example.Tracker.repo.MealRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class MealService {

    @Autowired
    private MealRepository mealRepository;

    @Autowired
    private NutritionixService nutritionixService;

    // Log a meal with Nutritionix data
    public Meal logMeal(Meal meal) {
        Map<String, Object> nutritionData = nutritionixService.getMealNutrition(meal.getMealName());

        List<Map<String, Object>> foods = (List<Map<String, Object>>) nutritionData.get("foods");
        if (!foods.isEmpty()) {
            Map<String, Object> foodDetails = foods.get(0);
            meal.setCalories(foodDetails.get("nf_calories") != null ? ((Number) foodDetails.get("nf_calories")).doubleValue() : 0.0);
            meal.setProtein(foodDetails.get("nf_protein") != null ? ((Number) foodDetails.get("nf_protein")).doubleValue() : 0.0);
            meal.setCarbs(foodDetails.get("nf_total_carbohydrate") != null ? ((Number) foodDetails.get("nf_total_carbohydrate")).doubleValue() : 0.0);
            meal.setFats(foodDetails.get("nf_total_fat") != null ? ((Number) foodDetails.get("nf_total_fat")).doubleValue() : 0.0);

        }

        return mealRepository.save(meal);
    }

    public List<Meal> getMealHistory(Long userId) {
        return mealRepository.findByUserId(userId);
    }

    public List<Meal> getMealHistory(Long userId, LocalDateTime start, LocalDateTime end) {
        return mealRepository.findByUserIdAndTimestampBetween(userId,start,end);
    }

    public void deleteMeal(Long id) {
        mealRepository.deleteById(id);
    }
}
