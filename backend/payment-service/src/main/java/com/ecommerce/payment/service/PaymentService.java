package com.ecommerce.payment.service;

import com.ecommerce.payment.dto.PaymentDTO;
import com.ecommerce.payment.dto.PaymentRequest;
import com.ecommerce.payment.entity.Payment;
import com.ecommerce.payment.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public PaymentDTO processPayment(PaymentRequest request) {
        String status = "CARD".equalsIgnoreCase(request.getMethod()) ? "COMPLETED" : "PENDING";
        
        Payment payment = new Payment(
            request.getOrderId(),
            request.getMethod(),
            status,
            request.getAmount()
        );
        
        Payment savedPayment = paymentRepository.save(payment);
        return toDTO(savedPayment);
    }

    public Optional<PaymentDTO> getPaymentByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId).map(this::toDTO);
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
