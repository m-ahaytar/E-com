package com.ecommerce.product.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class DealCreateDTO {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotNull(message = "Discount percentage is required")
    @DecimalMin(value = "1.0", message = "Discount must be at least 1%")
    @DecimalMax(value = "100.0", message = "Discount cannot exceed 100%")
    private Double discountPercentage;

    @NotNull(message = "Start date is required")
    private LocalDateTime startDate;

    @NotNull(message = "End date is required")
    private LocalDateTime endDate;

    public DealCreateDTO() {
    }

    public DealCreateDTO(Long productId, Double discountPercentage, LocalDateTime startDate, LocalDateTime endDate) {
        this.productId = productId;
        this.discountPercentage = discountPercentage;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public Double getDiscountPercentage() {
        return discountPercentage;
    }

    public void setDiscountPercentage(Double discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    public LocalDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDateTime startDate) {
        this.startDate = startDate;
    }

    public LocalDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDateTime endDate) {
        this.endDate = endDate;
    }
}
