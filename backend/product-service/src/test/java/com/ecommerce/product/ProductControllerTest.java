package com.ecommerce.product;

import com.ecommerce.product.controller.ProductController;
import com.ecommerce.product.dto.ProductCreateDTO;
import com.ecommerce.product.dto.ProductDTO;
import com.ecommerce.product.service.ProductService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import jakarta.servlet.ServletException;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.junit.jupiter.api.Assertions.assertThrows;

@WebMvcTest(ProductController.class)
class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ProductService productService;

    @Test
    void findAll_Success() throws Exception {
        ProductDTO product1 = new ProductDTO(1L, "Product 1", "Description 1", 10.99, 100, null, 1L, "Category 1");
        ProductDTO product2 = new ProductDTO(2L, "Product 2", "Description 2", 20.99, 50, null, 1L, "Category 1");
        List<ProductDTO> products = Arrays.asList(product1, product2);

        when(productService.findAll()).thenReturn(products);

        mockMvc.perform(get("/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Product 1"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].name").value("Product 2"));
    }

    @Test
    void findById_Success() throws Exception {
        ProductDTO product = new ProductDTO(1L, "Product 1", "Description 1", 10.99, 100, null, 1L, "Category 1");

        when(productService.findById(1L)).thenReturn(product);

        mockMvc.perform(get("/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Product 1"))
                .andExpect(jsonPath("$.price").value(10.99));
    }

    @Test
    void save_Success() throws Exception {
        ProductCreateDTO createDTO = new ProductCreateDTO("New Product", "Description", 15.99, 50, null, 1L);
        ProductDTO savedProduct = new ProductDTO(1L, "New Product", "Description", 15.99, 50, null, 1L, "Category 1");

        when(productService.save(any(ProductCreateDTO.class))).thenReturn(savedProduct);

        mockMvc.perform(post("/products")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"New Product\",\"description\":\"Description\",\"price\":15.99,\"stock\":50,\"imageUrl\":null,\"categoryId\":1}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("New Product"));
    }

    @Test
    void update_Success() throws Exception {
        ProductCreateDTO updateDTO = new ProductCreateDTO("Updated Product", "Updated Description", 25.99, 75, null, 1L);
        ProductDTO updatedProduct = new ProductDTO(1L, "Updated Product", "Updated Description", 25.99, 75, null, 1L, "Category 1");

        when(productService.update(eq(1L), any(ProductCreateDTO.class))).thenReturn(updatedProduct);

        mockMvc.perform(put("/products/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Updated Product\",\"description\":\"Updated Description\",\"price\":25.99,\"stock\":75,\"imageUrl\":null,\"categoryId\":1}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Updated Product"))
                .andExpect(jsonPath("$.price").value(25.99));
    }

    @Test
    void findById_NotFound() throws Exception {
        when(productService.findById(999L)).thenThrow(new RuntimeException("Product not found with id: 999"));

        assertThrows(ServletException.class, () -> mockMvc.perform(get("/products/999")));
    }

    @Test
    void deleteById_Success() throws Exception {
        doNothing().when(productService).deleteById(1L);

        mockMvc.perform(delete("/products/1"))
                .andExpect(status().isNoContent());
    }
}