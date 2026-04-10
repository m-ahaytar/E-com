package com.ecommerce.payment.dto;

import java.time.LocalDateTime;

public class PaymentDTO {
    private Long id;
    private Long orderId;
    private String method;
    private String status;
    private Double amount;
    private LocalDateTime timestamp;

    public PaymentDTO() {}

    public PaymentDTO(Long id, Long orderId, String method, String status, Double amount, LocalDateTime timestamp) {
        this.id = id;
        this.orderId = orderId;
        this.method = method;
        this.status = status;
        this.amount = amount;
        this.timestamp = timestamp;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public String getMethod() {
        return method;
    }

    public void setMethod(String method) {
        this.method = method;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
