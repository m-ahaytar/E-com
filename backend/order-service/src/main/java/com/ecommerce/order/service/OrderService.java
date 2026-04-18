package com.ecommerce.order.service;

import com.ecommerce.order.dto.CreateOrderDTO;
import com.ecommerce.order.dto.OrderDTO;
import com.ecommerce.order.dto.OrderItemDTO;
import com.ecommerce.order.entity.Order;
import com.ecommerce.order.entity.OrderItem;
import com.ecommerce.order.pattern.builder.OrderBuilder;
import com.ecommerce.order.pattern.factory.OrderStatusFactory;
import com.ecommerce.order.pattern.singleton.OrderClockSingleton;
import com.ecommerce.order.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @Transactional
    public OrderDTO createOrder(CreateOrderDTO createOrderDTO) {
        // Builder: creation lisible de la commande.
        Order order = new OrderBuilder()
                .withUserId(createOrderDTO.getUserId())
                .withStatus(OrderStatusFactory.createInitialStatus())
                .withCreatedAt(OrderClockSingleton.getInstance().now())
                .withItems(createOrderDTO.getItems())
                .build();

        // Simple order number for submission and tests.
        order.setOrderNumber(generateOrderNumber(createOrderDTO.getUserId()));

        Order savedOrder = orderRepository.save(order);
        return convertToDTO(savedOrder);
    }

    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public List<OrderDTO> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public OrderDTO getOrderById(Long id) {
        return orderRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }

    @Transactional
    public OrderDTO updateOrder(Long id, CreateOrderDTO updateDTO) {
        Optional<Order> existingOptional = orderRepository.findById(id);
        if (existingOptional.isEmpty()) {
            return null;
        }

        Order existing = existingOptional.get();
        existing.setUserId(updateDTO.getUserId());
        existing.setStatus(OrderStatusFactory.createUpdatedStatus(existing.getStatus()));

        existing.getItems().clear();
        double totalAmount = 0.0;
        if (updateDTO.getItems() != null) {
            for (CreateOrderDTO.CreateOrderItemDTO itemDTO : updateDTO.getItems()) {
                OrderItem item = new OrderItem();
                item.setProductId(itemDTO.getProductId());
                item.setProductName(itemDTO.getProductName());
                item.setQuantity(itemDTO.getQuantity());
                item.setPrice(itemDTO.getPrice());
                existing.addItem(item);
                totalAmount += itemDTO.getPrice() * itemDTO.getQuantity();
            }
        }
        existing.setTotalAmount(totalAmount);

        Order updated = orderRepository.save(existing);
        return convertToDTO(updated);
    }

    @Transactional
    public boolean deleteOrder(Long id) {
        if (!orderRepository.existsById(id)) {
            return false;
        }
        orderRepository.deleteById(id);
        return true;
    }

    private String generateOrderNumber(Long userId) {
        return "ORD-" + userId + "-" + System.currentTimeMillis();
    }

    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setUserId(order.getUserId());
        dto.setStatus(order.getStatus());
        dto.setOrderDate(order.getOrderDate());
        dto.setOrderNumber(order.getOrderNumber());
        dto.setCreatedAt(order.getOrderDate());
        dto.setTotal(order.getTotalAmount());
        dto.setTotalAmount(order.getTotalAmount());
        dto.setItems(order.getItems().stream()
                .map(item -> {
                    OrderItemDTO itemDTO = new OrderItemDTO();
                    itemDTO.setProductId(item.getProductId());
                    itemDTO.setProductName(item.getProductName());
                    itemDTO.setQuantity(item.getQuantity());
                    itemDTO.setPrice(item.getPrice());
                    return itemDTO;
                })
                .collect(Collectors.toList()));
        return dto;
    }
}
