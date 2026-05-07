package com.ecommerce.order.decorator;

/**
 * Abstract decorator for order calculation.
 * Provides a base for concrete decorators that add functionality to the order calculator.
 */
public abstract class OrderCalculatorDecorator implements OrderCalculator {
    protected OrderCalculator decorator;
    
    /**
     * Initialize with the calculator to be decorated.
     * @param calculator the calculator to decorate
     */
    public OrderCalculatorDecorator(OrderCalculator calculator) {
        this.decorator = calculator;
    }
    
    @Override
    public double getTotal() {
        return decorator.getTotal();
    }
    
    @Override
    public String getDescription() {
        return decorator.getDescription();
    }
}
