package com.ecommerce.payment.pattern.adapter;

import com.ecommerce.payment.dto.PaymentRequest;

// Adapter par heritage: extension simple de PaymentRequest.
public class PaymentRequestAdapterByInheritance extends PaymentRequest {

    public PaymentRequestAdapterByInheritance(Long orderId, String method, Double amount) {
        super(orderId, method, amount);
    }

    public String toSafeMethod() {
        return getMethod() == null ? "CASH" : getMethod().toUpperCase();
    }
}
