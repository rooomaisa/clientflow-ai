package com.clientflow.service;

import com.clientflow.dto.AuthResponse;
import com.clientflow.dto.LoginRequest;
import com.clientflow.dto.RegisterRequest;
import com.clientflow.dto.UserResponse;
import com.clientflow.entity.User;
import com.clientflow.exception.ApiException;
import com.clientflow.repository.UserRepository;
import com.clientflow.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final com.clientflow.security.CustomUserDetailsService userDetailsService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            AuthenticationManager authenticationManager,
            com.clientflow.security.CustomUserDetailsService userDetailsService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userDetailsService = userDetailsService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ApiException(409, "Email is already registered");
        }

        User user = new User();
        user.setName(request.name());
        user.setEmail(request.email().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.password()));

        User savedUser = userRepository.save(user);
        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token, toUserResponse(savedUser));
    }

    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.email().toLowerCase(),
                            request.password()
                    )
            );
        } catch (Exception ex) {
            throw new ApiException(401, "Invalid email or password");
        }

        User user = userRepository.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new ApiException(401, "Invalid email or password"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token, toUserResponse(user));
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(user.getId(), user.getName(), user.getEmail(), user.getCreatedAt());
    }
}
