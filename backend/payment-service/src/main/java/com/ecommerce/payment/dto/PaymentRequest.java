package com.ecommerce.payment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Pattern;

/**
 * DTO for payment request with validation
 */
public class PaymentRequest {
    @NotNull(message = "Order ID is required")
    private Long orderId;
    
    @NotBlank(message = "Payment method is required")
    @Pattern(regexp = "CREDIT_CARD|DEBIT_CARD|UPI|WALLET", 
             message = "Payment method must be one of: CREDIT_CARD, DEBIT_CARD, UPI, WALLET")
    private String method;
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private Double amount;

    public PaymentRequest() {}

    public PaymentRequest(Long orderId, String method, Double amount) {
        this.orderId = orderId;
        this.method = method;
        this.amount = amount;
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

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}
