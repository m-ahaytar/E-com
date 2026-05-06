package com.ecommerce.order.service;

import com.ecommerce.order.dto.CartDTO;
import com.ecommerce.order.dto.CartItemDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CartService {
    private final Map<String, Map<Long, CartItemDTO>> carts = new ConcurrentHashMap<>();

    public CartDTO getCart(String owner) {
        return toCartDTO(carts.getOrDefault(owner, new ConcurrentHashMap<>()));
    }

    public CartDTO addItem(String owner, CartItemDTO incomingItem) {
        Map<Long, CartItemDTO> cart = carts.computeIfAbsent(owner, key -> new ConcurrentHashMap<>());
        Long productId = incomingItem.getProductId();
        CartItemDTO existing = cart.get(productId);

        if (existing == null) {
            incomingItem.setQuantity(safeQuantity(incomingItem.getQuantity()));
            cart.put(productId, incomingItem);
        } else {
            existing.setQuantity(existing.getQuantity() + safeQuantity(incomingItem.getQuantity()));
        }

        return toCartDTO(cart);
    }

    public CartDTO updateQuantity(String owner, Long productId, Integer quantity) {
        Map<Long, CartItemDTO> cart = carts.computeIfAbsent(owner, key -> new ConcurrentHashMap<>());
        CartItemDTO existing = cart.get(productId);

        if (existing != null) {
            existing.setQuantity(safeQuantity(quantity));
        }

        return toCartDTO(cart);
    }

    public CartDTO removeItem(String owner, Long productId) {
        Map<Long, CartItemDTO> cart = carts.computeIfAbsent(owner, key -> new ConcurrentHashMap<>());
        cart.remove(productId);
        return toCartDTO(cart);
    }

    public CartDTO clear(String owner) {
        carts.remove(owner);
        return new CartDTO();
    }

    private CartDTO toCartDTO(Map<Long, CartItemDTO> cart) {
        return new CartDTO(new ArrayList<>(cart.values()));
    }

    private int safeQuantity(Integer quantity) {
        return Math.max(1, quantity == null ? 1 : quantity);
    }
}
