package com.ecommerce.payment.pattern.strategy;

public class CashPaymentStatusStrategy implements PaymentStatusStrategy {
    @Override
    public String resolveStatus() {
        return "PENDING";
    }
}
