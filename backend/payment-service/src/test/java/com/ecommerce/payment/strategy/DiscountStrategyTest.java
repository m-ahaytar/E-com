package com.ecommerce.payment.strategy;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("Discount Strategy Pattern Tests")
@Tag("pattern")
@Tag("unit")
class DiscountStrategyTest {

    @Nested
    @DisplayName("Percentage Discount Strategy Tests")
    class PercentageDiscountStrategyTests {
        @Test
        @DisplayName("calculate 10% discount")
        void percentageDiscount_10Percent() {
            // Arrange
            DiscountStrategy strategy = new PercentageDiscountStrategy(10.0);
            
            // Act
            double discount = strategy.calculateDiscount(100.0);
            
            // Assert
            assertEquals(10.0, discount, "10% of 100 should be 10");
            assertEquals("10.0% discount", strategy.getDescription());
        }

        @Test
        @DisplayName("calculate 25% discount")
        void percentageDiscount_25Percent() {
            // Arrange
            DiscountStrategy strategy = new PercentageDiscountStrategy(25.0);
            
            // Act
            double discount = strategy.calculateDiscount(200.0);
            
            // Assert
            assertEquals(50.0, discount, "25% of 200 should be 50");
        }

        @ParameterizedTest
        @ValueSource(doubles = { 0.0, 5.0, 50.0, 100.0 })
        @DisplayName("calculate discount with various percentages")
        void percentageDiscount_multiplePercentages(double percentage) {
            // Arrange
            DiscountStrategy strategy = new PercentageDiscountStrategy(percentage);
            
            // Act
            double discount = strategy.calculateDiscount(100.0);
            
            // Assert
            assertEquals(percentage, discount, "Discount should be " + percentage + "% of 100");
        }

        @Test
        @DisplayName("percentage outside valid range throws exception")
        void percentageDiscount_invalidPercentage() {
            // Assert
            assertThrows(IllegalArgumentException.class, () -> new PercentageDiscountStrategy(101.0),
                "Should reject percentage > 100");
            assertThrows(IllegalArgumentException.class, () -> new PercentageDiscountStrategy(-1.0),
                "Should reject negative percentage");
        }
    }

    @Nested
    @DisplayName("Fixed Amount Discount Strategy Tests")
    class FixedAmountDiscountStrategyTests {
        @Test
        @DisplayName("calculate fixed $10 discount")
        void fixedDiscount_10Dollars() {
            // Arrange
            DiscountStrategy strategy = new FixedAmountDiscountStrategy(10.0);
            
            // Act
            double discount = strategy.calculateDiscount(100.0);
            
            // Assert
            assertEquals(10.0, discount, "Fixed discount should be 10");
            assertEquals("Fixed $10.0 discount", strategy.getDescription());
        }

        @Test
        @DisplayName("fixed discount does not exceed payment amount")
        void fixedDiscount_capAtAmount() {
            // Arrange
            DiscountStrategy strategy = new FixedAmountDiscountStrategy(50.0);
            
            // Act
            double discount = strategy.calculateDiscount(30.0);
            
            // Assert
            assertEquals(30.0, discount, "Discount should not exceed payment amount");
        }

        @ParameterizedTest
        @ValueSource(doubles = { 5.0, 10.0, 25.0, 100.0 })
        @DisplayName("calculate fixed discount with various amounts")
        void fixedDiscount_multipleAmounts(double discountAmount) {
            // Arrange
            DiscountStrategy strategy = new FixedAmountDiscountStrategy(discountAmount);
            
            // Act
            double discount = strategy.calculateDiscount(1000.0);
            
            // Assert
            assertEquals(discountAmount, discount, "Fixed discount should be " + discountAmount);
        }

        @Test
        @DisplayName("negative discount amount throws exception")
        void fixedDiscount_negativeAmount() {
            // Assert
            assertThrows(IllegalArgumentException.class, () -> new FixedAmountDiscountStrategy(-10.0),
                "Should reject negative discount amount");
        }
    }

    @Nested
    @DisplayName("No Discount Strategy Tests")
    class NoDiscountStrategyTests {
        @Test
        @DisplayName("no discount returns zero")
        void noDiscount_returnsZero() {
            // Arrange
            DiscountStrategy strategy = new NoDiscountStrategy();
            
            // Act
            double discount = strategy.calculateDiscount(100.0);
            
            // Assert
            assertEquals(0.0, discount, "No discount strategy should return 0");
            assertEquals("No discount", strategy.getDescription());
        }

        @ParameterizedTest
        @ValueSource(doubles = { 10.0, 50.0, 100.0, 1000.0 })
        @DisplayName("no discount with various amounts")
        void noDiscount_multipleAmounts(double amount) {
            // Arrange
            DiscountStrategy strategy = new NoDiscountStrategy();
            
            // Act
            double discount = strategy.calculateDiscount(amount);
            
            // Assert
            assertEquals(0.0, discount, "Should always return zero discount");
        }
    }

    @Nested
    @DisplayName("Strategy Usage Example Tests")
    class StrategyUsageTests {
        @Test
        @DisplayName("apply discount using strategy")
        void applyDiscount_usingStrategy() {
            // Arrange - using strategy to calculate final price
            DiscountStrategy discountStrategy = new PercentageDiscountStrategy(10.0);
            double originalPrice = 100.0;
            
            // Act
            double discountAmount = discountStrategy.calculateDiscount(originalPrice);
            double finalPrice = originalPrice - discountAmount;
            
            // Assert
            assertEquals(10.0, discountAmount);
            assertEquals(90.0, finalPrice);
        }

        @Test
        @DisplayName("switch discount strategies dynamically")
        void switchStrategies_dynamically() {
            // Arrange
            double originalPrice = 100.0;
            
            // Act & Assert - First use percentage discount
            DiscountStrategy strategy = new PercentageDiscountStrategy(20.0);
            assertEquals(20.0, strategy.calculateDiscount(originalPrice));
            
            // Switch to fixed discount
            strategy = new FixedAmountDiscountStrategy(15.0);
            assertEquals(15.0, strategy.calculateDiscount(originalPrice));
            
            // Switch to no discount
            strategy = new NoDiscountStrategy();
            assertEquals(0.0, strategy.calculateDiscount(originalPrice));
        }
    }
}
