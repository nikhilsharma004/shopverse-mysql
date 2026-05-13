package com.shopverse.dto;

public record UserResponse(
        Long id,
        String fullName,
        String email,
        String phone,
        String address
) {
}

