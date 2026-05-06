package com.ecommerce.order.controller;

import com.ecommerce.order.dto.CartDTO;
import com.ecommerce.order.dto.CartItemDTO;
import com.ecommerce.order.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<CartDTO> getCart(Authentication authentication) {
        return ResponseEntity.ok(cartService.getCart(owner(authentication)));
    }

    @PostMapping("/items")
    public ResponseEntity<CartDTO> addItem(Authentication authentication, @RequestBody CartItemDTO item) {
        return ResponseEntity.ok(cartService.addItem(owner(authentication), item));
    }

    @PutMapping("/items/{productId}")
    public ResponseEntity<CartDTO> updateQuantity(
            Authentication authentication,
            @PathVariable Long productId,
            @RequestBody CartItemDTO item
    ) {
        return ResponseEntity.ok(cartService.updateQuantity(owner(authentication), productId, item.getQuantity()));
    }

    @DeleteMapping("/items/{productId}")
    public ResponseEntity<CartDTO> removeItem(Authentication authentication, @PathVariable Long productId) {
        return ResponseEntity.ok(cartService.removeItem(owner(authentication), productId));
    }

    @DeleteMapping
    public ResponseEntity<CartDTO> clear(Authentication authentication) {
        return ResponseEntity.ok(cartService.clear(owner(authentication)));
    }

    private String owner(Authentication authentication) {
        return authentication.getName();
    }
}
