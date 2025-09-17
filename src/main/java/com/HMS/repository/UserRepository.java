/**
 * User Repository
 * 
 * Data access layer for User entities:
 * - Provides CRUD operations for User entities
 * - Handles database interactions
 * - Implements custom queries for user lookup
 * - Manages user persistence
 */
package com.hms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.hms.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
}