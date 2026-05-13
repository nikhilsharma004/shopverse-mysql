package com.shopverse.config;

import com.shopverse.model.Product;
import com.shopverse.repository.ProductRepository;
import java.math.BigDecimal;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {
    private final ProductRepository productRepository;

    public DataSeeder(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        if (productRepository.count() > 0) {
            return;
        }

        productRepository.save(product("AstraBook Pro 14 Laptop", "Astra", "Electronics", "Intel i7 laptop with 16GB RAM, 1TB SSD, metal body, and all-day battery.", "84999", "109999", 23, 18, 4.6, 1842, "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80", "Free delivery by tomorrow", true, true));
        productRepository.save(product("Nova X5 5G Smartphone", "Nova", "Mobiles", "120Hz AMOLED display, 50MP OIS camera, 5000mAh battery, and fast charging.", "32999", "42999", 23, 41, 4.4, 8924, "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80", "Free delivery in 2 days", true, true));
        productRepository.save(product("PulseBeat Wireless Headphones", "PulseBeat", "Audio", "Active noise cancellation, 40-hour battery, soft ear cushions, and deep bass.", "5999", "11999", 50, 72, 4.5, 5611, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80", "Same day delivery available", true, true));
        productRepository.save(product("UrbanFit Smart Watch", "UrbanFit", "Wearables", "AMOLED smartwatch with Bluetooth calling, health tracking, GPS, and 7-day battery.", "3499", "7999", 56, 96, 4.2, 3210, "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80", "Free delivery by Friday", false, true));
        productRepository.save(product("HomeChef Air Fryer 5L", "HomeChef", "Appliances", "Digital air fryer with rapid heat circulation, preset menus, and easy-clean basket.", "6999", "12999", 46, 25, 4.3, 2109, "https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&w=900&q=80", "Delivery in 3 days", false, false));
        productRepository.save(product("CloudSoft Cotton Bedsheet Set", "CloudSoft", "Home", "Premium cotton king-size bedsheet with two pillow covers and fade-resistant print.", "1299", "2499", 48, 140, 4.1, 1184, "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=900&q=80", "Free delivery by tomorrow", false, true));
        productRepository.save(product("StrideMax Running Shoes", "StrideMax", "Fashion", "Lightweight running shoes with breathable mesh, cushioned sole, and durable grip.", "2199", "4999", 56, 64, 4.0, 782, "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80", "Delivery in 2 days", true, false));
        productRepository.save(product("BrewCraft Coffee Maker", "BrewCraft", "Kitchen", "Compact drip coffee machine with reusable filter, anti-drip design, and warm plate.", "2799", "5499", 49, 33, 4.2, 963, "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=900&q=80", "Free delivery this week", false, true));
    }

    private Product product(String name, String brand, String category, String description, String price, String mrp,
                            int discount, int stock, double rating, int reviews, String imageUrl,
                            String delivery, boolean deal, boolean prime) {
        Product product = new Product();
        product.setName(name);
        product.setBrand(brand);
        product.setCategory(category);
        product.setDescription(description);
        product.setPrice(new BigDecimal(price));
        product.setMrp(new BigDecimal(mrp));
        product.setDiscountPercent(discount);
        product.setStock(stock);
        product.setRating(rating);
        product.setReviewCount(reviews);
        product.setImageUrl(imageUrl);
        product.setDeliveryText(delivery);
        product.setDealOfDay(deal);
        product.setPrimeEligible(prime);
        return product;
    }
}

