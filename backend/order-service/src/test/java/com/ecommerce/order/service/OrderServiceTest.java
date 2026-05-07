package com.ecommerce.order.service;

import com.ecommerce.order.dto.CreateOrderDTO;
import com.ecommerce.order.dto.OrderDTO;
import com.ecommerce.order.entity.Order;
import com.ecommerce.order.entity.OrderItem;
import com.ecommerce.order.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    private Order order;
    private CreateOrderDTO createOrderDTO;

    @BeforeEach
    void setUp() {
        order = new Order();
        order.setId(1L);
        order.setUserId(100L);
        order.setStatus("PENDING");
        order.setOrderDate(LocalDateTime.now());
        order.setOrderNumber("ORD-1234567-ABC12345");
        order.setTotalAmount(100.0);

        OrderItem item = new OrderItem();
        item.setProductId(1L);
        item.setProductName("Laptop");
        item.setQuantity(1);
        item.setPrice(100.0);
        order.setItems(new ArrayList<>());
        order.addItem(item);

        createOrderDTO = new CreateOrderDTO();
        createOrderDTO.setUserId(100L);
        List<CreateOrderDTO.CreateOrderItemDTO> items = new ArrayList<>();
        CreateOrderDTO.CreateOrderItemDTO itemDTO = new CreateOrderDTO.CreateOrderItemDTO();
        itemDTO.setProductId(1L);
        itemDTO.setProductName("Laptop");
        itemDTO.setQuantity(1);
        itemDTO.setPrice(100.0);
        items.add(itemDTO);
        createOrderDTO.setItems(items);
    }

    @Test
    void createOrder_validDTO_createsOrder() {
        // Arrange
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        // Act
        OrderDTO result = orderService.createOrder(createOrderDTO);

        // Assert
        assertNotNull(result);
        assertEquals(100L, result.getUserId());
        assertEquals("PENDING", result.getStatus());
        assertEquals(1, result.getItems().size());
        verify(orderRepository).save(any(Order.class));
    }

    @Test
    void createOrder_nullUserId_createsOrderWithNullUserId() {
        // Arrange - note: builder does not validate null userId
        createOrderDTO.setUserId(null);
        order.setUserId(null);
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        // Act
        OrderDTO result = orderService.createOrder(createOrderDTO);

        // Assert
        assertNotNull(result);
        assertNull(result.getUserId());
        verify(orderRepository).save(any(Order.class));
    }

    @Test
    void createOrder_emptyItems_createsOrderWithNoItems() {
        // Arrange - note: builder allows empty items
        createOrderDTO.setItems(new ArrayList<>());
        order.setItems(new ArrayList<>());
        order.setTotalAmount(0.0);
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        // Act
        OrderDTO result = orderService.createOrder(createOrderDTO);

        // Assert
        assertNotNull(result);
        assertEquals(0, result.getItems().size());
        assertEquals(0.0, result.getTotalAmount());
        verify(orderRepository).save(any(Order.class));
    }

    @Test
    void getAllOrders_returnsListOfOrders() {
        // Arrange
        Order order2 = new Order();
        order2.setId(2L);
        order2.setUserId(101L);
        order2.setStatus("COMPLETED");
        order2.setOrderNumber("ORD-1234568-DEF67890");
        order2.setItems(new ArrayList<>());

        when(orderRepository.findAll()).thenReturn(Arrays.asList(order, order2));

        // Act
        List<OrderDTO> results = orderService.getAllOrders();

        // Assert
        assertEquals(2, results.size());
        assertEquals(100L, results.get(0).getUserId());
        assertEquals(101L, results.get(1).getUserId());
        verify(orderRepository).findAll();
    }

    @Test
    void getOrdersByUserId_validUserId_returnsOrders() {
        // Arrange
        when(orderRepository.findByUserId(100L)).thenReturn(Arrays.asList(order));

        // Act
        List<OrderDTO> results = orderService.getOrdersByUserId(100L);

        // Assert
        assertEquals(1, results.size());
        assertEquals(100L, results.get(0).getUserId());
        verify(orderRepository).findByUserId(100L);
    }

    @Test
    void getOrderById_validId_returnsOrder() {
        // Arrange
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        // Act
        OrderDTO result = orderService.getOrderById(1L);

        // Assert
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(100L, result.getUserId());
        verify(orderRepository).findById(1L);
    }

    @Test
    void getOrderById_invalidId_throws() {
        // Arrange
        when(orderRepository.findById(999L)).thenReturn(Optional.empty());

        // Act & Assert
        RuntimeException exception = assertThrows(
            RuntimeException.class,
            () -> orderService.getOrderById(999L)
        );
        assertTrue(exception.getMessage().contains("Order not found"));
    }

    @Test
    void updateOrder_validDTO_updatesOrder() {
        // Arrange
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        createOrderDTO.setUserId(105L);

        // Act
        OrderDTO result = orderService.updateOrder(1L, createOrderDTO);

        // Assert
        assertNotNull(result);
        verify(orderRepository).findById(1L);
        verify(orderRepository).save(any(Order.class));
    }

    @Test
    void deleteOrder_validId_deletesOrder() {
        // Arrange
        when(orderRepository.existsById(1L)).thenReturn(true);

        // Act
        boolean result = orderService.deleteOrder(1L);

        // Assert
        assertTrue(result);
        verify(orderRepository).deleteById(1L);
    }

    @Test
    void deleteOrder_invalidId_returnsFalse() {
        // Arrange
        when(orderRepository.existsById(999L)).thenReturn(false);

        // Act
        boolean result = orderService.deleteOrder(999L);

        // Assert
        assertFalse(result);
        verify(orderRepository, never()).deleteById(any());
    }

    @Test
    void createOrder_calculatesOrderNumber() {
        // Arrange
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        // Act
        OrderDTO result = orderService.createOrder(createOrderDTO);

        // Assert
        assertNotNull(result);
        assertNotNull(result.getOrderNumber());
        assertTrue(result.getOrderNumber().startsWith("ORD-"));
    }
}
