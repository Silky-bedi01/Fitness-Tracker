package com.example.Tracker.controller;

import com.example.Tracker.JwtUtil;
import com.example.Tracker.dto.ChangePasswordRequest;
import com.example.Tracker.model.AuthResponse;
import com.example.Tracker.model.LoginRequest;
import com.example.Tracker.model.Users;
import com.example.Tracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // Signup endpoint
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody Users user) {
        Users createdUser = userService.signUp(user);
        String token = jwtUtil.generateToken(createdUser);

        return ResponseEntity.ok(new AuthResponse(token, "Registration successful!"));
    }

    // Login endpoint
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
        Users user = userService.login(loginRequest.getEmail(), loginRequest.getPassword());
        String token = jwtUtil.generateToken(user);

        return ResponseEntity.ok(new AuthResponse(token, "Login successful!"));
    }

    // Update profile endpoint
    @PutMapping("/update-profile")
    public ResponseEntity<String> updateProfile(@RequestBody Users updatedUser,
                                                @RequestHeader("Authorization") String token) {
        String jwt = token.replace("Bearer ", "");
        if (!jwtUtil.validateToken(jwt)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }

        String email = jwtUtil.extractEmail(jwt);
        try {
            updatedUser.setEmail(email);
            userService.updateUserProfile(updatedUser);
            return ResponseEntity.ok("Profile updated successfully!");
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getReason());
        }
    }

    // Get logged-in user profile
    @GetMapping("/user/me")
    public ResponseEntity<Users> getUserProfile(@RequestHeader("Authorization") String token) {
        String jwt = token.replace("Bearer ", "");
        if (!jwtUtil.validateToken(jwt)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        String email = jwtUtil.extractEmail(jwt);
        Users user = userService.findByEmail(email);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordRequest changePasswordRequest,
                                                 @RequestHeader("Authorization") String token) {
        String jwt = token.replace("Bearer ", "");
        if (!jwtUtil.validateToken(jwt)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token");
        }
        String email = jwtUtil.extractEmail(jwt);
        try {
            userService.changePassword(email, changePasswordRequest.getOldPassword(), changePasswordRequest.getNewPassword());
            return ResponseEntity.ok("Password updated successfully!");
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getReason());
        }
    }

}
