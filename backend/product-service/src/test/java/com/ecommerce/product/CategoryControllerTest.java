package com.ecommerce.product;

import com.ecommerce.product.controller.CategoryController;
import com.ecommerce.product.dto.CategoryDTO;
import com.ecommerce.product.service.CategoryService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CategoryController.class)
class CategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CategoryService categoryService;

    @Test
    void findAll_Success() throws Exception {
        CategoryDTO category1 = new CategoryDTO(1L, "Electronics");
        CategoryDTO category2 = new CategoryDTO(2L, "Clothing");
        List<CategoryDTO> categories = Arrays.asList(category1, category2);

        when(categoryService.findAll()).thenReturn(categories);

        mockMvc.perform(get("/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Electronics"))
                .andExpect(jsonPath("$[1].id").value(2))
                .andExpect(jsonPath("$[1].name").value("Clothing"));
    }

    @Test
    void findById_Success() throws Exception {
        CategoryDTO category = new CategoryDTO(1L, "Electronics");

        when(categoryService.findById(1L)).thenReturn(category);

        mockMvc.perform(get("/categories/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Electronics"));
    }

    @Test
    void save_Success() throws Exception {
        CategoryDTO newCategory = new CategoryDTO(null, "Books");
        CategoryDTO savedCategory = new CategoryDTO(3L, "Books");

        when(categoryService.save(any(CategoryDTO.class))).thenReturn(savedCategory);

        mockMvc.perform(post("/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"name\":\"Books\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(3))
                .andExpect(jsonPath("$.name").value("Books"));
    }

    @Test
    void update_Success() throws Exception {
        CategoryDTO updateCategory = new CategoryDTO(1L, "Updated Electronics");
        CategoryDTO updatedCategory = new CategoryDTO(1L, "Updated Electronics");

        when(categoryService.update(eq(1L), any(CategoryDTO.class))).thenReturn(updatedCategory);

        mockMvc.perform(put("/categories/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"id\":1,\"name\":\"Updated Electronics\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Updated Electronics"));
    }

    @Test
    void deleteById_Success() throws Exception {
        doNothing().when(categoryService).deleteById(1L);

        mockMvc.perform(delete("/categories/1"))
                .andExpect(status().isNoContent());
    }
}