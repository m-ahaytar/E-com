package com.ecommerce.order.facade;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.order.dto.OrderDTO;
import com.ecommerce.order.dto.OrderItemDTO;
import com.ecommerce.order.entity.Order;
import com.ecommerce.order.entity.OrderItem;
import com.ecommerce.order.repository.OrderRepository;

/**
 * Facade Pattern: OrderProcessingFacade
 * This facade simplifies the complex process of creating an order by
 * coordinating
 * multiple operations across different services and repositories.
 * 
 * Instead of the client calling multiple services directly, they call this
 * facade
 * which handles all the complex orchestration internally.
 * 
 * Benefits:
 * - Simplified client code
 * - Centralized business logic
 * - Easy to maintain and modify order processing flow
 */
@Component
public class OrderProcessingFacade {

    private final OrderRepository orderRepository;

    public OrderProcessingFacade(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    /**
     * Process a complete order creation with order number generation
     * This method coordinates:
     * 1. Generate unique order number
     * 2. Create order entity
     * 3. Add order items
     * 4. Set order status to PENDING
     * 5. Calculate and set total amount
     * 6. Save order to database
     * 
     * @param userId The user placing the order
     * @param items  List of order items
     * @return Created OrderDTO with all details
     */
    @Transactional
    public OrderDTO createOrderWithDetails(Long userId, List<OrderItemDTO> items) {
        if (userId == null || items == null || items.isEmpty()) {
            throw new IllegalArgumentException("User ID and items cannot be null or empty");
        }

        // Step 1: Generate unique order number
        String orderNumber = generateOrderNumber();

        // Step 2: Create order entity
        Order order = new Order();
        order.setUserId(userId);
        order.setOrderNumber(orderNumber);
        order.setStatus("PENDING"); // Initial status
        order.setOrderDate(LocalDateTime.now());

        // Step 3 & 4: Add items and calculate total
        List<OrderItem> orderItems = new ArrayList<>();
        double totalAmount = 0.0;

        for (OrderItemDTO itemDTO : items) {
            OrderItem item = new OrderItem();
            item.setProductId(itemDTO.getProductId());
            item.setQuantity(itemDTO.getQuantity());
            item.setPrice(itemDTO.getPrice());
            item.setOrder(order);

            orderItems.add(item);
            totalAmount += itemDTO.getPrice() * itemDTO.getQuantity();
        }

        order.setItems(orderItems);

        // Step 5: Set total amount
        order.setTotalAmount(totalAmount);

        // Step 6: Save to database
        Order savedOrder = orderRepository.save(order);

        // Convert to DTO and return
        return convertToDTO(savedOrder);
    }

    /**
     * Generate a unique, human-readable order number
     * Format: ORD-TIMESTAMP-RANDOM
     * Example: ORD-1713456789-A2B3C4D5
     */
    private String generateOrderNumber() {
        long timestamp = System.currentTimeMillis() / 1000; // Convert to seconds
        String random = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return "ORD-" + timestamp + "-" + random;
    }

    /**
     * Convert Order entity to OrderDTO
     */
    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setUserId(order.getUserId());
        dto.setStatus(order.getStatus());
        dto.setOrderDate(order.getOrderDate());
        dto.setTotalAmount(order.getTotalAmount());

        if (order.getItems() != null) {
            List<OrderItemDTO> itemDTOs = order.getItems().stream()
                    .map(item -> {
                        OrderItemDTO itemDTO = new OrderItemDTO();
                        itemDTO.setProductId(item.getProductId());
                        itemDTO.setQuantity(item.getQuantity());
                        itemDTO.setPrice(item.getPrice());
                        return itemDTO;
                    })
                    .collect(Collectors.toList());
            dto.setItems(itemDTOs);
        }

        return dto;
    }
}
