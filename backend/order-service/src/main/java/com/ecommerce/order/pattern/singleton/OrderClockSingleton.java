package com.ecommerce.order.pattern.singleton;

import java.time.LocalDateTime;

// Singleton: une seule instance utilitaire pour lire l'heure applicative.
public final class OrderClockSingleton {

    private static final OrderClockSingleton INSTANCE = new OrderClockSingleton();

    private OrderClockSingleton() {
    }

    public static OrderClockSingleton getInstance() {
        return INSTANCE;
    }

    public LocalDateTime now() {
        return LocalDateTime.now();
    }
}
