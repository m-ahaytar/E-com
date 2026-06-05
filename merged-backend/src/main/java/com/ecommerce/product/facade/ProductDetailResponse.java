package com.ecommerce.product.facade;

import java.util.List;

/**
 * Response record for product detail facade.
 * Encapsulates all product information in a single comprehensive view.
 */
public record ProductDetailResponse(
    Long id,
    String name,
    String description,
    Double price,
    Integer stock,
    String imageUrl,
    String categoryName,
    Long categoryId,
    Double discountPercentage,
    Double discountedPrice,
    Boolean inStock,
    List<String> availableRegions
) {}
