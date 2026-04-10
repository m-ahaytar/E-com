package com.ecommerce.payment.dto;

public class PaymentRequest {
    private Long orderId;
    private String method;
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
