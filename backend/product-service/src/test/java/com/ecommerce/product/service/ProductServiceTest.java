package com.ecommerce.product.service;

    import com.ecommerce.product.dto.ProductCreateDTO;
    import com.ecommerce.product.dto.ProductDTO;
    import com.ecommerce.product.entity.Category;
    import com.ecommerce.product.entity.Product;
    import com.ecommerce.product.repository.CategoryRepository;
    import com.ecommerce.product.repository.ProductRepository;
    import org.junit.jupiter.api.BeforeAll;
    import org.junit.jupiter.api.AfterAll;
    import org.junit.jupiter.api.BeforeEach;
    import org.junit.jupiter.api.DisplayName;
    import org.junit.jupiter.api.Nested;
    import org.junit.jupiter.api.Tag;
    import org.junit.jupiter.api.Test;
    import org.junit.jupiter.api.extension.ExtendWith;
    import org.junit.jupiter.params.ParameterizedTest;
    import org.junit.jupiter.params.provider.ValueSource;
    import org.mockito.InjectMocks;
    import org.mockito.Mock;
    import org.mockito.junit.jupiter.MockitoExtension;

    import java.time.Duration;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

@ExtendWith(MockitoExtension.class)
@DisplayName("ProductService Tests")
@Tag("unit")
@Tag("fast")
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private ProductService productService;

    private Product product;
    private Category category;
    private ProductCreateDTO createDTO;

    @BeforeAll
    static void beforeAll() {
        System.out.println("Starting tests for ProductService");
    }

    @AfterAll
    static void afterAll() {
        SecurityContextHolder.clearContext();
        System.out.println("Finished tests for ProductService");
    }

    @BeforeEach
    void setUp() {
        category = new Category();
        category.setId(1L);
        category.setName("Electronics");

        product = new Product();
        product.setId(1L);
        product.setName("Laptop");
        product.setDescription("High-end laptop");
        product.setPrice(999.99);
        product.setStock(10);
        product.setImageUrl("http://example.com/laptop.jpg");
        product.setCategory(category);
        product.setSellerEmail("seller@demo.com");

        createDTO = new ProductCreateDTO();
        createDTO.setName("Laptop");
        createDTO.setDescription("High-end laptop");
        createDTO.setPrice(999.99);
        createDTO.setStock(10);
        createDTO.setImageUrl("http://example.com/laptop.jpg");
        createDTO.setCategoryId(1L);
    }

    @Test
    void findAll_returnsListOfProducts() {
        // Arrange
        Product product2 = new Product();
        product2.setId(2L);
        product2.setName("Desktop");
        product2.setCategory(category);
        when(productRepository.findAll()).thenReturn(Arrays.asList(product, product2));

        // Act
        List<ProductDTO> results = productService.findAll();

        // Assert
        assertAll(
            () -> assertEquals(2, results.size(), "Should return 2 products"),
            () -> assertEquals("Laptop", results.get(0).getName(), "First product should be Laptop"),
            () -> assertEquals("Desktop", results.get(1).getName(), "Second product should be Desktop")
        );
        verify(productRepository).findAll();
    }

    @Test
    void findAll_withCategoryId_returnsProductsForCategory() {
        when(productRepository.findByCategory_Id(1L)).thenReturn(List.of(product));

        List<ProductDTO> results = productService.findAll(1L);

        assertAll(
            () -> assertEquals(1, results.size(), "Should return products for one category"),
            () -> assertEquals(1L, results.get(0).getCategoryId(), "Category id should match")
        );
        verify(productRepository).findByCategory_Id(1L);
        verify(productRepository, never()).findAll();
    }

    @Test
    @DisplayName("findAll should complete within 100ms")
    void findAll_completesWithinTimeout() {
        // Arrange
        Product product2 = new Product();
        product2.setId(2L);
        product2.setName("Desktop");
        product2.setCategory(category);
        when(productRepository.findAll()).thenReturn(Arrays.asList(product, product2));

        // Assert
        assertTimeout(Duration.ofMillis(100), () -> {
            // Act
            List<ProductDTO> results = productService.findAll();
            // Assertions inside the timeout block
            assertEquals(2, results.size(), "Should return 2 products");
            assertEquals("Laptop", results.get(0).getName(), "First product should be Laptop");
            assertEquals("Desktop", results.get(1).getName(), "Second product should be Desktop");
        });
        verify(productRepository).findAll();
    }

    @Test
    @DisplayName("find by valid ID should return product")
    void findById_validId_returnsProduct() {
        // Arrange
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        // Act
        ProductDTO result = productService.findById(1L);

        // Assert
        assertAll(
            () -> assertNotNull(result, "Product should not be null"),
            () -> assertEquals("Laptop", result.getName(), "Product name should match"),
            () -> assertEquals(999.99, result.getPrice(), "Product price should match")
        );
        verify(productRepository).findById(1L);
    }

    @Test
    @DisplayName("find by invalid ID should throw exception")
    void findById_invalidId_throws() {
        // Arrange
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> productService.findById(999L),
            "Should throw RuntimeException for invalid product ID"
        );
        assertTrue(exception.getMessage().contains("Product not found"), "Exception message should mention 'Product not found'");
    }

    @Nested
    @DisplayName("Create Product Tests")
    class CreateProductTests {
        @Test
        @DisplayName("save with valid DTO creates product successfully")
        void save_validDTO_createsProduct() {
            // Arrange
            Authentication auth = new UsernamePasswordAuthenticationToken(
                "seller@demo.com", null,
                List.of(new SimpleGrantedAuthority("ROLE_SELLER"))
            );
            SecurityContextHolder.getContext().setAuthentication(auth);

            when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
            when(productRepository.save(any(Product.class))).thenReturn(product);

            // Act
            ProductDTO result = productService.save(createDTO);

            // Assert
            assertAll(
                () -> assertNotNull(result, "Saved product should not be null"),
                () -> assertEquals("Laptop", result.getName(), "Product name should match"),
                () -> assertEquals("seller@demo.com", result.getSellerEmail(), "Seller email should be set from auth"),
                () -> verify(categoryRepository).findById(1L),
                () -> verify(productRepository).save(any(Product.class))
            );

            SecurityContextHolder.clearContext();
        }

        @Test
        @DisplayName("save with non-existent category throws exception")
        void save_categoryNotFound_throws() {
            // Arrange
            when(categoryRepository.findById(1L)).thenReturn(Optional.empty());

            // Act & Assert
            RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> productService.save(createDTO),
                "Should throw RuntimeException when category not found"
            );
            assertTrue(exception.getMessage().contains("Category not found"), 
                "Exception message should mention 'Category not found'");
            verify(productRepository, never()).save(any(Product.class));
        }

        @ParameterizedTest
        @ValueSource(longs = { 1L, 2L, 5L })
        @DisplayName("save product with different category IDs")
        void save_withVariousCategoryIds(Long categoryId) {
            // Arrange
            Authentication auth = new UsernamePasswordAuthenticationToken(
                "seller@demo.com", null,
                List.of(new SimpleGrantedAuthority("ROLE_SELLER"))
            );
            SecurityContextHolder.getContext().setAuthentication(auth);

            Category testCategory = new Category();
            testCategory.setId(categoryId);
            testCategory.setName("Category " + categoryId);
            when(categoryRepository.findById(categoryId)).thenReturn(Optional.of(testCategory));
            Product testProduct = new Product();
            testProduct.setId(1L);
            testProduct.setName("Test Product");
            testProduct.setCategory(testCategory);
            testProduct.setSellerEmail("seller@demo.com");
            when(productRepository.save(any(Product.class))).thenReturn(testProduct);
            createDTO.setCategoryId(categoryId);

            // Act
            ProductDTO result = productService.save(createDTO);

            // Assert
            assertNotNull(result, "Product should be created for category " + categoryId);
            assertEquals("seller@demo.com", result.getSellerEmail(), "Seller email should be set from auth");
            verify(categoryRepository).findById(categoryId);

            SecurityContextHolder.clearContext();
        }
    }

    @Nested
    @DisplayName("Update Product Tests")
    class UpdateProductTests {
        @Test
        @DisplayName("update with valid DTO updates product successfully")
        void update_validDTO_updatesProduct() {
            // Arrange
            when(productRepository.findById(1L)).thenReturn(Optional.of(product));
            when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
            when(productRepository.save(any(Product.class))).thenReturn(product);

            createDTO.setName("Updated Laptop");
            createDTO.setPrice(1299.99);

            // Act
            ProductDTO result = productService.update(1L, createDTO);

            // Assert
            assertAll(
                () -> assertNotNull(result, "Updated product should not be null"),
                () -> verify(productRepository).findById(1L),
                () -> verify(productRepository).save(any(Product.class))
            );
        }
    }

    @Nested
    @DisplayName("Delete Product Tests")
    class DeleteProductTests {
        @Test
        @DisplayName("delete with valid ID deletes product successfully")
        void deleteById_validId_deletesProduct() {
            // Arrange
            when(productRepository.existsById(1L)).thenReturn(true);

            // Act
            productService.deleteById(1L);

            // Assert
            verify(productRepository).deleteById(1L);
        }

        @Test
        @DisplayName("delete with invalid ID throws exception")
        void deleteById_invalidId_throws() {
            // Arrange
            when(productRepository.existsById(999L)).thenReturn(false);

            // Act & Assert
            RuntimeException exception = assertThrows(
                RuntimeException.class,
                () -> productService.deleteById(999L),
                "Should throw RuntimeException for non-existent product"
            );
            assertTrue(exception.getMessage().contains("Product not found"), 
                "Exception message should mention 'Product not found'");
            verify(productRepository, never()).deleteById(anyLong());
        }
    }

    @Nested
    @DisplayName("Stock Management Tests")
    class StockManagementTests {
        @Test
        @DisplayName("decrease stock with sufficient inventory succeeds")
        void decreaseStock_sufficientStock_updatesStock() {
            // Arrange
            product.setStock(10);
            when(productRepository.findById(1L)).thenReturn(Optional.of(product));
            when(productRepository.save(any(Product.class))).thenReturn(product);

            // Act
            ProductDTO result = productService.decreaseStock(1L, 3);

            // Assert
            assertAll(
                () -> assertNotNull(result, "Result should not be null"),
                () -> verify(productRepository).findById(1L),
                () -> verify(productRepository).save(any(Product.class))
            );
        }

        @Test
        @DisplayName("decrease stock with insufficient inventory throws exception")
        void decreaseStock_insufficientStock_throws() {
            // Arrange
            product.setStock(2);
            when(productRepository.findById(1L)).thenReturn(Optional.of(product));

            // Act & Assert
            IllegalStateException exception = assertThrows(
                IllegalStateException.class,
                () -> productService.decreaseStock(1L, 5),
                "Should throw IllegalStateException when stock is insufficient"
            );
            assertTrue(exception.getMessage().contains("Insufficient stock"), 
                "Exception message should mention 'Insufficient stock'");
            verify(productRepository, never()).save(any(Product.class));
        }

        @Test
        @DisplayName("decrease stock with invalid quantity throws exception")
        void decreaseStock_invalidQuantity_throws() {
            // Act & Assert - zero quantity
            IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> productService.decreaseStock(1L, 0),
                "Should throw IllegalArgumentException for zero quantity"
            );
            assertTrue(exception.getMessage().contains("Quantity must be greater than zero"), 
                "Exception message should mention quantity requirement");

            // Act & Assert - null quantity
            exception = assertThrows(
                IllegalArgumentException.class,
                () -> productService.decreaseStock(1L, null),
                "Should throw IllegalArgumentException for null quantity"
            );
            assertTrue(exception.getMessage().contains("Quantity must be greater than zero"), 
                "Exception message should mention quantity requirement");
        }

        @ParameterizedTest
        @ValueSource(ints = { 1, 2, 5, 10 })
        @DisplayName("decrease stock with various quantities")
        void decreaseStock_multipleQuantities(int quantity) {
            // Arrange
            product.setStock(20);
            when(productRepository.findById(1L)).thenReturn(Optional.of(product));
            when(productRepository.save(any(Product.class))).thenReturn(product);

            // Act
            ProductDTO result = productService.decreaseStock(1L, quantity);

            // Assert
            assertNotNull(result, "Should successfully decrease stock by " + quantity);
            verify(productRepository).save(any(Product.class));
        }
    }
}
