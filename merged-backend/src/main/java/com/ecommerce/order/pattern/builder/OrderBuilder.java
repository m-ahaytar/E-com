package com.ecommerce.order.pattern.builder;

import com.ecommerce.order.dto.CreateOrderDTO;
import com.ecommerce.order.entity.Order;
import com.ecommerce.order.entity.OrderItem;

import java.time.LocalDateTime;
import java.util.List;

// Builder: construction progressive d'une commande avec ses lignes.
public class OrderBuilder {

    private final Order order;

    public OrderBuilder() {
        this.order = new Order();
    }

    public OrderBuilder withUserId(Long userId) {
        order.setUserId(userId);
        return this;
    }

    public OrderBuilder withStatus(String status) {
        order.setStatus(status);
        return this;
    }

    public OrderBuilder withCreatedAt(LocalDateTime createdAt) {
        order.setOrderDate(createdAt);
        return this;
    }

    public OrderBuilder withItems(List<CreateOrderDTO.CreateOrderItemDTO> itemDTOs) {
        if (itemDTOs == null) {
            return this;
        }

        double total = 0.0;
        for (CreateOrderDTO.CreateOrderItemDTO itemDTO : itemDTOs) {
            OrderItem item = new OrderItem();
            item.setProductId(itemDTO.getProductId());
            item.setProductName(itemDTO.getProductName());
            item.setQuantity(itemDTO.getQuantity());
            item.setPrice(itemDTO.getPrice());
            order.addItem(item);

            total += itemDTO.getPrice() * itemDTO.getQuantity();
        }

        order.setTotalAmount(total);
        return this;
    }

    public Order build() {
        return order;
    }
}
