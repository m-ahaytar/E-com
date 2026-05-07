package com.ecommerce.product.facade;

import com.ecommerce.product.dto.ProductDTO;
import com.ecommerce.product.entity.Category;
import com.ecommerce.product.entity.Deal;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.repository.CategoryRepository;
import com.ecommerce.product.repository.DealRepository;
import com.ecommerce.product.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

/**
 * Facade for assembling complete product details from multiple services/repositories.
 * This simplifies the client interaction by providing a single unified interface
 * to retrieve comprehensive product information.
 */
@Service
public class ProductDetailFacade {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final DealRepository dealRepository;
    
    public ProductDetailFacade(ProductRepository productRepository,
                             CategoryRepository categoryRepository,
                             DealRepository dealRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.dealRepository = dealRepository;
    }
    
    /**
     * Get complete product details by product ID.
     * Assembles information from product, category, and deal repositories.
     * 
     * @param productId the product ID
     * @return complete product detail response
     */
    public ProductDetailResponse getProductDetails(Long productId) {
        Product product = productRepository.findById(productId)
            .orElseThrow(() -> new RuntimeException("Product not found"));
        
        // Get category information
        String categoryName = null;
        Long categoryId = null;
        if (product.getCategory() != null) {
            categoryName = product.getCategory().getName();
            categoryId = product.getCategory().getId();
        }
        
        // Get active discount for this product
        Double discountPercentage = null;
        Double discountedPrice = product.getPrice();
        Optional<Deal> activeDeal = dealRepository.findActiveDeals(LocalDateTime.now())
            .stream()
            .filter(deal -> deal.getProduct().getId().equals(productId))
            .findFirst();
        
        if (activeDeal.isPresent()) {
            discountPercentage = activeDeal.get().getDiscountPercentage();
            discountedPrice = product.getPrice() * (1 - discountPercentage / 100.0);
        }
        
        // Determine stock availability
        Boolean inStock = product.getStock() > 0;
        
        // Get available regions (simplified for demonstration)
        List<String> availableRegions = getAvailableRegions(product);
        
        return new ProductDetailResponse(
            product.getId(),
            product.getName(),
            product.getDescription(),
            product.getPrice(),
            product.getStock(),
            product.getImageUrl(),
            categoryName,
            categoryId,
            discountPercentage,
            discountedPrice,
            inStock,
            availableRegions
        );
    }
    
    /**
     * Get product details by SKU or product name (simplified search).
     * @param productName the product name to search for
     * @return complete product detail response
     */
    public ProductDetailResponse getProductDetailsByName(String productName) {
        // In a real implementation, this would query the product repository
        // For now, we return a placeholder approach
        throw new RuntimeException("Search by name not yet implemented");
    }
    
    /**
     * Helper method to determine available regions based on product and category.
     * @param product the product
     * @return list of available region names
     */
    private List<String> getAvailableRegions(Product product) {
        // Simplified: return default regions
        // In a real implementation, this could be based on product location or warehouse inventory
        return Arrays.asList("US", "EU", "ASIA");
    }
}
