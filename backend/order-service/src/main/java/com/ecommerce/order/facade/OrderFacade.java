package com.ecommerce.order.facade;

import com.ecommerce.order.dto.CreateOrderDTO;
import com.ecommerce.order.dto.OrderDTO;
import com.ecommerce.order.pattern.observer.OrderEventObserver;
import com.ecommerce.order.service.OrderService;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class OrderFacade {

    private final OrderService orderService;
    private final List<OrderEventObserver> observers;

    public OrderFacade(OrderService orderService) {
        this.orderService = orderService;
        this.observers = new ArrayList<>();

        // Observer: un ecouteur simple pour tracer les actions principales.
        this.observers.add((eventType, orderId) ->
                System.out.println("[ORDER-EVENT] " + eventType + " - orderId=" + orderId));
    }

    public OrderDTO createOrder(CreateOrderDTO createOrderDTO) {
        OrderDTO created = orderService.createOrder(createOrderDTO);
        notifyObservers("CREATE", created != null ? created.getId() : null);
        return created;
    }

    public List<OrderDTO> getAllOrders() {
        return orderService.getAllOrders();
    }

    public List<OrderDTO> getOrdersByUserId(Long userId) {
        return orderService.getOrdersByUserId(userId);
    }

    public OrderDTO getOrderById(Long id) {
        return orderService.getOrderById(id);
    }

    public OrderDTO updateOrder(Long id, CreateOrderDTO updateDTO) {
        OrderDTO updated = orderService.updateOrder(id, updateDTO);
        if (updated != null) {
            notifyObservers("UPDATE", updated.getId());
        }
        return updated;
    }

    public OrderDTO updateStatus(Long id, String status) {
        OrderDTO updated = orderService.updateStatus(id, status);
        if (updated != null) {
            notifyObservers("UPDATE_STATUS", updated.getId());
        }
        return updated;
    }

    public boolean deleteOrder(Long id) {
        boolean deleted = orderService.deleteOrder(id);
        if (deleted) {
            notifyObservers("DELETE", id);
        }
        return deleted;
    }

    private void notifyObservers(String eventType, Long orderId) {
        for (OrderEventObserver observer : observers) {
            observer.onOrderEvent(eventType, orderId);
        }
    }
}
