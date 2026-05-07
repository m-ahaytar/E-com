package com.ecommerce.product;

import com.ecommerce.product.entity.Deal;
import com.ecommerce.product.repository.DealRepository;
import com.ecommerce.product.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DealDataSeeder implements CommandLineRunner {

    private final DealRepository dealRepository;
    private final ProductRepository productRepository;

    public DealDataSeeder(DealRepository dealRepository, ProductRepository productRepository) {
        this.dealRepository = dealRepository;
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        if (dealRepository.count() > 0) {
            return;
        }

        LocalDateTime now = LocalDateTime.now();

        seedDeal(1L, 25.0, now.minusDays(1), now.plusDays(7));
        seedDeal(2L, 15.0, now.minusDays(2), now.plusDays(3));
        seedDeal(3L, 40.0, now, now.plusDays(1));
        seedDeal(4L, 30.0, now.minusDays(1), now.plusDays(2));
    }

    private void seedDeal(Long productId, Double discount, LocalDateTime start, LocalDateTime end) {
        productRepository.findById(productId).ifPresent(product -> {
            Deal deal = new Deal();
            deal.setProduct(product);
            deal.setDiscountPercentage(discount);
            deal.setStartDate(start);
            deal.setEndDate(end);
            dealRepository.save(deal);
        });
    }
}
