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
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PaymentService {

    private final PaymentRepositoryProxy paymentRepositoryProxy;
    private final PaymentProcessor paymentProcessor;
    private final org.springframework.web.client.RestTemplate restTemplate;
    
    @Value("${services.order-service.url}")
    private String orderServiceUrl;

    @Value("${jwt.secret}")
    private String jwtSecret;

    public PaymentService(PaymentRepository paymentRepository, org.springframework.web.client.RestTemplate restTemplate) {
        this.paymentRepositoryProxy = new PaymentRepositoryProxy(paymentRepository);
        this.restTemplate = restTemplate;

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
        
        // Notify order-service of payment status
        if ("COMPLETED".equalsIgnoreCase(savedPayment.getStatus())) {
            try {
                HttpHeaders headers = new HttpHeaders();
                headers.setBearerAuth(createServiceToken());
                restTemplate.exchange(
                    orderServiceUrl + "/orders/" + savedPayment.getOrderId() + "/status?status=PAID",
                    HttpMethod.PATCH,
                    new HttpEntity<>(headers),
                    Object.class
                );
            } catch (Exception e) {
                System.err.println("Failed to update order status for order " + savedPayment.getOrderId() + ": " + e.getMessage());
            }
        }
        
        return toDTO(savedPayment);
    }

    private String createServiceToken() {
        Date now = new Date();
        Date expiresAt = new Date(now.getTime() + 300_000);
        return Jwts.builder()
                .subject("payment-service")
                .claim("role", "SERVICE")
                .issuedAt(now)
                .expiration(expiresAt)
                .signWith(Keys.hmacShaKeyFor(jwtSecret.trim().getBytes(java.nio.charset.StandardCharsets.UTF_8)))
                .compact();
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
