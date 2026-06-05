package com.ecommerce.product;

import com.ecommerce.product.entity.Deal;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.repository.DealRepository;
import com.ecommerce.product.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Random;

@Component
public class DealDataSeeder implements CommandLineRunner {

    private final DealRepository dealRepository;
    private final ProductRepository productRepository;
    private final Random random = new Random();

    public DealDataSeeder(DealRepository dealRepository, ProductRepository productRepository) {
        this.dealRepository = dealRepository;
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        if (dealRepository.count() > 0) {
            return;
        }

        List<Product> allProducts = productRepository.findAll();
        if (allProducts.isEmpty()) {
            return;
        }

        Collections.shuffle(allProducts, random);
        int dealCount = Math.min(4, allProducts.size());
        double[] discounts = {25.0, 15.0, 40.0, 30.0};
        LocalDateTime now = LocalDateTime.now();

        for (int i = 0; i < dealCount; i++) {
            seedDeal(
                allProducts.get(i),
                discounts[i],
                now.minusDays(i + 1),
                now.plusDays(7 - i)
            );
        }
    }

    private void seedDeal(Product product, Double discount, LocalDateTime start, LocalDateTime end) {
        Deal deal = new Deal();
        deal.setProduct(product);
        deal.setDiscountPercentage(discount);
        deal.setStartDate(start);
        deal.setEndDate(end);
        dealRepository.save(deal);
    }
}
