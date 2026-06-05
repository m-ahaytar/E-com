package com.ecommerce.payment.pattern.decorator;

import com.ecommerce.payment.dto.PaymentRequest;
import com.ecommerce.payment.entity.Payment;

import java.time.LocalDateTime;

// Decorator: ajoute un petit log autour du traitement principal.
public class PaymentAuditDecorator implements PaymentProcessor {

    private final PaymentProcessor delegate;

    public PaymentAuditDecorator(PaymentProcessor delegate) {
        this.delegate = delegate;
    }

    @Override
    public Payment process(PaymentRequest request) {
        System.out.println("[PAYMENT-AUDIT] Debut traitement orderId=" + request.getOrderId());
        Payment payment = delegate.process(request);
        System.out.println("[PAYMENT-AUDIT] Fin traitement a " + LocalDateTime.now());
        return payment;
    }
}
