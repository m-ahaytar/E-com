package com.ecommerce.order.decorator;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Order Calculator Decorator Pattern Tests")
@Tag("pattern")
@Tag("unit")
class OrderCalculatorDecoratorTest {

    @Nested
    @DisplayName("Base Order Calculator Tests")
    class BaseOrderCalculatorTests {
        @Test
        @DisplayName("base calculator returns items subtotal")
        void baseCalculator_returnsSubtotal() {
            // Arrange
            OrderCalculator calculator = new BaseOrderCalculator(100.0);
            
            // Act & Assert
            assertEquals(100.0, calculator.getTotal());
            assertTrue(calculator.getDescription().contains("100.00"));
        }

        @Test
        @DisplayName("negative items subtotal throws exception")
        void baseCalculator_negativeSubtotal() {
            // Assert
            assertThrows(IllegalArgumentException.class, () -> new BaseOrderCalculator(-50.0),
                "Should reject negative subtotal");
        }

        @ParameterizedTest
        @ValueSource(doubles = { 0.0, 50.0, 100.0, 1000.0 })
        @DisplayName("base calculator with various amounts")
        void baseCalculator_multipleAmounts(double amount) {
            // Arrange
            OrderCalculator calculator = new BaseOrderCalculator(amount);
            
            // Act & Assert
            assertEquals(amount, calculator.getTotal());
        }
    }

    @Nested
    @DisplayName("Tax Decorator Tests")
    class TaxDecoratorTests {
        @Test
        @DisplayName("add 8% tax to subtotal")
        void taxDecorator_add8Percent() {
            // Arrange
            OrderCalculator base = new BaseOrderCalculator(100.0);
            OrderCalculator withTax = new TaxDecorator(base, 0.08);
            
            // Act & Assert
            assertEquals(108.0, withTax.getTotal());
            assertTrue(withTax.getDescription().contains("8.0%"));
        }

        @Test
        @DisplayName("add 10% tax to subtotal")
        void taxDecorator_add10Percent() {
            // Arrange
            OrderCalculator base = new BaseOrderCalculator(250.0);
            OrderCalculator withTax = new TaxDecorator(base, 0.10);
            
            // Act & Assert
            assertEquals(275.0, withTax.getTotal());
        }

        @ParameterizedTest
        @ValueSource(doubles = { 0.0, 0.05, 0.10, 0.15 })
        @DisplayName("tax decorator with various tax rates")
        void taxDecorator_multipleTaxRates(double taxRate) {
            // Arrange
            double subtotal = 100.0;
            OrderCalculator base = new BaseOrderCalculator(subtotal);
            OrderCalculator withTax = new TaxDecorator(base, taxRate);
            
            // Act & Assert
            assertEquals(subtotal + (subtotal * taxRate), withTax.getTotal(), 0.01);
        }

        @Test
        @DisplayName("invalid tax rate throws exception")
        void taxDecorator_invalidTaxRate() {
            // Arrange
            OrderCalculator base = new BaseOrderCalculator(100.0);
            
            // Assert
            assertThrows(IllegalArgumentException.class, () -> new TaxDecorator(base, 1.5),
                "Should reject tax rate > 1");
            assertThrows(IllegalArgumentException.class, () -> new TaxDecorator(base, -0.1),
                "Should reject negative tax rate");
        }
    }

    @Nested
    @DisplayName("Shipping Decorator Tests")
    class ShippingDecoratorTests {
        @Test
        @DisplayName("add flat shipping cost")
        void shippingDecorator_addFlatCost() {
            // Arrange
            OrderCalculator base = new BaseOrderCalculator(100.0);
            OrderCalculator withShipping = new ShippingDecorator(base, 10.0);
            
            // Act & Assert
            assertEquals(110.0, withShipping.getTotal());
            assertTrue(withShipping.getDescription().contains("10.00"));
        }

        @ParameterizedTest
        @ValueSource(doubles = { 5.0, 10.0, 25.0, 50.0 })
        @DisplayName("shipping decorator with various costs")
        void shippingDecorator_multipleCosts(double shippingCost) {
            // Arrange
            double subtotal = 100.0;
            OrderCalculator base = new BaseOrderCalculator(subtotal);
            OrderCalculator withShipping = new ShippingDecorator(base, shippingCost);
            
            // Act & Assert
            assertEquals(subtotal + shippingCost, withShipping.getTotal());
        }

