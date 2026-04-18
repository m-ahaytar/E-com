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
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final PaymentRepositoryProxy paymentRepositoryProxy;
    private final PaymentProcessor paymentProcessor;

    public PaymentService(PaymentRepository paymentRepository) {
        this.paymentRepositoryProxy = new PaymentRepositoryProxy(paymentRepository);

        // Decorator: on entoure le processeur de base pour ajouter un audit simple.
        this.paymentProcessor = new PaymentAuditDecorator(request -> {
            String status = PaymentStrategyFactory
                    .createStrategy(request.getMethod())
                    .resolveStatus();

            // Adapter par composition: conversion simple Request -> Entity.
            return new PaymentRequestAdapterByComposition(request).toPayment(status);
        });
    }

    public PaymentDTO processPayment(PaymentRequest request) {
        Payment payment = paymentProcessor.process(request);
        Payment savedPayment = paymentRepositoryProxy.save(payment);
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

        // Adapter par heritage: on reutilise la structure de request pour uniformiser les donnees.
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
