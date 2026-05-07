package com.ecommerce.payment.strategy;

/**
 * Fixed-amount discount strategy.
 * Applies a fixed discount amount regardless of payment amount.
 */
public class FixedAmountDiscountStrategy implements DiscountStrategy {
    private final double discountAmount;
    
    /**
     * Initialize with a fixed discount amount.
     * @param discountAmount the fixed discount amount
     */
    public FixedAmountDiscountStrategy(double discountAmount) {
        if (discountAmount < 0) {
            throw new IllegalArgumentException("Discount amount cannot be negative");
        }
        this.discountAmount = discountAmount;
    }
    
    @Override
    public double calculateDiscount(double amount) {
        // Ensure discount doesn't exceed the amount
        return Math.min(discountAmount, amount);
    }
    
    @Override
    public String getDescription() {
        return "Fixed $" + discountAmount + " discount";
    }
}
