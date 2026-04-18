package com.ecommerce.payment.pattern.strategy;

// Strategy: chaque methode de paiement a sa regle de statut.
public interface PaymentStatusStrategy {
    String resolveStatus();
}
