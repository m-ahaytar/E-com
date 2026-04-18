package com.ecommerce.payment.strategy;

import org.springframework.stereotype.Component;

/**
 * Factory for creating appropriate PaymentStrategy instances
 * Implements Factory Pattern to simplify strategy selection
 */
@Component
public class PaymentStrategyFactory {
    
    /**
     * Get the appropriate payment strategy based on payment method
     * @param paymentMethod The payment method (CARD or CASH_ON_DELIVERY)
     * @return Appropriate PaymentStrategy instance
     * @throws IllegalArgumentException if payment method is not supported
     */
    public PaymentStrategy getStrategy(String paymentMethod) {
        if (paymentMethod == null) {
            throw new IllegalArgumentException("Payment method cannot be null");
        }
        
        switch (paymentMethod.toUpperCase()) {
            case "CARD":
                return new CardPaymentStrategy();
                
            case "CASH_ON_DELIVERY":
            case "CASH":
                return new CashPaymentStrategy();
                
            default:
                throw new IllegalArgumentException("Unsupported payment method: " + paymentMethod);
        }
    }
}
