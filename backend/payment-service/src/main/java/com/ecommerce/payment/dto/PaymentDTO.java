package com.ecommerce.payment.dto;

import java.time.LocalDateTime;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.DecimalMin;

/**
 * DTO for payment with validation
 */
public class PaymentDTO {
    private Long id;
    
    @NotNull(message = "Order ID is required")
    private Long orderId;
    
    @NotBlank(message = "Payment method is required")
    @Pattern(regexp = "CREDIT_CARD|DEBIT_CARD|UPI|WALLET", 
             message = "Payment method must be one of: CREDIT_CARD, DEBIT_CARD, UPI, WALLET")
    private String method;
    
    @NotBlank(message = "Status is required")
    @Pattern(regexp = "PENDING|COMPLETED|FAILED|REFUNDED", 
             message = "Status must be one of: PENDING, COMPLETED, FAILED, REFUNDED")
    private String status;
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
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
