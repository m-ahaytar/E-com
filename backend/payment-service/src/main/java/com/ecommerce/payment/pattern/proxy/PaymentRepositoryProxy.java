package com.ecommerce.payment.pattern.proxy;

import com.ecommerce.payment.entity.Payment;
import com.ecommerce.payment.repository.PaymentRepository;

import java.util.List;
import java.util.Optional;

// Proxy: point d'entree unique pour l'acces au repository.
public class PaymentRepositoryProxy {

    private final PaymentRepository paymentRepository;

    public PaymentRepositoryProxy(PaymentRepository paymentRepository) {
        this.paymentRepository = paymentRepository;
    }

    public Payment save(Payment payment) {
        return paymentRepository.save(payment);
    }

    public List<Payment> findAll() {
        return paymentRepository.findAll();
    }

    public Optional<Payment> findById(Long id) {
        return paymentRepository.findById(id);
    }

    public Optional<Payment> findByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId);
    }

    public boolean existsById(Long id) {
        return paymentRepository.existsById(id);
    }

    public void deleteById(Long id) {
        paymentRepository.deleteById(id);
    }
}
