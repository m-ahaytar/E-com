package com.ecommerce.order.dto;

import java.time.LocalDateTime;
import java.util.List;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

/**
 * DTO for orders with validation
 */
public class OrderDTO {

    private Long id;
    
    @NotNull(message = "User ID is required")
    private Long userId;
    
    private String orderNumber;
    
    @Pattern(regexp = "PENDING|PAID|CONFIRMED|SHIPPED|DELIVERED|CANCELLED",
             message = "Status must be one of: PENDING, PAID, CONFIRMED, SHIPPED, DELIVERED, CANCELLED")
    private String status;
    
    private LocalDateTime orderDate;
    private LocalDateTime createdAt;
    
    @NotNull(message = "Total amount is required")
    @DecimalMin(value = "0.01", message = "Total must be greater than 0")
    private Double total;
    
    private Double totalAmount;
    
    @Valid
    @NotEmpty(message = "Order must contain at least one item")
    private List<OrderItemDTO> items;

    public OrderDTO() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getOrderNumber() {
        return orderNumber;
    }

    public void setOrderNumber(String orderNumber) {
        this.orderNumber = orderNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public List<OrderItemDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDTO> items) {
        this.items = items;
    }
}
