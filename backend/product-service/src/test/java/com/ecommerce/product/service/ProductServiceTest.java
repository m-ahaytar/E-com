package com.ecommerce.product.service;

import com.ecommerce.product.dto.ProductCreateDTO;
import com.ecommerce.product.dto.ProductDTO;
import com.ecommerce.product.entity.Category;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.repository.CategoryRepository;
import com.ecommerce.product.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
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
        assertEquals(2, results.size());
        assertEquals("Laptop", results.get(0).getName());
        assertEquals("Desktop", results.get(1).getName());
        verify(productRepository).findAll();
    }

    @Test
    void findById_validId_returnsProduct() {
        // Arrange
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        // Act
        ProductDTO result = productService.findById(1L);

        // Assert
        assertNotNull(result);
        assertEquals("Laptop", result.getName());
        assertEquals(999.99, result.getPrice());
        verify(productRepository).findById(1L);
    }

    @Test
    void findById_invalidId_throws() {
        // Arrange
        when(productRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> productService.findById(999L)
        );
        assertTrue(exception.getMessage().contains("Product not found"));
    }

    @Test
    void save_validDTO_createsProduct() {
        // Arrange
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(productRepository.save(any(Product.class))).thenReturn(product);

        // Act
        ProductDTO result = productService.save(createDTO);

        // Assert
        assertNotNull(result);
        assertEquals("Laptop", result.getName());
        verify(categoryRepository).findById(1L);
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void save_categoryNotFound_throws() {
        // Arrange
        when(categoryRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> productService.save(createDTO)
        );
        assertTrue(exception.getMessage().contains("Category not found"));
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
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
        assertNotNull(result);
        verify(productRepository).findById(1L);
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void deleteById_validId_deletesProduct() {
        // Arrange
        when(productRepository.existsById(1L)).thenReturn(true);

        // Act
        productService.deleteById(1L);

        // Assert
        verify(productRepository).deleteById(1L);
    }

    @Test
    void deleteById_invalidId_throws() {
        // Arrange
        when(productRepository.existsById(999L)).thenReturn(false);

        // Act & Assert
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> productService.deleteById(999L)
        );
        assertTrue(exception.getMessage().contains("Product not found"));
        verify(productRepository, never()).deleteById(anyLong());
    }

    @Test
    void decreaseStock_sufficientStock_updatesStock() {
        // Arrange
        product.setStock(10);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(product);

        // Act
        ProductDTO result = productService.decreaseStock(1L, 3);

        // Assert
        assertNotNull(result);
        verify(productRepository).findById(1L);
        verify(productRepository).save(any(Product.class));
    }

    @Test
    void decreaseStock_insufficientStock_throws() {
        // Arrange
        product.setStock(2);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        // Act & Assert
        IllegalStateException exception = assertThrows(
            IllegalStateException.class,
            () -> productService.decreaseStock(1L, 5)
        );
        assertTrue(exception.getMessage().contains("Insufficient stock"));
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void decreaseStock_invalidQuantity_throws() {
        // Act & Assert - zero quantity
        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> productService.decreaseStock(1L, 0)
        );
        assertTrue(exception.getMessage().contains("Quantity must be greater than zero"));

        // Act & Assert - null quantity
        exception = assertThrows(
            IllegalArgumentException.class,
            () -> productService.decreaseStock(1L, null)
        );
        assertTrue(exception.getMessage().contains("Quantity must be greater than zero"));
    }
}
