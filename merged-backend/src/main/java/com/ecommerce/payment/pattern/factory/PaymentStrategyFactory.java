package com.ecommerce.payment.pattern.factory;

import com.ecommerce.payment.pattern.strategy.CardPaymentStatusStrategy;
import com.ecommerce.payment.pattern.strategy.CashPaymentStatusStrategy;
import com.ecommerce.payment.pattern.strategy.PaymentStatusStrategy;

// Factory Method: choix simple de la strategie selon la methode.
public final class PaymentStrategyFactory {

    private PaymentStrategyFactory() {
    }

    public static PaymentStatusStrategy createStrategy(String method) {
        if ("CARD".equalsIgnoreCase(method)
                || "CREDIT_CARD".equalsIgnoreCase(method)
                || "DEBIT_CARD".equalsIgnoreCase(method)) {
            return new CardPaymentStatusStrategy();
        }
        return new CashPaymentStatusStrategy();
    }
}
