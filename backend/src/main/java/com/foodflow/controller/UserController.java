package com.foodflow.controller;

import com.foodflow.dto.ProfileDto;
import com.foodflow.entity.User;
import com.foodflow.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/profile")
    public ResponseEntity<ProfileDto> getProfile() {
        User user = getCurrentUser();
        ProfileDto dto = new ProfileDto();
        dto.setName(user.getName());
        dto.setEmail(user.getEmail());
        dto.setAddress(user.getAddress());
        dto.setPhone(user.getPhone());
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/profile")
    public ResponseEntity<ProfileDto> updateProfile(@RequestBody ProfileDto dto) {
        User user = getCurrentUser();
        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getAddress() != null) user.getAddress();
        user.setAddress(dto.getAddress());
        user.setPhone(dto.getPhone());
        
        userRepository.save(user);
        
        return ResponseEntity.ok(dto);
    }
}
