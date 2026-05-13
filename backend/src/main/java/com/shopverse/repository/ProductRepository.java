package com.shopverse.repository;

import com.shopverse.model.Product;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByNameContainingIgnoreCaseOrBrandContainingIgnoreCaseOrCategoryContainingIgnoreCase(
            String name,
            String brand,
            String category
    );

    List<Product> findByCategoryIgnoreCase(String category);

    List<Product> findByDealOfDayTrue();
}

