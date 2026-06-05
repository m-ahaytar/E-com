package com.ecommerce.order.decorator;

/**
 * Base order calculator that calculates the subtotal of items.
 * This is the concrete component in the Decorator pattern.
 */
public class BaseOrderCalculator implements OrderCalculator {
    private final double itemsSubtotal;
    
    /**
     * Initialize with items subtotal.
     * @param itemsSubtotal the total amount of items before any add-ons
     */
    public BaseOrderCalculator(double itemsSubtotal) {
        if (itemsSubtotal < 0) {
            throw new IllegalArgumentException("Items subtotal cannot be negative");
        }
        this.itemsSubtotal = itemsSubtotal;
    }
    
    @Override
    public double getTotal() {
        return itemsSubtotal;
    }
    
    @Override
    public String getDescription() {
        return "Items subtotal: $" + String.format("%.2f", itemsSubtotal);
    }
}
