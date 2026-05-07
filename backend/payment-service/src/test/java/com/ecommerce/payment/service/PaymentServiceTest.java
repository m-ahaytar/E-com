package com.ecommerce.payment.service;

import com.ecommerce.payment.dto.PaymentDTO;
import com.ecommerce.payment.dto.PaymentRequest;
import com.ecommerce.payment.dto.PaymentUpdateRequest;
import com.ecommerce.payment.entity.Payment;
import com.ecommerce.payment.pattern.adapter.PaymentRequestAdapterByComposition;
import com.ecommerce.payment.pattern.adapter.PaymentRequestAdapterByInheritance;
import com.ecommerce.payment.pattern.decorator.PaymentAuditDecorator;
import com.ecommerce.payment.pattern.decorator.PaymentProcessor;
import com.ecommerce.payment.pattern.factory.PaymentStrategyFactory;
import com.ecommerce.payment.pattern.proxy.PaymentRepositoryProxy;
import com.ecommerce.payment.repository.PaymentRepository;
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

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("PaymentService Tests")
@Tag("unit")
@Tag("fast")
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    @InjectMocks
    private PaymentService paymentService;
    
    private Payment payment;
    private PaymentRequest paymentRequest;

    @BeforeEach
    void setUp() {
        payment = new Payment();
        payment.setId(1L);
        payment.setOrderId(100L);
        payment.setMethod("CARD");
        payment.setStatus("COMPLETED");
        payment.setAmount(100.0);
        payment.setTimestamp(LocalDateTime.now());

        paymentRequest = new PaymentRequest();
        paymentRequest.setOrderId(100L);
        paymentRequest.setMethod("CARD");
        paymentRequest.setAmount(100.0);
    }

    @Nested
    @DisplayName("Process Payment Tests")
    class ProcessPaymentTests {
        @Test
        @DisplayName("process card payment sets status to COMPLETED")
        void processPayment_card_setsCompleted() {
            // Arrange
            paymentRequest.setMethod("CARD");
            Payment savedPayment = new Payment();
            savedPayment.setId(1L);
            savedPayment.setOrderId(100L);
            savedPayment.setMethod("CARD");
            savedPayment.setStatus("COMPLETED");
            savedPayment.setAmount(100.0);
            savedPayment.setTimestamp(LocalDateTime.now());

            when(paymentRepository.save(any(Payment.class))).thenReturn(savedPayment);

            // Act
            PaymentDTO result = paymentService.processPayment(paymentRequest);

            // Assert
            assertAll(
                () -> assertNotNull(result, "Payment should not be null"),
                () -> assertEquals(100L, result.getOrderId(), "Order ID should match"),
                () -> assertEquals("CARD", result.getMethod(), "Payment method should be CARD"),
                () -> assertEquals("COMPLETED", result.getStatus(), "Status should be COMPLETED"),
                () -> assertEquals(100.0, result.getAmount(), "Amount should match"),
                () -> verify(paymentRepository).save(any(Payment.class))
            );
        }

        @Test
        @DisplayName("process cash payment sets status to PENDING")
        void processPayment_cash_setsPending() {
            // Arrange
            paymentRequest.setMethod("CASH");
            Payment savedPayment = new Payment();
            savedPayment.setId(2L);
            savedPayment.setOrderId(100L);
            savedPayment.setMethod("CASH");
            savedPayment.setStatus("PENDING");
            savedPayment.setAmount(100.0);
            savedPayment.setTimestamp(LocalDateTime.now());

            when(paymentRepository.save(any(Payment.class))).thenReturn(savedPayment);

            // Act
            PaymentDTO result = paymentService.processPayment(paymentRequest);

            // Assert
            assertAll(
                () -> assertNotNull(result, "Payment should not be null"),
                () -> assertEquals(100L, result.getOrderId(), "Order ID should match"),
                () -> assertEquals("CASH", result.getMethod(), "Payment method should be CASH"),
                () -> assertEquals("PENDING", result.getStatus(), "Status should be PENDING"),
                () -> verify(paymentRepository).save(any(Payment.class))
            );
        }

        @ParameterizedTest
        @ValueSource(strings = { "CARD", "CASH", "PAYPAL" })
        @DisplayName("process payment with various payment methods")
        void processPayment_multiplePaymentMethods(String method) {
            // Arrange
            paymentRequest.setMethod(method);
            Payment savedPayment = new Payment();
            savedPayment.setId(1L);
            savedPayment.setOrderId(100L);
            savedPayment.setMethod(method);
            savedPayment.setStatus("PENDING");
            savedPayment.setAmount(100.0);
            savedPayment.setTimestamp(LocalDateTime.now());
            when(paymentRepository.save(any(Payment.class))).thenReturn(savedPayment);

            // Act
            PaymentDTO result = paymentService.processPayment(paymentRequest);

            // Assert
            assertNotNull(result, "Should process payment for method " + method);
            assertEquals(method, result.getMethod());
        }
    }

    @Nested
    @DisplayName("Retrieve Payment Tests")
    class RetrievePaymentTests {
        @Test
        @DisplayName("get all payments returns list of all payments")
        void getAllPayments_returnsListOfPayments() {
            // Arrange
            Payment payment2 = new Payment();
            payment2.setId(2L);
            payment2.setOrderId(101L);
            payment2.setMethod("CASH");
            payment2.setStatus("PENDING");
            payment2.setAmount(200.0);
            payment2.setTimestamp(LocalDateTime.now());

            when(paymentRepository.findAll()).thenReturn(Arrays.asList(payment, payment2));

            // Act
            List<PaymentDTO> results = paymentService.getAllPayments();

            // Assert
            assertAll(
                () -> assertEquals(2, results.size(), "Should return 2 payments"),
                () -> assertEquals("CARD", results.get(0).getMethod(), "First payment method should be CARD"),
                () -> assertEquals("CASH", results.get(1).getMethod(), "Second payment method should be CASH"),
                () -> verify(paymentRepository).findAll()
            );
        }

        @Test
        @DisplayName("get payment by valid ID returns payment")
        void getPaymentById_validId_returnsPayment() {
            // Arrange
            when(paymentRepository.findById(1L)).thenReturn(Optional.of(payment));

            // Act
            Optional<PaymentDTO> result = paymentService.getPaymentById(1L);

            // Assert
            assertTrue(result.isPresent(), "Payment should be present");
            assertAll(
                () -> assertEquals(1L, result.get().getId(), "Payment ID should match"),
                () -> assertEquals(100L, result.get().getOrderId(), "Order ID should match"),
                () -> verify(paymentRepository).findById(1L)
            );
        }

        @Test
        @DisplayName("get payment by invalid ID returns empty")
        void getPaymentById_invalidId_returnsEmpty() {
            // Arrange
            when(paymentRepository.findById(999L)).thenReturn(Optional.empty());

            // Act
            Optional<PaymentDTO> result = paymentService.getPaymentById(999L);

            // Assert
            assertTrue(result.isEmpty(), "Payment should be empty for invalid ID");
        }

        @Test
        @DisplayName("get payment by valid order ID returns payment")
        void getPaymentByOrderId_validOrderId_returnsPayment() {
            // Arrange
            when(paymentRepository.findByOrderId(100L)).thenReturn(Optional.of(payment));

            // Act
            Optional<PaymentDTO> result = paymentService.getPaymentByOrderId(100L);

            // Assert
            assertTrue(result.isPresent(), "Payment should be present");
            assertAll(
                () -> assertEquals(100L, result.get().getOrderId(), "Order ID should match"),
                () -> verify(paymentRepository).findByOrderId(100L)
            );
        }

        @Test
        @DisplayName("get payment by invalid order ID returns empty")
        void getPaymentByOrderId_invalidOrderId_returnsEmpty() {
            // Arrange
            when(paymentRepository.findByOrderId(999L)).thenReturn(Optional.empty());

            // Act
            Optional<PaymentDTO> result = paymentService.getPaymentByOrderId(999L);

            // Assert
            assertTrue(result.isEmpty(), "Payment should be empty for invalid order ID");
        }

        @ParameterizedTest
        @ValueSource(longs = { 1L, 2L, 5L })
        @DisplayName("get payment with various payment IDs")
        void getPaymentById_variousIds(Long paymentId) {
            // Arrange
            Payment testPayment = new Payment();
            testPayment.setId(paymentId);
            testPayment.setOrderId(100L);
            testPayment.setMethod("CARD");
            when(paymentRepository.findById(paymentId)).thenReturn(Optional.of(testPayment));

            // Act
            Optional<PaymentDTO> result = paymentService.getPaymentById(paymentId);

            // Assert
            assertTrue(result.isPresent(), "Should find payment with ID " + paymentId);
            assertEquals(paymentId, result.get().getId());
        }
    }

    @Nested
    @DisplayName("Update Payment Tests")
    class UpdatePaymentTests {
        @Test
        @DisplayName("update payment with valid request updates payment")
        void updatePayment_validRequest_updatesPayment() {
            // Arrange
            when(paymentRepository.findById(1L)).thenReturn(Optional.of(payment));
            when(paymentRepository.save(any(Payment.class))).thenReturn(payment);

            PaymentUpdateRequest updateRequest = new PaymentUpdateRequest();
            updateRequest.setMethod("CASH");
            updateRequest.setAmount(150.0);
            updateRequest.setStatus("PENDING");

            // Act
            Optional<PaymentDTO> result = paymentService.updatePayment(1L, updateRequest);

            // Assert
            assertTrue(result.isPresent(), "Updated payment should be present");
            assertAll(
                () -> verify(paymentRepository).findById(1L),
                () -> verify(paymentRepository).save(any(Payment.class))
            );
        }

        @Test
        @DisplayName("update payment with invalid ID returns empty")
        void updatePayment_invalidId_returnsEmpty() {
            // Arrange
            when(paymentRepository.findById(999L)).thenReturn(Optional.empty());

            PaymentUpdateRequest updateRequest = new PaymentUpdateRequest();
            updateRequest.setMethod("CASH");

            // Act
            Optional<PaymentDTO> result = paymentService.updatePayment(999L, updateRequest);

            // Assert
            assertTrue(result.isEmpty(), "Updated payment should be empty for invalid ID");
            verify(paymentRepository, never()).save(any(Payment.class));
        }
    }

    @Nested
    @DisplayName("Delete Payment Tests")
    class DeletePaymentTests {
        @Test
        @DisplayName("delete payment by valid ID deletes payment")
        void deletePayment_validId_deletesPayment() {
            // Arrange
            when(paymentRepository.existsById(1L)).thenReturn(true);

            // Act
            boolean result = paymentService.deletePayment(1L);

            // Assert
            assertTrue(result, "Deletion should return true");
            verify(paymentRepository).deleteById(1L);
        }

        @Test
        @DisplayName("delete payment by invalid ID returns false")
        void deletePayment_invalidId_returnsFalse() {
            // Arrange
            when(paymentRepository.existsById(999L)).thenReturn(false);

            // Act
            boolean result = paymentService.deletePayment(999L);

            // Assert
            assertFalse(result, "Deletion should return false for invalid ID");
            verify(paymentRepository, never()).deleteById(anyLong());
        }

        @ParameterizedTest
        @ValueSource(longs = { 1L, 2L, 5L })
        @DisplayName("delete payment with various payment IDs")
        void deletePayment_variousIds(Long paymentId) {
            // Arrange
            when(paymentRepository.existsById(paymentId)).thenReturn(true);

            // Act
            boolean result = paymentService.deletePayment(paymentId);

            // Assert
            assertTrue(result, "Should delete payment with ID " + paymentId);
            verify(paymentRepository).deleteById(paymentId);
        }
    }
}
