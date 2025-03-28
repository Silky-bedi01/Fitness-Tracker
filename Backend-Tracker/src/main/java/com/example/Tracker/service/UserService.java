package com.example.Tracker.service;

import com.example.Tracker.model.Users;
import com.example.Tracker.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    // Signup
    public Users signUp(Users user) {
        if (userRepository.findByEmail(user.getEmail()) != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already in use!");
        }
        return userRepository.save(user);
    }

    // Login
    public Users login(String email, String password) {
        Users user = userRepository.findByEmail(email);
        if (user == null || !user.getPassword().equals(password)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }
        return user;
    }

    // Update User Profile
    public Users updateUserProfile(Users updatedUser) {
        Users existingUser = userRepository.findByEmail(updatedUser.getEmail());
        if (existingUser == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found!");
        }

        // Update only the non-login details
        existingUser.setName(updatedUser.getName());
        existingUser.setGender(updatedUser.getGender());
        existingUser.setAge(updatedUser.getAge());
        existingUser.setBloodGroup(updatedUser.getBloodGroup());
        existingUser.setHeight(updatedUser.getHeight());
        existingUser.setWeight(updatedUser.getWeight());
        existingUser.setFitnessGoals(updatedUser.getFitnessGoals());
        existingUser.setActivityLevel(updatedUser.getActivityLevel());

        // Optional: Profile Picture URL, Contact Info, etc.
        existingUser.setProfilePictureUrl(updatedUser.getProfilePictureUrl());
        existingUser.setContactPhone(updatedUser.getContactPhone());


        return userRepository.save(existingUser);
    }

    // Find User by Email
    public Users findByEmail(String email) {
        Users user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found!");
        }
        return user;
    }

    public Users changePassword(String email, String oldPassword, String newPassword) {
        Users user = userRepository.findByEmail(email);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found!");
        }

        // Verify the old password matches
        if (!user.getPassword().equals(oldPassword)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Old password is incorrect!");
        }

        // Update the password
        user.setPassword(newPassword);
        return userRepository.save(user);
    }

}
