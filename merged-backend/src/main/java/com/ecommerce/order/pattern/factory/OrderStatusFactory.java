package com.ecommerce.order.pattern.factory;

// Factory Method: centralise la creation des statuts pour eviter la duplication.
public final class OrderStatusFactory {

    private OrderStatusFactory() {
    }

    public static String createInitialStatus() {
        return "PENDING";
    }

    public static String createUpdatedStatus(String currentStatus) {
        if (currentStatus == null || currentStatus.isBlank()) {
            return "PENDING";
        }
        if ("CANCELLED".equalsIgnoreCase(currentStatus)) {
            return "CANCELLED";
        }
        if ("PENDING".equalsIgnoreCase(currentStatus)) {
            return "PROCESSING";
        }
        if ("PROCESSING".equalsIgnoreCase(currentStatus)) {
            return "SHIPPED";
        }
        return "DELIVERED";
    }
}
