package com.ecommerce.payment.strategy;

/**
 * No discount strategy.
 * Returns zero discount for any payment amount.
 */
public class NoDiscountStrategy implements DiscountStrategy {
    
    @Override
    public double calculateDiscount(double amount) {
        return 0.0;
    }
    
    @Override
    public String getDescription() {
        return "No discount";
    }
}
