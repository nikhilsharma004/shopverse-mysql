package com.shopverse.service;

import com.shopverse.dto.CartItemRequest;
import com.shopverse.dto.CheckoutRequest;
import com.shopverse.dto.OrderItemResponse;
import com.shopverse.dto.OrderResponse;
import com.shopverse.model.CustomerOrder;
import com.shopverse.model.OrderItem;
import com.shopverse.model.Product;
import com.shopverse.repository.OrderRepository;
import com.shopverse.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public OrderResponse checkout(CheckoutRequest request) {
        CustomerOrder order = new CustomerOrder();
        order.setCustomerName(request.customerName());
        order.setEmail(request.email());
        order.setPhone(request.phone());
        order.setAddress(request.address());
        order.setUserId(request.userId());
        order.setPaymentMethod(request.paymentMethod());
        order.setOrderStatus("PLACED");
        order.setCreatedAt(LocalDateTime.now());

        BigDecimal total = BigDecimal.ZERO;
        for (CartItemRequest cartItem : request.items()) {
            Product product = productRepository.findById(cartItem.productId())
                    .orElseThrow(() -> new EntityNotFoundException("Product not found: " + cartItem.productId()));

            if (product.getStock() < cartItem.quantity()) {
                throw new IllegalArgumentException("Not enough stock for " + product.getName());
            }

            BigDecimal lineTotal = product.getPrice().multiply(BigDecimal.valueOf(cartItem.quantity()));
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProductId(product.getId());
            item.setProductName(product.getName());
            item.setUnitPrice(product.getPrice());
            item.setQuantity(cartItem.quantity());
            item.setLineTotal(lineTotal);
            order.getItems().add(item);

            product.setStock(product.getStock() - cartItem.quantity());
            total = total.add(lineTotal);
        }

        order.setTotalAmount(total);
        return toResponse(orderRepository.save(order));
    }

    private OrderResponse toResponse(CustomerOrder order) {
        return new OrderResponse(
                order.getId(),
                order.getCustomerName(),
                order.getEmail(),
                order.getPhone(),
                order.getAddress(),
                order.getUserId(),
                order.getPaymentMethod(),
                order.getOrderStatus(),
                order.getTotalAmount(),
                order.getCreatedAt(),
                order.getItems().stream()
                        .map(item -> new OrderItemResponse(
                                item.getProductId(),
                                item.getProductName(),
                                item.getUnitPrice(),
                                item.getQuantity(),
                                item.getLineTotal()
                        ))
                        .toList()
        );
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> findHistory(Long userId, String email) {
        List<CustomerOrder> orders = userId != null
                ? orderRepository.findByUserIdOrderByCreatedAtDesc(userId)
                : orderRepository.findByEmailIgnoreCaseOrderByCreatedAtDesc(email);
        return orders.stream().map(this::toResponse).toList();
    }
}
