package com.example.Tracker.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class NutritionixService {

    @Value("${nutritionix.api.url}")
    private String apiUrl;

    @Value("${nutritionix.api.key}")
    private String apiKey;

    @Value("${nutritionix.app.id}")
    private String appId;

    private final RestTemplate restTemplate = new RestTemplate();

    public Map<String, Object> getMealNutrition(String mealDescription) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-app-id", appId);
        headers.set("x-app-key", apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, String> body = new HashMap<>();
        body.put("query", mealDescription);

        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
        ResponseEntity<Map> response = restTemplate.exchange(apiUrl, HttpMethod.POST, request, Map.class);

        return response.getBody(); // Returns JSON response with calories and macros
    }


    public List<String> getFoodSuggestions(String query) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-app-id", appId);
        headers.set("x-app-key", apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        String autocompleteUrl = "https://trackapi.nutritionix.com/v2/search/instant?query=" + query;
        HttpEntity<String> request = new HttpEntity<>(headers);

        ResponseEntity<Map> response = restTemplate.exchange(autocompleteUrl, HttpMethod.GET, request, Map.class);

        List<Map<String, Object>> commonFoods = (List<Map<String, Object>>) response.getBody().get("common");
        return commonFoods.stream().map(food -> (String) food.get("food_name")).toList();
    }

}

