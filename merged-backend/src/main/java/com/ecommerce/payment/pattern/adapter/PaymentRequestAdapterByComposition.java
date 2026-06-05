package com.ecommerce.payment.pattern.adapter;

import com.ecommerce.payment.dto.PaymentRequest;
import com.ecommerce.payment.entity.Payment;

import java.time.LocalDateTime;

// Adapter par composition: on encapsule PaymentRequest.
public class PaymentRequestAdapterByComposition {

    private final PaymentRequest request;

    public PaymentRequestAdapterByComposition(PaymentRequest request) {
        this.request = request;
    }

    public Payment toPayment(String status) {
        Payment payment = new Payment();
        payment.setOrderId(request.getOrderId());
        payment.setMethod(request.getMethod());
        payment.setAmount(request.getAmount());
        payment.setStatus(status);
        payment.setTimestamp(LocalDateTime.now());
        return payment;
    }
}
