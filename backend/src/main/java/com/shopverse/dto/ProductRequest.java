package com.shopverse.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public record ProductRequest(
        @NotBlank String name,
        @NotBlank String brand,
        @NotBlank String category,
        @NotBlank String description,
        @DecimalMin("1.0") BigDecimal price,
        @DecimalMin("1.0") BigDecimal mrp,
        @Min(0) @Max(90) int discountPercent,
        @Min(0) int stock,
        @Min(0) @Max(5) double rating,
        @Min(0) int reviewCount,
        String imageUrl,
        String deliveryText,
        boolean dealOfDay,
        boolean primeEligible
) {
}

