package com.shopverse.service;

import com.shopverse.dto.LoginRequest;
import com.shopverse.dto.RegisterRequest;
import com.shopverse.dto.UserResponse;
import com.shopverse.model.AppUser;
import com.shopverse.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository, JwtService jwtService) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
    }

    @Transactional
    public UserResponse register(RegisterRequest request) {
        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            throw new IllegalArgumentException("Email already registered");
        }

        AppUser user = new AppUser();
        user.setFullName(request.fullName());
        user.setEmail(request.email());
        user.setPhone(request.phone());
        user.setAddress(request.address());
        user.setRole(request.role() == null || request.role().isBlank() ? "CUSTOMER" : request.role());
        user.setPassword(passwordEncoder.encode(request.password()));
        return toResponse(userRepository.save(user));
    }

    @Transactional(readOnly = true)
    public UserResponse login(LoginRequest request) {
        AppUser user = userRepository.findByEmailIgnoreCase(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password"));

        boolean encodedPassword = user.getPassword() != null && user.getPassword().startsWith("$2");
        boolean passwordMatches = encodedPassword
                ? passwordEncoder.matches(request.password(), user.getPassword())
                : user.getPassword().equals(request.password());

        if (!passwordMatches) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        if (!encodedPassword) {
            user.setPassword(passwordEncoder.encode(request.password()));
        }

        return toResponse(user);
    }

    private UserResponse toResponse(AppUser user) {
        return new UserResponse(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getAddress(),
                user.getRole() == null ? "CUSTOMER" : user.getRole(),
                jwtService.createToken(user)
        );
    }
}
