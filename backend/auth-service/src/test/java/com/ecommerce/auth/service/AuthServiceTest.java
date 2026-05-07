package com.ecommerce.auth.service;

import com.ecommerce.auth.dto.AuthResponse;
import com.ecommerce.auth.dto.LoginRequest;
import com.ecommerce.auth.dto.RegisterRequest;
import com.ecommerce.auth.entity.User;
import com.ecommerce.auth.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
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
@DisplayName("AuthService Tests")
@Tag("unit")
@Tag("fast")
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

    @Nested
    @DisplayName("User Registration Tests")
    class RegistrationTests {
        @Test
        @DisplayName("register with valid request creates user and returns token")
        void register_validRequest_createsUserAndReturnsToken() {
            // Arrange
            when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
            when(passwordEncoder.encode("password123")).thenReturn("encoded-password");
            when(userRepository.save(any(User.class))).thenReturn(testUser);

            // Act
            AuthResponse response = authService.register(registerRequest);

            // Assert
            assertAll(
                () -> assertNotNull(response, "Response should not be null"),
                () -> assertEquals("test@example.com", response.getEmail(), "Email should match"),
                () -> assertEquals("CUSTOMER", response.getRole(), "Default role should be CUSTOMER"),
                () -> assertNotNull(response.getToken(), "Token should be generated"),
                () -> assertTrue(response.getToken().startsWith("eyJ"), "Token should be JWT format"),
                () -> verify(userRepository).save(any(User.class))
            );
        }

        @Test
        @DisplayName("register with duplicate email throws exception")
        void register_duplicateEmail_throws() {
            // Arrange
            when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

            // Act & Assert
            ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> authService.register(registerRequest),
                "Should throw ResponseStatusException for duplicate email"
            );
            assertTrue(exception.getReason().contains("Email already exists"), 
                "Exception message should mention duplicate email");
            verify(userRepository, never()).save(any(User.class));
        }

        @Test
        @DisplayName("register with custom role sets provided role")
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
            assertEquals("ADMIN", response.getRole(), "Custom role should be set");
        }

        @ParameterizedTest
        @ValueSource(strings = { "CUSTOMER", "ADMIN", "MODERATOR" })
        @DisplayName("register with various user roles")
        void register_multipleRoles(String role) {
            // Arrange
            registerRequest.setRole(role);
            when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
            when(passwordEncoder.encode("password123")).thenReturn("encoded-password");

            User testUserWithRole = new User("test@example.com", "encoded-password", role);
            testUserWithRole.setId(1L);
            when(userRepository.save(any(User.class))).thenReturn(testUserWithRole);

            // Act
            AuthResponse response = authService.register(registerRequest);

            // Assert
            assertEquals(role, response.getRole(), "Should register with role " + role);
            assertNotNull(response.getToken(), "Token should be generated");
        }
    }

    @Nested
    @DisplayName("User Login Tests")
    class LoginTests {
        @Test
        @DisplayName("login with valid credentials returns token with user data")
        void login_validCredentials_returnsTokenWithUserData() {
            // Arrange
            when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
            when(passwordEncoder.matches("password123", "encoded-password")).thenReturn(true);

            // Act
            AuthResponse response = authService.login(loginRequest);

            // Assert
            assertAll(
                () -> assertNotNull(response, "Response should not be null"),
                () -> assertEquals("test@example.com", response.getEmail(), "Email should match"),
                () -> assertEquals("CUSTOMER", response.getRole(), "Role should match"),
                () -> assertEquals("John", response.getFirstName(), "First name should match"),
                () -> assertEquals("Doe", response.getLastName(), "Last name should match"),
                () -> assertNotNull(response.getToken(), "Token should be generated"),
                () -> assertTrue(response.getToken().startsWith("eyJ"), "Token should be JWT format")
            );
        }

        @Test
        @DisplayName("login with non-existent user throws exception")
        void login_userNotFound_throws() {
            // Arrange
            when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.empty());

            // Act & Assert
            ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> authService.login(loginRequest),
                "Should throw ResponseStatusException for non-existent user"
            );
            assertTrue(exception.getReason().contains("Invalid credentials"), 
                "Exception message should mention invalid credentials");
        }

        @Test
        @DisplayName("login with wrong password throws exception")
        void login_wrongPassword_throws() {
            // Arrange
            when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
            when(passwordEncoder.matches("password123", "encoded-password")).thenReturn(false);

            // Act & Assert
            ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> authService.login(loginRequest),
                "Should throw ResponseStatusException for wrong password"
            );
            assertTrue(exception.getReason().contains("Invalid credentials"), 
                "Exception message should mention invalid credentials");
        }

        @ParameterizedTest
        @ValueSource(strings = { "test1@example.com", "test2@example.com", "admin@example.com" })
        @DisplayName("login with various email addresses")
        void login_multipleEmails(String email) {
            // Arrange
            User testUserWithEmail = new User(email, "encoded-password", "CUSTOMER");
            testUserWithEmail.setId(1L);
            loginRequest.setEmail(email);
            when(userRepository.findByEmail(email)).thenReturn(Optional.of(testUserWithEmail));
            when(passwordEncoder.matches("password123", "encoded-password")).thenReturn(true);

            // Act
            AuthResponse response = authService.login(loginRequest);

            // Assert
            assertEquals(email, response.getEmail(), "Should login with email " + email);
            assertNotNull(response.getToken(), "Token should be generated");
        }
    }
}
