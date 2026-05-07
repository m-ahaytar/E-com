package com.ecommerce.order.decorator;

/**
 * Component interface for order calculation.
 * Defines the contract for calculating order totals with various add-ons.
 */
public interface OrderCalculator {
    /**
     * Calculate the total order amount.
     * @return the total amount
     */
    double getTotal();
    
    /**
     * Get a description of the calculation.
     * @return description
     */
    String getDescription();
}
