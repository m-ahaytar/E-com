package com.ecommerce.payment.strategy;

import java.util.Map;
import java.util.UUID;

/**
 * Concrete Strategy: Credit/Debit Card Payment
 * Implements card payment processing logic
 */
public class CardPaymentStrategy implements PaymentStrategy {
    
    /**
     * Process card payment
     * In a real application, this would integrate with a payment gateway like Stripe, Square, etc.
     */
    @Override
    public PaymentResult processPayment(Double amount, Map<String, String> paymentDetails) {
        try {
            // Validate card details
            String cardNumber = paymentDetails.get("cardNumber");
            String expiry = paymentDetails.get("expiry");
            String cvv = paymentDetails.get("cvv");
            
            if (cardNumber == null || cardNumber.isEmpty() ||
                expiry == null || expiry.isEmpty() ||
                cvv == null || cvv.isEmpty()) {
                return new PaymentResult(false, null, "Invalid card details");
            }
            
            // Validate card number length (basic check)
            if (cardNumber.length() < 13 || cardNumber.length() > 19) {
                return new PaymentResult(false, null, "Invalid card number");
            }
            
            // Validate CVV length
            if (cvv.length() < 3 || cvv.length() > 4) {
                return new PaymentResult(false, null, "Invalid CVV");
            }
            
            // In real implementation, call payment gateway API here
            // For now, simulate successful payment
            String transactionId = "TXN-" + UUID.randomUUID().toString();
            
            return new PaymentResult(true, transactionId, 
                "Card payment processed successfully. Transaction: " + transactionId);
            
        } catch (Exception e) {
            return new PaymentResult(false, null, "Card payment failed: " + e.getMessage());
        }
    }
    
    @Override
    public String getPaymentMethod() {
        return "CARD";
    }
}
