package com.ecommerce.payment.strategy;

import java.util.Map;

/**
 * Strategy Pattern Interface for Payment Processing
 * This interface defines the contract for different payment methods.
 * Each payment strategy encapsulates a different payment algorithm.
 */
public interface PaymentStrategy {
    /**
     * Process payment using the specific payment method
     * @param amount The payment amount
     * @param paymentDetails Map containing payment-specific details
     * @return PaymentResult object with success/failure status
     */
    PaymentResult processPayment(Double amount, Map<String, String> paymentDetails);
    
    /**
     * Get the payment method name
     */
    String getPaymentMethod();
}