        @Test
        @DisplayName("negative shipping cost throws exception")
        void shippingDecorator_negativeCost() {
            // Arrange
            OrderCalculator base = new BaseOrderCalculator(100.0);
            
            // Assert
            assertThrows(IllegalArgumentException.class, () -> new ShippingDecorator(base, -10.0),
                "Should reject negative shipping cost");
        }
    }

    @Nested
    @DisplayName("Discount Decorator Tests")
    class DiscountDecoratorTests {
        @Test
        @DisplayName("apply discount to subtotal")
        void discountDecorator_applyDiscount() {
            // Arrange
            OrderCalculator base = new BaseOrderCalculator(100.0);
            OrderCalculator withDiscount = new DiscountDecorator(base, 10.0);
            
            // Act & Assert
            assertEquals(90.0, withDiscount.getTotal());
            assertTrue(withDiscount.getDescription().contains("10.00"));
        }

        @Test
        @DisplayName("discount does not make total negative")
        void discountDecorator_discountCappedAtZero() {
            // Arrange
            OrderCalculator base = new BaseOrderCalculator(50.0);
            OrderCalculator withDiscount = new DiscountDecorator(base, 100.0);
            
            // Act & Assert
            assertEquals(0.0, withDiscount.getTotal());
        }

        @ParameterizedTest
        @ValueSource(doubles = { 5.0, 10.0, 25.0 })
        @DisplayName("discount decorator with various amounts")
        void discountDecorator_multipleAmounts(double discountAmount) {
            // Arrange
            double subtotal = 100.0;
            OrderCalculator base = new BaseOrderCalculator(subtotal);
            OrderCalculator withDiscount = new DiscountDecorator(base, discountAmount);
            
            // Act & Assert
            assertEquals(Math.max(0, subtotal - discountAmount), withDiscount.getTotal());
        }

        @Test
        @DisplayName("negative discount amount throws exception")
        void discountDecorator_negativeAmount() {
            // Arrange
            OrderCalculator base = new BaseOrderCalculator(100.0);
            
            // Assert
            assertThrows(IllegalArgumentException.class, () -> new DiscountDecorator(base, -10.0),
                "Should reject negative discount");
        }
    }

    @Nested
    @DisplayName("Decorator Composition Tests")
    class DecoratorCompositionTests {
        @Test
        @DisplayName("combine tax and shipping")
        void combineTaxAndShipping() {
            // Arrange
            OrderCalculator base = new BaseOrderCalculator(100.0);
            OrderCalculator withTax = new TaxDecorator(base, 0.08);
            OrderCalculator withTaxAndShipping = new ShippingDecorator(withTax, 10.0);
            
            // Act & Assert
            // 100 + (100 * 0.08) + 10 = 118
            assertEquals(118.0, withTaxAndShipping.getTotal());
        }

        @Test
        @DisplayName("combine tax, shipping, and discount")
        void combineTaxShippingDiscount() {
            // Arrange
            OrderCalculator base = new BaseOrderCalculator(100.0);
            OrderCalculator withTax = new TaxDecorator(base, 0.10);
            OrderCalculator withShipping = new ShippingDecorator(withTax, 5.0);
            OrderCalculator withDiscount = new DiscountDecorator(withShipping, 10.0);
            
            // Act & Assert
            // 100 + (100 * 0.10) + 5 - 10 = 105
            assertEquals(105.0, withDiscount.getTotal());
        }

        @Test
        @DisplayName("apply discount before tax")
        void applyDiscountBeforeTax() {
            // Arrange
            OrderCalculator base = new BaseOrderCalculator(100.0);
            OrderCalculator withDiscount = new DiscountDecorator(base, 20.0);
            OrderCalculator withTax = new TaxDecorator(withDiscount, 0.10);
            
            // Act & Assert
            // (100 - 20) + ((100 - 20) * 0.10) = 88
            assertEquals(88.0, withTax.getTotal());
        }

        @Test
        @DisplayName("calculator description includes all decorators")
        void descriptionIncludesAllDecorators() {
            // Arrange
            OrderCalculator base = new BaseOrderCalculator(100.0);
            OrderCalculator withTax = new TaxDecorator(base, 0.08);
            OrderCalculator withShipping = new ShippingDecorator(withTax, 10.0);
            
            // Act
            String description = withShipping.getDescription();
            
            // Assert
            assertTrue(description.contains("Items subtotal"), "Should mention items subtotal");
            assertTrue(description.contains("Tax"), "Should mention tax");
            assertTrue(description.contains("Shipping"), "Should mention shipping");
            assertTrue(description.contains("Total"), "Should mention total");
        }
    }
}
