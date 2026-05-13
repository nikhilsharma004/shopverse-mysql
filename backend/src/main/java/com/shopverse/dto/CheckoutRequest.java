package com.shopverse.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public record CheckoutRequest(
        @NotBlank String customerName,
        @Email String email,
        @NotBlank String phone,
        @NotBlank String address,
        @NotEmpty List<@Valid CartItemRequest> items
) {
}

