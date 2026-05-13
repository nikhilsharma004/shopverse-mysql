package com.shopverse.dto;

import java.math.BigDecimal;

public record ProductResponse(
        Long id,
        String name,
        String brand,
        String category,
        String description,
        BigDecimal price,
        BigDecimal mrp,
        int discountPercent,
        int stock,
        double rating,
        int reviewCount,
        String imageUrl,
        String deliveryText,
        boolean dealOfDay,
        boolean primeEligible
) {
}

