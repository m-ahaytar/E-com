package com.ecommerce.order.service;

import com.ecommerce.order.dto.CartDTO;
import com.ecommerce.order.dto.CartItemDTO;
import com.ecommerce.order.entity.CartItem;
import com.ecommerce.order.repository.CartItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartService {
    private final CartItemRepository cartItemRepository;

    public CartService(CartItemRepository cartItemRepository) {
        this.cartItemRepository = cartItemRepository;
    }

    public CartDTO getCart(String owner) {
        return toCartDTO(cartItemRepository.findByOwner(owner));
    }

    @Transactional
    public CartDTO addItem(String owner, CartItemDTO incomingItem) {
        Long productId = incomingItem.getProductId();
        CartItem item = cartItemRepository.findByOwnerAndProductId(owner, productId)
                .orElseGet(() -> {
                    CartItem newItem = new CartItem();
                    newItem.setOwner(owner);
                    newItem.setProductId(productId);
                    newItem.setProductName(incomingItem.getProductName());
                    newItem.setDescription(incomingItem.getDescription());
                    newItem.setPrice(incomingItem.getPrice());
                    newItem.setStock(incomingItem.getStock());
                    newItem.setImageUrl(incomingItem.getImageUrl());
                    newItem.setCategoryId(incomingItem.getCategoryId());
                    newItem.setCategoryName(incomingItem.getCategoryName());
                    newItem.setQuantity(0);
                    return newItem;
                });

        item.setQuantity(item.getQuantity() + safeQuantity(incomingItem.getQuantity()));
        cartItemRepository.save(item);

        return getCart(owner);
    }

    @Transactional
    public CartDTO updateQuantity(String owner, Long productId, Integer quantity) {
        cartItemRepository.findByOwnerAndProductId(owner, productId).ifPresent(item -> {
            item.setQuantity(safeQuantity(quantity));
            cartItemRepository.save(item);
        });
        return getCart(owner);
    }

    @Transactional
    public CartDTO removeItem(String owner, Long productId) {
        cartItemRepository.findByOwnerAndProductId(owner, productId).ifPresent(cartItemRepository::delete);
        return getCart(owner);
    }

    @Transactional
    public CartDTO clear(String owner) {
        cartItemRepository.deleteByOwner(owner);
        return new CartDTO();
    }

    private CartDTO toCartDTO(List<CartItem> items) {
        return new CartDTO(items.stream().map(this::toItemDTO).collect(java.util.stream.Collectors.toList()));
    }

    private CartItemDTO toItemDTO(CartItem item) {
        CartItemDTO dto = new CartItemDTO();
        dto.setProductId(item.getProductId());
        dto.setProductName(item.getProductName());
        dto.setDescription(item.getDescription());
        dto.setPrice(item.getPrice());
        dto.setQuantity(item.getQuantity());
        dto.setStock(item.getStock());
        dto.setImageUrl(item.getImageUrl());
        dto.setCategoryId(item.getCategoryId());
        dto.setCategoryName(item.getCategoryName());
        return dto;
    }

    private int safeQuantity(Integer quantity) {
        return Math.max(1, quantity == null ? 1 : quantity);
    }
}
