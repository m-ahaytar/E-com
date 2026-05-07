package com.ecommerce.payment.strategy;

/**
 * Strategy interface for calculating discount on payment amount.
 * Implements the Strategy design pattern to support multiple discount calculation algorithms.
 */
public interface DiscountStrategy {
    /**
     * Calculate the discount amount for a given payment amount.
     * @param amount the payment amount
     * @return the discount amount
     */
    double calculateDiscount(double amount);
    
    /**
     * Get the description of the discount strategy.
     * @return strategy description
     */
    String getDescription();
}
