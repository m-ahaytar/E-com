package com.ecommerce.order.repository;

import com.ecommerce.order.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByOwner(String owner);
    Optional<CartItem> findByOwnerAndProductId(String owner, Long productId);
    void deleteByOwner(String owner);
}
