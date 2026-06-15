package com.clientflow.dto;

public record AuthResponse(
        String token,
        UserResponse user
) {
}
