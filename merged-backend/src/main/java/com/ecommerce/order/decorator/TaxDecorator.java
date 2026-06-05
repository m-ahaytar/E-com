package com.ecommerce.order.decorator;

/**
 * Tax decorator that adds tax to the order total.
 */
public class TaxDecorator extends OrderCalculatorDecorator {
    private final double taxRate;
    
    /**
     * Initialize with a calculator and tax rate.
     * @param calculator the calculator to decorate
     * @param taxRate the tax rate (e.g., 0.08 for 8%)
     */
    public TaxDecorator(OrderCalculator calculator, double taxRate) {
        super(calculator);
        if (taxRate < 0 || taxRate > 1) {
            throw new IllegalArgumentException("Tax rate must be between 0 and 1");
        }
        this.taxRate = taxRate;
    }
    
    @Override
    public double getTotal() {
        double subtotal = decorator.getTotal();
        return subtotal + (subtotal * taxRate);
    }
    
    @Override
    public String getDescription() {
        double subtotal = decorator.getTotal();
        double tax = subtotal * taxRate;
        return decorator.getDescription() + ", Tax (" + (taxRate * 100) + "%): $" + 
               String.format("%.2f", tax) + ", Total: $" + String.format("%.2f", getTotal());
    }
}
