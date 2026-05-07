package com.ecommerce.product.service;

import com.ecommerce.product.dto.DealCreateDTO;
import com.ecommerce.product.dto.DealDTO;
import com.ecommerce.product.entity.Deal;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.repository.DealRepository;
import com.ecommerce.product.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DealServiceTest {

    @Mock
    private DealRepository dealRepository;

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private DealService dealService;

    private Deal deal1;
    private Deal deal2;
    private Product product;
    private DealCreateDTO createDTO;

    @BeforeEach
    void setUp() {
        product = new Product();
        product.setId(1L);
        product.setName("Laptop");
        product.setPrice(999.99);
        product.setImageUrl("http://example.com/laptop.jpg");

        LocalDateTime now = LocalDateTime.now();

        deal1 = new Deal();
        deal1.setId(1L);
        deal1.setProduct(product);
        deal1.setDiscountPercentage(10.0);
        deal1.setStartDate(now.minusDays(1));
        deal1.setEndDate(now.plusDays(7));

        deal2 = new Deal();
        deal2.setId(2L);
        deal2.setProduct(product);
        deal2.setDiscountPercentage(15.0);
        deal2.setStartDate(now.minusDays(2));
        deal2.setEndDate(now.plusDays(5));

        createDTO = new DealCreateDTO();
        createDTO.setProductId(1L);
        createDTO.setDiscountPercentage(10.0);
        createDTO.setStartDate(now.minusDays(1));
        createDTO.setEndDate(now.plusDays(7));
    }

    @Test
    void getActiveDeals_multipleDealsPerProduct_keepsHighestDiscount() {
        // Arrange
        LocalDateTime now = LocalDateTime.now();
        Product product2 = new Product();
        product2.setId(2L);
        product2.setName("Desktop");
        product2.setPrice(1499.99);
        product2.setImageUrl("http://example.com/desktop.jpg");

        Deal deal3 = new Deal();
        deal3.setId(3L);
        deal3.setProduct(product2);
        deal3.setDiscountPercentage(5.0);
        deal3.setStartDate(now.minusDays(1));
        deal3.setEndDate(now.plusDays(7));

        when(dealRepository.findActiveDeals(any(LocalDateTime.class)))
            .thenReturn(Arrays.asList(deal1, deal2, deal3));

        // Act
        List<DealDTO> results = dealService.getActiveDeals();

        // Assert
        assertEquals(2, results.size());
        // For product 1, deal2 has higher discount (15% > 10%)
        DealDTO product1Deal = results.stream()
            .filter(d -> d.getProductId().equals(1L))
            .findFirst()
            .orElse(null);
        assertNotNull(product1Deal);
        assertEquals(15, product1Deal.getDiscountPercentage());
    }

    @Test
    void getAllDeals_returnsListOrderedByStartDate() {
        // Arrange
        when(dealRepository.findAllByOrderByStartDateDesc()).thenReturn(Arrays.asList(deal2, deal1));

        // Act
        List<DealDTO> results = dealService.getAllDeals();

        // Assert
        assertEquals(2, results.size());
        verify(dealRepository).findAllByOrderByStartDateDesc();
    }

    @Test
    void getDeal_validId_returnsDeal() {
        // Arrange
        when(dealRepository.findById(1L)).thenReturn(Optional.of(deal1));

        // Act
        DealDTO result = dealService.getDeal(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(10, result.getDiscountPercentage());
    }

    @Test
    void getDeal_invalidId_throws() {
        // Arrange
        when(dealRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class,
            () -> dealService.getDeal(999L)
        );
        assertEquals("Deal not found with id: 999", exception.getReason());
    }

    @Test
    void createDeal_validDTO_createsDeal() {
        // Arrange
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(dealRepository.save(any(Deal.class))).thenReturn(deal1);

        // Act
        DealDTO result = dealService.createDeal(createDTO);

        // Assert
        assertNotNull(result);
        assertEquals(10, result.getDiscountPercentage());
        verify(productRepository).findById(1L);
        verify(dealRepository).save(any(Deal.class));
    }

    @Test
    void createDeal_productNotFound_throws() {
        // Arrange
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class,
            () -> dealService.createDeal(createDTO)
        );
        assertEquals("Product not found with id: 1", exception.getReason());
        verify(dealRepository, never()).save(any(Deal.class));
    }

    @Test
    void createDeal_endBeforeStart_throws() {
        // Arrange
        LocalDateTime now = LocalDateTime.now();
        createDTO.setStartDate(now.plusDays(5));
        createDTO.setEndDate(now.plusDays(1));

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        // Act & Assert
        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class,
            () -> dealService.createDeal(createDTO)
        );
        assertEquals("endDate must be after startDate", exception.getReason());
        verify(dealRepository, never()).save(any(Deal.class));
    }

    @Test
    void createDeal_endEqualToStart_throws() {
        // Arrange
        LocalDateTime now = LocalDateTime.now();
        createDTO.setStartDate(now.plusDays(5));
        createDTO.setEndDate(now.plusDays(5));

        when(productRepository.findById(1L)).thenReturn(Optional.of(product));

        // Act & Assert
        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class,
            () -> dealService.createDeal(createDTO)
        );
        assertEquals("endDate must be after startDate", exception.getReason());
    }

    @Test
    void updateDeal_validDTO_updatesDeal() {
        // Arrange
        when(dealRepository.findById(1L)).thenReturn(Optional.of(deal1));
        when(productRepository.findById(1L)).thenReturn(Optional.of(product));
        when(dealRepository.save(any(Deal.class))).thenReturn(deal1);

        createDTO.setDiscountPercentage(20.0);

        // Act
        DealDTO result = dealService.updateDeal(1L, createDTO);

        // Assert
        assertNotNull(result);
        verify(dealRepository).findById(1L);
        verify(dealRepository).save(any(Deal.class));
    }

    @Test
    void deleteDeal_validId_deletesDeal() {
        // Arrange
        when(dealRepository.findById(1L)).thenReturn(Optional.of(deal1));

        // Act
        dealService.deleteDeal(1L);

        // Assert
        verify(dealRepository).delete(deal1);
    }

    @Test
    void deleteDeal_invalidId_throws() {
        // Arrange
        when(dealRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        ResponseStatusException exception = assertThrows(
            ResponseStatusException.class,
            () -> dealService.deleteDeal(999L)
        );
        assertEquals("Deal not found with id: 999", exception.getReason());
        verify(dealRepository, never()).delete(any(Deal.class));
    }
}
