package com.ecommerce.order.pattern.observer;

// Observer: interface simple pour reagir aux evenements de commande.
public interface OrderEventObserver {
    void onOrderEvent(String eventType, Long orderId);
}
