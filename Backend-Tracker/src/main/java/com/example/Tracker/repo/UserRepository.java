package com.example.Tracker.repo;

import com.example.Tracker.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<Users, Long> {

    Users findByEmail(String email);
}

