package com.ecommerce.order.decorator;

/**
 * Shipping decorator that adds shipping cost to the order total.
 */
public class ShippingDecorator extends OrderCalculatorDecorator {
    private final double shippingCost;
    
    /**
     * Initialize with a calculator and shipping cost.
     * @param calculator the calculator to decorate
     * @param shippingCost the shipping cost
     */
    public ShippingDecorator(OrderCalculator calculator, double shippingCost) {
        super(calculator);
        if (shippingCost < 0) {
            throw new IllegalArgumentException("Shipping cost cannot be negative");
        }
        this.shippingCost = shippingCost;
    }
    
    @Override
    public double getTotal() {
        return decorator.getTotal() + shippingCost;
    }
    
    @Override
    public String getDescription() {
        return decorator.getDescription() + ", Shipping: $" + String.format("%.2f", shippingCost) +
               ", Total: $" + String.format("%.2f", getTotal());
    }
}
