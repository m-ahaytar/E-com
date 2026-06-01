package com.ecommerce.product.service;

import com.ecommerce.product.dto.DealCreateDTO;
import com.ecommerce.product.dto.DealDTO;
import com.ecommerce.product.entity.Deal;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.repository.DealRepository;
import com.ecommerce.product.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DealService {

    private final DealRepository dealRepository;
    private final ProductRepository productRepository;

    public DealService(DealRepository dealRepository, ProductRepository productRepository) {
        this.dealRepository = dealRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<DealDTO> getActiveDeals() {
        LocalDateTime now = LocalDateTime.now();
        List<Deal> deals = dealRepository.findActiveDeals(now);

        Map<Long, Deal> bestPerProduct = new LinkedHashMap<>();
        for (Deal deal : deals) {
            Long productId = deal.getProduct().getId();
            Deal existing = bestPerProduct.get(productId);
            if (existing == null || deal.getDiscountPercentage() > existing.getDiscountPercentage()) {
                bestPerProduct.put(productId, deal);
            }
        }

        return bestPerProduct.values().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<DealDTO> getBestActiveDealForProduct(Long productId) {
        LocalDateTime now = LocalDateTime.now();
        List<Deal> deals = dealRepository.findActiveDealsForProduct(productId, now);
        return deals.stream().findFirst().map(this::toDTO);
    }

    @Transactional(readOnly = true)
    public List<DealDTO> getAllDeals() {
        return dealRepository.findAllByOrderByStartDateDesc().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public DealDTO getDeal(Long id) {
        Deal deal = dealRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Deal not found with id: " + id));
        return toDTO(deal);
    }

    @Transactional
    public DealDTO createDeal(DealCreateDTO dto) {
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found with id: " + dto.getProductId()));

        if (!dto.getEndDate().isAfter(dto.getStartDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "endDate must be after startDate");
        }

        checkSellerOwnership(product);

        Deal deal = new Deal();
        deal.setProduct(product);
        deal.setDiscountPercentage(dto.getDiscountPercentage());
        deal.setStartDate(dto.getStartDate());
        deal.setEndDate(dto.getEndDate());

        Deal saved = dealRepository.save(deal);
        return toDTO(saved);
    }

    @Transactional
    public DealDTO updateDeal(Long id, DealCreateDTO dto) {
        Deal deal = dealRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Deal not found with id: " + id));

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found with id: " + dto.getProductId()));

        if (!dto.getEndDate().isAfter(dto.getStartDate())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "endDate must be after startDate");
        }

        checkSellerOwnership(product);

        deal.setProduct(product);
        deal.setDiscountPercentage(dto.getDiscountPercentage());
        deal.setStartDate(dto.getStartDate());
        deal.setEndDate(dto.getEndDate());

        Deal updated = dealRepository.save(deal);
        return toDTO(updated);
    }

    @Transactional
    public void deleteDeal(Long id) {
        Deal deal = dealRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Deal not found with id: " + id));

        checkSellerOwnership(deal.getProduct());

        dealRepository.delete(deal);
    }

    private void checkSellerOwnership(Product product) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_SELLER"))) {
            String authenticatedEmail = auth.getName();
            if (!product.getSellerEmail().equals(authenticatedEmail)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only manage deals for your own products");
            }
        }
    }

    private DealDTO toDTO(Deal deal) {
        LocalDateTime now = LocalDateTime.now();
        boolean active = !deal.getStartDate().isAfter(now) && !deal.getEndDate().isBefore(now);
        Double originalPrice = deal.getProduct().getPrice();
        Double discountedPrice = Math.round((originalPrice - originalPrice * deal.getDiscountPercentage() / 100.0) * 100.0) / 100.0;

        return new DealDTO(
                deal.getId(),
                deal.getProduct().getId(),
                deal.getProduct().getName(),
                deal.getProduct().getImageUrl(),
                originalPrice,
                deal.getDiscountPercentage(),
                discountedPrice,
                deal.getStartDate(),
                deal.getEndDate(),
                active
        );
    }
}
