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
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
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
class PaymentServiceTest {

    @Mock
    private PaymentRepository paymentRepository;

    private PaymentService paymentService;
    private Payment payment;
    private PaymentRequest paymentRequest;

    @BeforeEach
    void setUp() {
        paymentService = new PaymentService(paymentRepository);

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

    @Test
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
        assertNotNull(result);
        assertEquals(100L, result.getOrderId());
        assertEquals("CARD", result.getMethod());
        assertEquals("COMPLETED", result.getStatus());
        assertEquals(100.0, result.getAmount());
        verify(paymentRepository).save(any(Payment.class));
    }

    @Test
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
        assertNotNull(result);
        assertEquals(100L, result.getOrderId());
        assertEquals("CASH", result.getMethod());
        assertEquals("PENDING", result.getStatus());
        verify(paymentRepository).save(any(Payment.class));
    }

    @Test
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
        assertEquals(2, results.size());
        assertEquals("CARD", results.get(0).getMethod());
        assertEquals("CASH", results.get(1).getMethod());
        verify(paymentRepository).findAll();
    }

    @Test
    void getPaymentById_validId_returnsPayment() {
        // Arrange
        when(paymentRepository.findById(1L)).thenReturn(Optional.of(payment));

        // Act
        Optional<PaymentDTO> result = paymentService.getPaymentById(1L);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
        assertEquals(100L, result.get().getOrderId());
        verify(paymentRepository).findById(1L);
    }

    @Test
    void getPaymentById_invalidId_returnsEmpty() {
        // Arrange
        when(paymentRepository.findById(999L)).thenReturn(Optional.empty());

        // Act
        Optional<PaymentDTO> result = paymentService.getPaymentById(999L);

        // Assert
        assertTrue(result.isEmpty());
    }

    @Test
    void getPaymentByOrderId_validOrderId_returnsPayment() {
        // Arrange
        when(paymentRepository.findByOrderId(100L)).thenReturn(Optional.of(payment));

        // Act
        Optional<PaymentDTO> result = paymentService.getPaymentByOrderId(100L);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(100L, result.get().getOrderId());
        verify(paymentRepository).findByOrderId(100L);
    }

    @Test
    void getPaymentByOrderId_invalidOrderId_returnsEmpty() {
        // Arrange
        when(paymentRepository.findByOrderId(999L)).thenReturn(Optional.empty());

        // Act
        Optional<PaymentDTO> result = paymentService.getPaymentByOrderId(999L);

        // Assert
        assertTrue(result.isEmpty());
    }

    @Test
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
        assertTrue(result.isPresent());
        verify(paymentRepository).findById(1L);
        verify(paymentRepository).save(any(Payment.class));
    }

    @Test
    void updatePayment_invalidId_returnsEmpty() {
        // Arrange
        when(paymentRepository.findById(999L)).thenReturn(Optional.empty());

        PaymentUpdateRequest updateRequest = new PaymentUpdateRequest();
        updateRequest.setMethod("CASH");

        // Act
        Optional<PaymentDTO> result = paymentService.updatePayment(999L, updateRequest);

        // Assert
        assertTrue(result.isEmpty());
        verify(paymentRepository, never()).save(any(Payment.class));
    }

    @Test
    void deletePayment_validId_deletesPayment() {
        // Arrange
        when(paymentRepository.existsById(1L)).thenReturn(true);

        // Act
        boolean result = paymentService.deletePayment(1L);

        // Assert
        assertTrue(result);
        verify(paymentRepository).deleteById(1L);
    }

    @Test
    void deletePayment_invalidId_returnsFalse() {
        // Arrange
        when(paymentRepository.existsById(999L)).thenReturn(false);

        // Act
        boolean result = paymentService.deletePayment(999L);

        // Assert
        assertFalse(result);
        verify(paymentRepository, never()).deleteById(anyLong());
    }
}
