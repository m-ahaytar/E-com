package com.ecommerce.payment.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

/**
 * DTO for payment update request with validation
 */
public class PaymentUpdateRequest {
    @NotBlank(message = "Payment method is required")
    @Pattern(regexp = "CREDIT_CARD|DEBIT_CARD|UPI|WALLET|PAYPAL", 
             message = "Payment method must be one of: CREDIT_CARD, DEBIT_CARD, UPI, WALLET, PAYPAL")
    private String method;
    
    @NotBlank(message = "Status is required")
    @Pattern(regexp = "PENDING|COMPLETED|FAILED|REFUNDED", 
             message = "Status must be one of: PENDING, COMPLETED, FAILED, REFUNDED")
    private String status;
    
    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than 0")
    private Double amount;

    public PaymentUpdateRequest() {
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
}
