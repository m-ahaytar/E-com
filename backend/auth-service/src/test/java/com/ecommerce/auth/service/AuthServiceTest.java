package com.ecommerce.auth.service;

import com.ecommerce.auth.dto.AuthResponse;
import com.ecommerce.auth.dto.LoginRequest;
import com.ecommerce.auth.dto.RegisterRequest;
import com.ecommerce.auth.entity.User;
import com.ecommerce.auth.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private AuthService authService;

    private User testUser;
    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;

    @BeforeEach
    void setUp() {
        // Initialize AuthService with JWT configuration
        authService = new AuthService(
            userRepository,
            passwordEncoder,
            "test-secret-key-that-is-long-enough-for-hmac-sha256",
            86400000L
        );

        testUser = new User("test@example.com", "encoded-password", "CUSTOMER");
        testUser.setId(1L);
        testUser.setFirstName("John");
        testUser.setLastName("Doe");

        registerRequest = new RegisterRequest();
        registerRequest.setEmail("test@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setFirstName("John");
        registerRequest.setLastName("Doe");

        loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password123");
    }

    @Test
    void register_validRequest_createsUserAndReturnsToken() {
        // Arrange
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded-password");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        AuthResponse response = authService.register(registerRequest);

        // Assert
        assertNotNull(response);
        assertEquals("test@example.com", response.getEmail());
        assertEquals("CUSTOMER", response.getRole());
        assertNotNull(response.getToken());
        assertTrue(response.getToken().startsWith("eyJ"));
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_duplicateEmail_throws() {
        // Arrange
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        // Act & Assert
        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class,
            () -> authService.register(registerRequest)
        );
        assertEquals("Email already exists", exception.getReason());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void register_withCustomRole_setsProvidedRole() {
        // Arrange
        registerRequest.setRole("ADMIN");
        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded-password");

        User adminUser = new User("test@example.com", "encoded-password", "ADMIN");
        adminUser.setId(1L);
        when(userRepository.save(any(User.class))).thenReturn(adminUser);

        // Act
        AuthResponse response = authService.register(registerRequest);

        // Assert
        assertEquals("ADMIN", response.getRole());
    }

    @Test
    void login_validCredentials_returnsTokenWithUserData() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", "encoded-password")).thenReturn(true);

        // Act
        AuthResponse response = authService.login(loginRequest);

        // Assert
        assertNotNull(response);
        assertEquals("test@example.com", response.getEmail());
        assertEquals("CUSTOMER", response.getRole());
        assertEquals("John", response.getFirstName());
        assertEquals("Doe", response.getLastName());
        assertNotNull(response.getToken());
        assertTrue(response.getToken().startsWith("eyJ"));
    }

    @Test
    void login_userNotFound_throws() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class,
            () -> authService.login(loginRequest)
        );
        assertEquals("Invalid credentials", exception.getReason());
    }

    @Test
    void login_wrongPassword_throws() {
        // Arrange
        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("password123", "encoded-password")).thenReturn(false);

        // Act & Assert
        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class,
            () -> authService.login(loginRequest)
        );
        assertEquals("Invalid credentials", exception.getReason());
    }
}
