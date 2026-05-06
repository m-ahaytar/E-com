package com.ecommerce.order.dto;

import java.util.ArrayList;
import java.util.List;

public class CartDTO {
    private List<CartItemDTO> items = new ArrayList<>();
    private Double total = 0.0;

    public CartDTO() {
    }

    public CartDTO(List<CartItemDTO> items) {
        this.items = items;
        this.total = items.stream()
                .mapToDouble(item -> item.getPrice() * item.getQuantity())
                .sum();
    }

    public List<CartItemDTO> getItems() {
        return items;
    }

    public void setItems(List<CartItemDTO> items) {
        this.items = items;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }
}
