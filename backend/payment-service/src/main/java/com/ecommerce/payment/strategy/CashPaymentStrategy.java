package com.ecommerce.payment.strategy;

import java.util.Map;
import java.util.UUID;

/**
 * Concrete Strategy: Cash on Delivery Payment
 * Implements cash payment processing logic
 */
public class CashPaymentStrategy implements PaymentStrategy {
    
    /**
     * Process cash on delivery payment
     * This is simpler - just confirm the order and mark payment as pending
     */
    @Override
    public PaymentResult processPayment(Double amount, Map<String, String> paymentDetails) {
        try {
            // For Cash on Delivery, just verify delivery address
            String address = paymentDetails.get("address");
            
            if (address == null || address.isEmpty()) {
                return new PaymentResult(false, null, "Delivery address is required");
            }
            
            // Generate transaction ID for tracking
            String transactionId = "COD-" + UUID.randomUUID().toString();
            
            return new PaymentResult(true, transactionId, 
                "Cash on delivery order confirmed. Please pay upon delivery. Order: " + transactionId);
            
        } catch (Exception e) {
            return new PaymentResult(false, null, "Cash order processing failed: " + e.getMessage());
        }
    }
    
    @Override
    public String getPaymentMethod() {
        return "CASH_ON_DELIVERY";
    }
}
