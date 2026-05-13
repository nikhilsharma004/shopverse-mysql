package com.shopverse.controller;

import com.shopverse.dto.ProductResponse;
import com.shopverse.service.ProductService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<ProductResponse> products(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String category
    ) {
        return productService.findProducts(query, category);
    }

    @GetMapping("/deals")
    public List<ProductResponse> deals() {
        return productService.deals();
    }
}

