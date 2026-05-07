package com.ecommerce.product.repository;

import com.ecommerce.product.entity.Deal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DealRepository extends JpaRepository<Deal, Long> {

    @Query("SELECT d FROM Deal d WHERE d.startDate <= :now AND d.endDate >= :now ORDER BY d.endDate ASC")
    List<Deal> findActiveDeals(@Param("now") LocalDateTime now);

    @Query("SELECT d FROM Deal d WHERE d.product.id = :productId AND d.startDate <= :now AND d.endDate >= :now ORDER BY d.discountPercentage DESC")
    List<Deal> findActiveDealsForProduct(@Param("productId") Long productId, @Param("now") LocalDateTime now);

    List<Deal> findAllByOrderByStartDateDesc();
}
