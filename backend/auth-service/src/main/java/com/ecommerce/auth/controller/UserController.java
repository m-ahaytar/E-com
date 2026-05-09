package com.ecommerce.auth.controller;

import com.ecommerce.auth.entity.User;
import com.ecommerce.auth.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userRepository.findAll().stream()
                .map(UserDTO::fromEntity)
                .collect(Collectors.toList());
        return ResponseEntity.ok(users);
    }

    public static class UserDTO {
        private Long id;
        private String email;
        private String role;
        private String firstName;
        private String lastName;
        private LocalDateTime createdAt;

        public static UserDTO fromEntity(User user) {
            UserDTO dto = new UserDTO();
            dto.id = user.getId();
            dto.email = user.getEmail();
            dto.role = user.getRole();
            dto.firstName = user.getFirstName();
            dto.lastName = user.getLastName();
            dto.createdAt = user.getCreatedAt();
            return dto;
        }

        public Long getId() { return id; }
        public String getEmail() { return email; }
        public String getRole() { return role; }
        public String getFirstName() { return firstName; }
        public String getLastName() { return lastName; }
        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    }
}
