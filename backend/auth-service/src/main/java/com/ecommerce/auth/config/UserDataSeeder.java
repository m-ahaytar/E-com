package com.ecommerce.auth.config;

import com.ecommerce.auth.entity.User;
import com.ecommerce.auth.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class UserDataSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(UserDataSeeder.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDataSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        seedUser("admin@demo.com", "Admin@123456", "ADMIN", "Admin", "Demo");
        seedUser("customer@demo.com", "Customer@123456", "CUSTOMER", "Customer", "Demo");
        seedUser("seller@demo.com", "Seller@123456", "SELLER", "Seller", "Demo");
    }

    private void seedUser(String email, String rawPassword, String role, String firstName, String lastName) {
        if (userRepository.existsByEmail(email)) {
            log.info("User {} already exists, skipping.", email);
            return;
        }
        User user = new User(email, passwordEncoder.encode(rawPassword), role);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        userRepository.save(user);
        log.info("Seeded {} user: {}", role, email);
    }
}
