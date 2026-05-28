package com.ecommerce.order.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ecommerce.order.dto.CreateOrderDTO;
import com.ecommerce.order.dto.OrderDTO;
import com.ecommerce.order.dto.OrderItemDTO;
import com.ecommerce.order.entity.Order;
import com.ecommerce.order.entity.OrderItem;
import com.ecommerce.order.pattern.builder.OrderBuilder;
import com.ecommerce.order.pattern.factory.OrderStatusFactory;
import com.ecommerce.order.pattern.singleton.OrderClockSingleton;
import com.ecommerce.order.repository.OrderRepository;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final org.springframework.web.client.RestTemplate restTemplate;
    
    @Value("${services.product-service.url}")
    private String productServiceUrl;

    @Value("${jwt.secret}")
    private String jwtSecret;

    public OrderService(OrderRepository orderRepository, org.springframework.web.client.RestTemplate restTemplate) {
        this.orderRepository = orderRepository;
        this.restTemplate = restTemplate;
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
        order.setOrderNumber(generateOrderNumber());

        Order savedOrder = orderRepository.save(order);

        return convertToDTO(savedOrder);
    }

    @Transactional(readOnly = true)
    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OrderDTO> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public OrderDTO getOrderById(Long id) {
        return orderRepository.findById(id)
                .map(this::convertToDTO)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }

    @Transactional
    public OrderDTO updateOrder(Long id, CreateOrderDTO updateDTO) {
        Order existing = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));

        existing.setUserId(updateDTO.getUserId());
        existing.setStatus(OrderStatusFactory.createUpdatedStatus(existing.getStatus()));

        if (existing.getItems() != null) {
            existing.getItems().clear();
        } else {
            existing.setItems(new ArrayList<>());
        }

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
    public OrderDTO updateStatus(Long id, String status) {
        Order existing = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
        String previousStatus = existing.getStatus();
        existing.setStatus(status);
        if ("PAID".equalsIgnoreCase(status) && !isStockAlreadyCommitted(previousStatus)) {
            decrementStock(existing);
        }
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

    private String generateOrderNumber() {
        long timestamp = System.currentTimeMillis() / 1000;
        String random = UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        return "ORD-" + timestamp + "-" + random;
    }

    private boolean isStockAlreadyCommitted(String status) {
        return "PAID".equalsIgnoreCase(status)
                || "CONFIRMED".equalsIgnoreCase(status)
                || "SHIPPED".equalsIgnoreCase(status)
                || "DELIVERED".equalsIgnoreCase(status);
    }

    private void decrementStock(Order order) {
        if (order.getItems() == null) {
            return;
        }

        for (OrderItem item : order.getItems()) {
            try {
                HttpHeaders headers = new HttpHeaders();
                headers.setBearerAuth(createServiceToken());
                restTemplate.exchange(
                        productServiceUrl + "/products/" + item.getProductId() + "/decrease-stock?quantity=" + item.getQuantity(),
                        HttpMethod.PATCH,
                        new HttpEntity<>(headers),
                        Object.class
                );
            } catch (Exception e) {
                throw new IllegalStateException("Failed to decrement stock for product " + item.getProductId(), e);
            }
        }
    }

    private String createServiceToken() {
        Date now = new Date();
        Date expiresAt = new Date(now.getTime() + 300_000);
        return Jwts.builder()
                .subject("order-service")
                .claim("role", "SERVICE")
                .issuedAt(now)
                .expiration(expiresAt)
                .signWith(Keys.hmacShaKeyFor(jwtSecret.trim().getBytes(java.nio.charset.StandardCharsets.UTF_8)))
                .compact();
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
