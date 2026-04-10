package com.ecommerce.product.service;

import com.ecommerce.product.dto.ProductCreateDTO;
import com.ecommerce.product.dto.ProductDTO;
import com.ecommerce.product.entity.Category;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.repository.CategoryRepository;
import com.ecommerce.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Transactional(readOnly = true)
    public List<ProductDTO> findAll() {
        return productRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductDTO findById(Long id) {
        return productRepository.findById(id)
                .map(this::toDTO)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }

    @Transactional
    public ProductDTO save(ProductCreateDTO createDTO) {
        Product product = new Product();
        product.setName(createDTO.getName());
        product.setDescription(createDTO.getDescription());
        product.setPrice(createDTO.getPrice());
        product.setStock(createDTO.getStock());

        Category category = categoryRepository.findById(createDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + createDTO.getCategoryId()));
        product.setCategory(category);

        Product saved = productRepository.save(product);
        return toDTO(saved);
    }

    @Transactional
    public ProductDTO update(Long id, ProductCreateDTO createDTO) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
        
        product.setName(createDTO.getName());
        product.setDescription(createDTO.getDescription());
        product.setPrice(createDTO.getPrice());
        product.setStock(createDTO.getStock());

        Category category = categoryRepository.findById(createDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + createDTO.getCategoryId()));
        product.setCategory(category);

        Product updated = productRepository.save(product);
        return toDTO(updated);
    }

    @Transactional
    public void deleteById(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    private ProductDTO toDTO(Product product) {
        ProductDTO dto = new ProductDTO();
        dto.setId(product.getId());
        dto.setName(product.getName());
        dto.setDescription(product.getDescription());
        dto.setPrice(product.getPrice());
        dto.setStock(product.getStock());
        if (product.getCategory() != null) {
            dto.setCategoryId(product.getCategory().getId());
            dto.setCategoryName(product.getCategory().getName());
        }
        return dto;
    }
}
