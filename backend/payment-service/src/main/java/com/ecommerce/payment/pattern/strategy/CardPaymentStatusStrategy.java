package com.ecommerce.payment.pattern.strategy;

public class CardPaymentStatusStrategy implements PaymentStatusStrategy {
    @Override
    public String resolveStatus() {
        return "COMPLETED";
    }
}
