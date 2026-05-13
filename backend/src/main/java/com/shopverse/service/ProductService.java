package com.shopverse.service;

import com.shopverse.dto.ProductResponse;
import com.shopverse.model.Product;
import com.shopverse.repository.ProductRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> findProducts(String query, String category) {
        List<Product> products;
        if (query != null && !query.isBlank()) {
            products = productRepository.findByNameContainingIgnoreCaseOrBrandContainingIgnoreCaseOrCategoryContainingIgnoreCase(
                    query,
                    query,
                    query
            );
        } else if (category != null && !category.isBlank()) {
            products = productRepository.findByCategoryIgnoreCase(category);
        } else {
            products = productRepository.findAll();
        }
        return products.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> deals() {
        return productRepository.findByDealOfDayTrue().stream().map(this::toResponse).toList();
    }

    private ProductResponse toResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getBrand(),
                product.getCategory(),
                product.getDescription(),
                product.getPrice(),
                product.getMrp(),
                product.getDiscountPercent(),
                product.getStock(),
                product.getRating(),
                product.getReviewCount(),
                product.getImageUrl(),
                product.getDeliveryText(),
                product.isDealOfDay(),
                product.isPrimeEligible()
        );
    }
}

