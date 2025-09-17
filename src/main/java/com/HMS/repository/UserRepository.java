package com.hms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
}