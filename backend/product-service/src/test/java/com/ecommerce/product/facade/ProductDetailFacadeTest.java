package com.ecommerce.product.facade;

import com.ecommerce.product.entity.Category;
import com.ecommerce.product.entity.Deal;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.repository.CategoryRepository;
import com.ecommerce.product.repository.DealRepository;
import com.ecommerce.product.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@DisplayName("Product Detail Facade Pattern Tests")
@Tag("pattern")
@Tag("unit")
class ProductDetailFacadeTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private DealRepository dealRepository;

    @InjectMocks
    private ProductDetailFacade facade;

    private Product product;
    private Category category;
    private Deal deal;

    @BeforeEach
    void setUp() {
        category = new Category();
        category.setId(1L);
        category.setName("Electronics");

        product = new Product();
        product.setId(1L);
        product.setName("Laptop");
        product.setDescription("High-performance laptop");
        product.setPrice(999.99);
        product.setStock(10);
        product.setImageUrl("http://example.com/laptop.jpg");
        product.setCategory(category);

        deal = new Deal();
        deal.setId(1L);
        deal.setProduct(product);
        deal.setDiscountPercentage(10.0);
        deal.setStartDate(LocalDateTime.now().minusDays(1));
        deal.setEndDate(LocalDateTime.now().plusDays(7));
    }

    @Nested
    @DisplayName("Get Product Details Tests")
    class GetProductDetailsTests {
        @Test
        @DisplayName("get product details returns complete product information")
        void getProductDetails_returnsCompleteInfo() {
            // Arrange
            when(productRepository.findById(1L)).thenReturn(Optional.of(product));
            when(dealRepository.findActiveDeals(any(LocalDateTime.class))).thenReturn(new ArrayList<>());

            // Act
            ProductDetailResponse response = facade.getProductDetails(1L);

            // Assert
            assertNotNull(response);
            assertEquals(1L, response.id());
            assertEquals("Laptop", response.name());
            assertEquals("High-performance laptop", response.description());
            assertEquals(999.99, response.price());
            assertEquals(10, response.stock());
            assertEquals("Electronics", response.categoryName());
            assertTrue(response.inStock());
        }

        @Test
        @DisplayName("get product details includes discount information when active")
        void getProductDetails_withActiveDiscount() {
            // Arrange
            when(productRepository.findById(1L)).thenReturn(Optional.of(product));
            when(dealRepository.findActiveDeals(any(LocalDateTime.class))).thenReturn(List.of(deal));

            // Act
            ProductDetailResponse response = facade.getProductDetails(1L);

            // Assert
            assertNotNull(response);
            assertEquals(10.0, response.discountPercentage());
            // 999.99 * (1 - 10/100) = 899.991
            assertEquals(899.991, response.discountedPrice(), 0.01);
        }

        @Test
        @DisplayName("get product details marks out of stock when stock is zero")
        void getProductDetails_outOfStock() {
            // Arrange
            product.setStock(0);
            when(productRepository.findById(1L)).thenReturn(Optional.of(product));
            when(dealRepository.findActiveDeals(any(LocalDateTime.class))).thenReturn(new ArrayList<>());

            // Act
            ProductDetailResponse response = facade.getProductDetails(1L);

            // Assert
            assertFalse(response.inStock());
        }

        @Test
        @DisplayName("get product details returns available regions")
        void getProductDetails_includesAvailableRegions() {
            // Arrange
            when(productRepository.findById(1L)).thenReturn(Optional.of(product));
            when(dealRepository.findActiveDeals(any(LocalDateTime.class))).thenReturn(new ArrayList<>());

            // Act
            ProductDetailResponse response = facade.getProductDetails(1L);

            // Assert
            assertNotNull(response.availableRegions());
            assertTrue(response.availableRegions().contains("US"));
            assertTrue(response.availableRegions().contains("EU"));
            assertTrue(response.availableRegions().contains("ASIA"));
        }

        @Test
        @DisplayName("get product details for non-existent product throws exception")
        void getProductDetails_productNotFound() {
            // Arrange
            when(productRepository.findById(999L)).thenReturn(Optional.empty());

            // Act & Assert
            assertThrows(RuntimeException.class, () -> facade.getProductDetails(999L),
                "Should throw exception for non-existent product");
        }

        @Test
        @DisplayName("get product details without category includes null category name")
        void getProductDetails_noCategory() {
            // Arrange
            product.setCategory(null);
            when(productRepository.findById(1L)).thenReturn(Optional.of(product));
            when(dealRepository.findActiveDeals(any(LocalDateTime.class))).thenReturn(new ArrayList<>());

            // Act
            ProductDetailResponse response = facade.getProductDetails(1L);

            // Assert
            assertNull(response.categoryName());
            assertNull(response.categoryId());
        }

        @Test
        @DisplayName("get product details without active discount returns null discount")
        void getProductDetails_noActiveDiscount() {
            // Arrange
            when(productRepository.findById(1L)).thenReturn(Optional.of(product));
            when(dealRepository.findActiveDeals(any(LocalDateTime.class))).thenReturn(new ArrayList<>());

            // Act
            ProductDetailResponse response = facade.getProductDetails(1L);

            // Assert
            assertNull(response.discountPercentage());
            assertEquals(product.getPrice(), response.discountedPrice());
        }
    }

    @Nested
    @DisplayName("Facade Aggregation Tests")
    class FacadeAggregationTests {
        @Test
        @DisplayName("facade aggregates data from multiple sources")
        void facade_aggregatesMultipleSources() {
            // Arrange - facade uses three different repositories
            when(productRepository.findById(1L)).thenReturn(Optional.of(product));
            when(dealRepository.findActiveDeals(any(LocalDateTime.class))).thenReturn(List.of(deal));

            // Act
            ProductDetailResponse response = facade.getProductDetails(1L);

            // Assert - verify all data sources are integrated
            assertAll(
                () -> assertEquals("Laptop", response.name(), "Name from product repository"),
                () -> assertEquals("Electronics", response.categoryName(), "Category from product repository"),
                () -> assertEquals(10.0, response.discountPercentage(), "Discount from deal repository"),
                () -> assertNotNull(response.availableRegions(), "Regions computed by facade")
            );
        }

        @Test
        @DisplayName("facade simplifies client code by providing single interface")
        void facade_simplifiesClientCode() {
            // Arrange
            when(productRepository.findById(1L)).thenReturn(Optional.of(product));
            when(dealRepository.findActiveDeals(any(LocalDateTime.class))).thenReturn(List.of(deal));

            // Act - client only needs to call one method
            ProductDetailResponse response = facade.getProductDetails(1L);

            // Assert - client receives all needed information in one response
            assertNotNull(response);
            assertEquals(12, response.getClass().getRecordComponents().length, 
                "Response contains all expected fields");
        }
    }

    @Nested
    @DisplayName("ProductDetailResponse Record Tests")
    class ProductDetailResponseRecordTests {
        @Test
        @DisplayName("product detail response creates immutable record")
        void productDetailResponse_isImmutable() {
            // Arrange
            List<String> regions = new ArrayList<>();
            regions.add("US");

            ProductDetailResponse response = new ProductDetailResponse(
                1L, "Laptop", "Description", 999.99, 10, "http://example.com/laptop.jpg",
                "Electronics", 1L, 10.0, 899.99, true, regions
            );

            // Act & Assert - record is immutable
            assertEquals(1L, response.id());
            assertEquals("Laptop", response.name());
            assertTrue(response.inStock());
        }

        @Test
        @DisplayName("product detail response includes all necessary fields")
        void productDetailResponse_containsAllFields() {
            // Arrange
            ProductDetailResponse response = new ProductDetailResponse(
                1L, "Laptop", "Description", 999.99, 10, "http://example.com/laptop.jpg",
                "Electronics", 1L, 10.0, 899.99, true, List.of("US", "EU")
            );

            // Act & Assert
            assertAll(
                () -> assertNotNull(response.id()),
                () -> assertNotNull(response.name()),
                () -> assertNotNull(response.price()),
                () -> assertNotNull(response.stock()),
                () -> assertNotNull(response.categoryName()),
                () -> assertNotNull(response.inStock()),
                () -> assertNotNull(response.availableRegions())
            );
        }
    }
}
