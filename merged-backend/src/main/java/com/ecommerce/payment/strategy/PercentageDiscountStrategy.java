package com.ecommerce.payment.strategy;

/**
 * Percentage-based discount strategy.
 * Calculates discount as a percentage of the payment amount.
 */
public class PercentageDiscountStrategy implements DiscountStrategy {
    private final double percentage;
    
    /**
     * Initialize with a percentage value.
     * @param percentage the discount percentage (0-100)
     */
    public PercentageDiscountStrategy(double percentage) {
        if (percentage < 0 || percentage > 100) {
            throw new IllegalArgumentException("Percentage must be between 0 and 100");
        }
        this.percentage = percentage;
    }
    
    @Override
    public double calculateDiscount(double amount) {
        return amount * (percentage / 100.0);
    }
    
    @Override
    public String getDescription() {
        return percentage + "% discount";
    }
}
