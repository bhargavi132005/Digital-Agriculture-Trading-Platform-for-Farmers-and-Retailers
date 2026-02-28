package com.datp.user_service.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.datp.user_service.entities.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
}
