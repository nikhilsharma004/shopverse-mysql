package com.shopverse.service;

import com.shopverse.dto.ProductRequest;
import com.shopverse.dto.ProductResponse;
import com.shopverse.model.Product;
import com.shopverse.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
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

    @Transactional
    public ProductResponse create(ProductRequest request) {
        Product product = new Product();
        apply(product, request);
        return toResponse(productRepository.save(product));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found: " + id));
        apply(product, request);
        return toResponse(product);
    }

    @Transactional
    public void delete(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found: " + id));
        productRepository.delete(product);
    }

    private void apply(Product product, ProductRequest request) {
        product.setName(request.name());
        product.setBrand(request.brand());
        product.setCategory(request.category());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setMrp(request.mrp());
        product.setDiscountPercent(request.discountPercent());
        product.setStock(request.stock());
        product.setRating(request.rating());
        product.setReviewCount(request.reviewCount());
        product.setImageUrl(request.imageUrl());
        product.setDeliveryText(request.deliveryText());
        product.setDealOfDay(request.dealOfDay());
        product.setPrimeEligible(request.primeEligible());
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
