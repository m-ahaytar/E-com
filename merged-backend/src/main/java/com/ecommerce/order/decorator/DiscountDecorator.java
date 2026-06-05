package com.ecommerce.order.decorator;

/**
 * Discount decorator that subtracts a discount amount from the order total.
 */
public class DiscountDecorator extends OrderCalculatorDecorator {
    private final double discountAmount;
    
    /**
     * Initialize with a calculator and discount amount.
     * @param calculator the calculator to decorate
     * @param discountAmount the discount amount
     */
    public DiscountDecorator(OrderCalculator calculator, double discountAmount) {
        super(calculator);
        if (discountAmount < 0) {
            throw new IllegalArgumentException("Discount amount cannot be negative");
        }
        this.discountAmount = discountAmount;
    }
    
    @Override
    public double getTotal() {
        double subtotal = decorator.getTotal();
        return Math.max(0, subtotal - discountAmount);
    }
    
    @Override
    public String getDescription() {
        return decorator.getDescription() + ", Discount: -$" + String.format("%.2f", discountAmount) +
               ", Total: $" + String.format("%.2f", getTotal());
    }
}
