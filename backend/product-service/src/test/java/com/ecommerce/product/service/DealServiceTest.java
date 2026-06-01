package com.ecommerce.product.service;

import com.ecommerce.product.dto.DealCreateDTO;
import com.ecommerce.product.dto.DealDTO;
import com.ecommerce.product.entity.Deal;
import com.ecommerce.product.entity.Product;
import com.ecommerce.product.repository.DealRepository;
import com.ecommerce.product.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
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

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

@ExtendWith(MockitoExtension.class)
@DisplayName("DealService Tests")
@Tag("unit")
@Tag("fast")
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
        product.setSellerEmail("seller@demo.com");

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

    @Nested
    @DisplayName("Retrieve Deal Tests")
    class RetrieveDealTests {
        @Test
        @DisplayName("get active deals filters and keeps highest discount per product")
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
            assertAll(
                () -> assertEquals(2, results.size(), "Should return 2 deals (one per product)"),
                () -> {
                    DealDTO product1Deal = results.stream()
                        .filter(d -> d.getProductId().equals(1L))
                        .findFirst()
                        .orElse(null);
                    assertNotNull(product1Deal, "Should have deal for product 1");
                    assertEquals(15, product1Deal.getDiscountPercentage(), "Should keep highest discount (15% > 10%)");
                }
            );
        }

        @Test
        @DisplayName("get all deals returns list ordered by start date")
        void getAllDeals_returnsListOrderedByStartDate() {
            // Arrange
            when(dealRepository.findAllByOrderByStartDateDesc()).thenReturn(Arrays.asList(deal2, deal1));

            // Act
            List<DealDTO> results = dealService.getAllDeals();

            // Assert
            assertAll(
                () -> assertEquals(2, results.size(), "Should return 2 deals"),
                () -> verify(dealRepository).findAllByOrderByStartDateDesc()
            );
        }

        @Test
        @DisplayName("get deal by valid ID returns correct deal")
        void getDeal_validId_returnsDeal() {
            // Arrange
            when(dealRepository.findById(1L)).thenReturn(Optional.of(deal1));

            // Act
            DealDTO result = dealService.getDeal(1L);

            // Assert
            assertAll(
                () -> assertNotNull(result, "Deal should not be null"),
                () -> assertEquals(1L, result.getId(), "Deal ID should match"),
                () -> assertEquals(10, result.getDiscountPercentage(), "Discount percentage should match")
            );
        }

        @Test
        @DisplayName("get deal by invalid ID throws ResponseStatusException")
        void getDeal_invalidId_throws() {
            // Arrange
            when(dealRepository.findById(999L)).thenReturn(Optional.empty());

            // Act & Assert
            ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> dealService.getDeal(999L),
                "Should throw ResponseStatusException for invalid deal ID"
            );
            assertTrue(exception.getReason().contains("Deal not found"), 
                "Exception reason should mention 'Deal not found'");
        }

        @ParameterizedTest
        @ValueSource(longs = { 1L, 2L, 10L })
        @DisplayName("get deal with various IDs")
        void getDeal_variousIds(Long dealId) {
            // Arrange
            LocalDateTime now = LocalDateTime.now();
            Deal testDeal = new Deal();
            testDeal.setId(dealId);
            testDeal.setProduct(product);
            testDeal.setDiscountPercentage(10.0);
            testDeal.setStartDate(now.minusDays(1));
            testDeal.setEndDate(now.plusDays(7));
            when(dealRepository.findById(dealId)).thenReturn(Optional.of(testDeal));

            // Act
            DealDTO result = dealService.getDeal(dealId);

            // Assert
            assertNotNull(result, "Should find deal with ID " + dealId);
            assertEquals(dealId, result.getId());
        }
    }

    @Nested
    @DisplayName("Create Deal Tests")
    class CreateDealTests {
        @Test
        @DisplayName("create deal with valid DTO creates deal successfully")
        void createDeal_validDTO_createsDeal() {
            // Arrange
            Authentication auth = new UsernamePasswordAuthenticationToken(
                "seller@demo.com", null,
                List.of(new SimpleGrantedAuthority("ROLE_SELLER"))
            );
            SecurityContextHolder.getContext().setAuthentication(auth);

            when(productRepository.findById(1L)).thenReturn(Optional.of(product));
            when(dealRepository.save(any(Deal.class))).thenReturn(deal1);

            // Act
            DealDTO result = dealService.createDeal(createDTO);

            // Assert
            assertAll(
                () -> assertNotNull(result, "Created deal should not be null"),
                () -> assertEquals(10, result.getDiscountPercentage(), "Discount percentage should match"),
                () -> verify(productRepository).findById(1L),
                () -> verify(dealRepository).save(any(Deal.class))
            );
            SecurityContextHolder.clearContext();
        }

        @Test
        @DisplayName("create deal with non-existent product throws exception")
        void createDeal_productNotFound_throws() {
            // Arrange
            when(productRepository.findById(1L)).thenReturn(Optional.empty());

            // Act & Assert
            ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> dealService.createDeal(createDTO),
                "Should throw ResponseStatusException when product not found"
            );
            assertTrue(exception.getReason().contains("Product not found"), 
                "Exception reason should mention 'Product not found'");
            verify(dealRepository, never()).save(any(Deal.class));
        }

        @Test
        @DisplayName("create deal with end date before start date throws exception")
        void createDeal_endBeforeStart_throws() {
            // Arrange
            LocalDateTime now = LocalDateTime.now();
            createDTO.setStartDate(now.plusDays(5));
            createDTO.setEndDate(now.plusDays(1));

            when(productRepository.findById(1L)).thenReturn(Optional.of(product));

            // Act & Assert
            ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> dealService.createDeal(createDTO),
                "Should throw ResponseStatusException when end date is before start date"
            );
            assertTrue(exception.getReason().contains("endDate must be after startDate"), 
                "Exception reason should mention date validation");
            verify(dealRepository, never()).save(any(Deal.class));
        }

        @Test
        @DisplayName("create deal with equal start and end dates throws exception")
        void createDeal_endEqualToStart_throws() {
            // Arrange
            LocalDateTime now = LocalDateTime.now();
            createDTO.setStartDate(now.plusDays(5));
            createDTO.setEndDate(now.plusDays(5));

            when(productRepository.findById(1L)).thenReturn(Optional.of(product));

            // Act & Assert
            ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> dealService.createDeal(createDTO),
                "Should throw ResponseStatusException when dates are equal"
            );
            assertTrue(exception.getReason().contains("endDate must be after startDate"), 
                "Exception reason should mention date validation");
        }

        @ParameterizedTest
        @ValueSource(doubles = { 5.0, 10.0, 25.0, 50.0 })
        @DisplayName("create deal with various discount percentages")
        void createDeal_multipleDiscountPercentages(double discountPercentage) {
            // Arrange
            Authentication auth = new UsernamePasswordAuthenticationToken(
                "seller@demo.com", null,
                List.of(new SimpleGrantedAuthority("ROLE_SELLER"))
            );
            SecurityContextHolder.getContext().setAuthentication(auth);

            LocalDateTime now = LocalDateTime.now();
            createDTO.setDiscountPercentage(discountPercentage);
            Deal testDeal = new Deal();
            testDeal.setId(1L);
            testDeal.setProduct(product);
            testDeal.setDiscountPercentage(discountPercentage);
            testDeal.setStartDate(now.minusDays(1));
            testDeal.setEndDate(now.plusDays(7));
            when(productRepository.findById(1L)).thenReturn(Optional.of(product));
            when(dealRepository.save(any(Deal.class))).thenReturn(testDeal);

            // Act
            DealDTO result = dealService.createDeal(createDTO);

            // Assert
            assertNotNull(result, "Should create deal with " + discountPercentage + "% discount");
            assertEquals(discountPercentage, result.getDiscountPercentage());
            SecurityContextHolder.clearContext();
        }

        @Test
        @DisplayName("create deal when seller does not own product throws forbidden")
        void createDeal_sellerDoesNotOwnProduct_throwsForbidden() {
            // Arrange
            Authentication auth = new UsernamePasswordAuthenticationToken(
                "other@demo.com", null,
                List.of(new SimpleGrantedAuthority("ROLE_SELLER"))
            );
            SecurityContextHolder.getContext().setAuthentication(auth);

            when(productRepository.findById(1L)).thenReturn(Optional.of(product));

            // Act & Assert
            ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> dealService.createDeal(createDTO),
                "Should throw ResponseStatusException when seller does not own product"
            );
            assertEquals(org.springframework.http.HttpStatus.FORBIDDEN, exception.getStatusCode());
            assertTrue(exception.getReason().contains("You can only manage deals for your own products"),
                "Exception reason should mention product ownership");
            verify(dealRepository, never()).save(any(Deal.class));
            SecurityContextHolder.clearContext();
        }
    }

    @Nested
    @DisplayName("Update Deal Tests")
    class UpdateDealTests {
        @Test
        @DisplayName("update deal with valid DTO updates deal successfully")
        void updateDeal_validDTO_updatesDeal() {
            // Arrange
            Authentication auth = new UsernamePasswordAuthenticationToken(
                "seller@demo.com", null,
                List.of(new SimpleGrantedAuthority("ROLE_SELLER"))
            );
            SecurityContextHolder.getContext().setAuthentication(auth);

            when(dealRepository.findById(1L)).thenReturn(Optional.of(deal1));
            when(productRepository.findById(1L)).thenReturn(Optional.of(product));
            when(dealRepository.save(any(Deal.class))).thenReturn(deal1);

            createDTO.setDiscountPercentage(20.0);

            // Act
            DealDTO result = dealService.updateDeal(1L, createDTO);

            // Assert
            assertAll(
                () -> assertNotNull(result, "Updated deal should not be null"),
                () -> verify(dealRepository).findById(1L),
                () -> verify(dealRepository).save(any(Deal.class))
            );
            SecurityContextHolder.clearContext();
        }
    }

    @Nested
    @DisplayName("Delete Deal Tests")
    class DeleteDealTests {
        @Test
        @DisplayName("delete deal by valid ID deletes deal successfully")
        void deleteDeal_validId_deletesDeal() {
            // Arrange
            Authentication auth = new UsernamePasswordAuthenticationToken(
                "seller@demo.com", null,
                List.of(new SimpleGrantedAuthority("ROLE_SELLER"))
            );
            SecurityContextHolder.getContext().setAuthentication(auth);

            when(dealRepository.findById(1L)).thenReturn(Optional.of(deal1));

            // Act
            dealService.deleteDeal(1L);

            // Assert
            verify(dealRepository).delete(deal1);
            SecurityContextHolder.clearContext();
        }

        @Test
        @DisplayName("delete deal by invalid ID throws ResponseStatusException")
        void deleteDeal_invalidId_throws() {
            // Arrange
            when(dealRepository.findById(999L)).thenReturn(Optional.empty());

            // Act & Assert
            ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> dealService.deleteDeal(999L),
                "Should throw ResponseStatusException for invalid deal ID"
            );
            assertTrue(exception.getReason().contains("Deal not found"), 
                "Exception reason should mention 'Deal not found'");
            verify(dealRepository, never()).delete(any(Deal.class));
        }
    }
}
