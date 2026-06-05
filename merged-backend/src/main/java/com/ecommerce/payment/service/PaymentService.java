package com.ecommerce.payment.service;

import com.ecommerce.order.service.OrderService;
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
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final PaymentRepositoryProxy paymentRepositoryProxy;
    private final PaymentProcessor paymentProcessor;
    private final OrderService orderService;

    public PaymentService(PaymentRepository paymentRepository, @Lazy OrderService orderService) {
        this.paymentRepositoryProxy = new PaymentRepositoryProxy(paymentRepository);
        this.orderService = orderService;

        // Decorator: wraps the base processor to add simple audit.
        this.paymentProcessor = new PaymentAuditDecorator(request -> {
            String status = PaymentStrategyFactory
                    .createStrategy(request.getMethod())
                    .resolveStatus();

            // Adapter by composition: simple Request -> Entity conversion.
            return new PaymentRequestAdapterByComposition(request).toPayment(status);
        });
    }

    public PaymentDTO processPayment(PaymentRequest request) {
        Payment payment = paymentProcessor.process(request);
        Payment savedPayment = paymentRepositoryProxy.save(payment);

        // Direct Java call to update order status instead of HTTP
        if ("COMPLETED".equalsIgnoreCase(savedPayment.getStatus())) {
            try {
                orderService.updateStatus(savedPayment.getOrderId(), "PAID");
            } catch (Exception e) {
                System.err.println("Failed to update order status for order " + savedPayment.getOrderId() + ": " + e.getMessage());
            }
        }

        return toDTO(savedPayment);
    }

    public List<PaymentDTO> getAllPayments() {
        return paymentRepositoryProxy.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Optional<PaymentDTO> getPaymentById(Long id) {
        return paymentRepositoryProxy.findById(id).map(this::toDTO);
    }

    public Optional<PaymentDTO> getPaymentByOrderId(Long orderId) {
        return paymentRepositoryProxy.findByOrderId(orderId).map(this::toDTO);
    }

    public Optional<PaymentDTO> updatePayment(Long id, PaymentUpdateRequest request) {
        Optional<Payment> existingOptional = paymentRepositoryProxy.findById(id);
        if (existingOptional.isEmpty()) {
            return Optional.empty();
        }

        Payment existing = existingOptional.get();
        if (request.getMethod() != null && !request.getMethod().isBlank()) {
            existing.setMethod(request.getMethod());
        }
        if (request.getAmount() != null) {
            existing.setAmount(request.getAmount());
        }
        if (request.getStatus() != null && !request.getStatus().isBlank()) {
            existing.setStatus(request.getStatus());
        }
        existing.setTimestamp(LocalDateTime.now());

        PaymentRequestAdapterByInheritance inheritanceAdapter =
                new PaymentRequestAdapterByInheritance(existing.getOrderId(), existing.getMethod(), existing.getAmount());
        existing.setMethod(inheritanceAdapter.toSafeMethod());
        existing.setAmount(inheritanceAdapter.getAmount());

        Payment saved = paymentRepositoryProxy.save(existing);
        return Optional.of(toDTO(saved));
    }

    public boolean deletePayment(Long id) {
        if (!paymentRepositoryProxy.existsById(id)) {
            return false;
        }
        paymentRepositoryProxy.deleteById(id);
        return true;
    }

    private PaymentDTO toDTO(Payment payment) {
        return new PaymentDTO(
            payment.getId(),
            payment.getOrderId(),
            payment.getMethod(),
            payment.getStatus(),
            payment.getAmount(),
            payment.getTimestamp()
        );
    }
}
