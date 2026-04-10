package com.ecommerce.product.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductCreateDTO {
    private String name;
    private String description;
    private Double price;
    private Integer stock;
    private Long categoryId;
}
