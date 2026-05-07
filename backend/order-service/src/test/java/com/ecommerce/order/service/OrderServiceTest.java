package com.ecommerce.order.service;

import com.ecommerce.order.dto.CreateOrderDTO;
import com.ecommerce.order.dto.OrderDTO;
import com.ecommerce.order.entity.Order;
import com.ecommerce.order.entity.OrderItem;
import com.ecommerce.order.repository.OrderRepository;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

    import java.time.Duration;
    import java.time.LocalDateTime;
    import java.util.ArrayList;
    import java.util.Arrays;
    import java.util.List;
    import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("OrderService Tests")
@Tag("unit")
@Tag("fast")
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    private Order order;
       private CreateOrderDTO createOrderDTO;

       @BeforeAll
       static void beforeAll() {
           System.out.println("Starting tests for OrderService");
       }

       @AfterAll
       static void afterAll() {
           System.out.println("Finished tests for OrderService");
       }

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

    @Nested
    @DisplayName("Create Order Tests")
    class CreateOrderTests {
        @Test
        @DisplayName("create order with valid DTO creates order")
        void createOrder_validDTO_createsOrder() {
            // Arrange
            when(orderRepository.save(any(Order.class))).thenReturn(order);

            // Act
            OrderDTO result = orderService.createOrder(createOrderDTO);

            // Assert
            assertAll(
                () -> assertNotNull(result, "Order should not be null"),
                () -> assertEquals(100L, result.getUserId(), "User ID should match"),
                () -> assertEquals("PENDING", result.getStatus(), "Order status should be PENDING"),
                () -> assertEquals(1, result.getItems().size(), "Order should have 1 item"),
                () -> verify(orderRepository).save(any(Order.class))
            );
        }

        @Test
        @DisplayName("create order with null user ID creates order")
        void createOrder_nullUserId_createsOrderWithNullUserId() {
            // Arrange
            createOrderDTO.setUserId(null);
            order.setUserId(null);
            when(orderRepository.save(any(Order.class))).thenReturn(order);

            // Act
            OrderDTO result = orderService.createOrder(createOrderDTO);

            // Assert
            assertAll(
                () -> assertNotNull(result, "Order should not be null"),
                () -> assertNull(result.getUserId(), "User ID should be null"),
                () -> verify(orderRepository).save(any(Order.class))
            );
        }

        @Test
        @DisplayName("create order with empty items creates order")
        void createOrder_emptyItems_createsOrderWithNoItems() {
            // Arrange
            createOrderDTO.setItems(new ArrayList<>());
            order.setItems(new ArrayList<>());
            order.setTotalAmount(0.0);
            when(orderRepository.save(any(Order.class))).thenReturn(order);

            // Act
            OrderDTO result = orderService.createOrder(createOrderDTO);

            // Assert
            assertAll(
                () -> assertNotNull(result, "Order should not be null"),
                () -> assertEquals(0, result.getItems().size(), "Order should have no items"),
                () -> assertEquals(0.0, result.getTotalAmount(), "Total amount should be 0")
            );
        }

        @Test
        @DisplayName("create order generates order number")
        void createOrder_calculatesOrderNumber() {
            // Arrange
            when(orderRepository.save(any(Order.class))).thenReturn(order);

            // Act
            OrderDTO result = orderService.createOrder(createOrderDTO);

            // Assert
            assertNotNull(result.getOrderNumber(), "Order number should be generated");
            assertTrue(result.getOrderNumber().startsWith("ORD-"), "Order number should start with ORD-");
        }

        @ParameterizedTest
        @ValueSource(longs = { 1L, 2L, 5L, 10L })
        @DisplayName("create order with various user IDs")
        void createOrder_multipleUserIds(Long userId) {
            // Arrange
            createOrderDTO.setUserId(userId);
            Order testOrder = new Order();
            testOrder.setId(1L);
            testOrder.setUserId(userId);
            testOrder.setStatus("PENDING");
            testOrder.setOrderNumber("ORD-TEST");
            testOrder.setTotalAmount(100.0);
            testOrder.setItems(new ArrayList<>());
            when(orderRepository.save(any(Order.class))).thenReturn(testOrder);

            // Act
            OrderDTO result = orderService.createOrder(createOrderDTO);

            // Assert
            assertEquals(userId, result.getUserId(), "Should create order for user " + userId);
            assertNotNull(result.getOrderNumber());
        }
    }

    @Nested
    @DisplayName("Retrieve Order Tests")
    class RetrieveOrderTests {
    @Test
    @DisplayName("get all orders returns list of orders")
    void getAllOrders_returnsListOfOrders() {
        // Arrange
        Order order2 = new Order();
        order2.setId(2L);
        order2.setUserId(101L);
        order2.setStatus("COMPLETED");
        order2.setOrderNumber("ORD-9876543-XYZ54321");
        order2.setTotalAmount(200.0);
        order2.setOrderDate(LocalDateTime.now());
        order2.setItems(new ArrayList<>());
        
        when(orderRepository.findAll()).thenReturn(Arrays.asList(order, order2));

        // Act
        List<OrderDTO> results = orderService.getAllOrders();

        // Assert
        assertAll(
            () -> assertEquals(2, results.size(), "Should return 2 orders"),
            () -> assertEquals("PENDING", results.get(0).getStatus(), "First order should be PENDING"),
            () -> assertEquals("COMPLETED", results.get(1).getStatus(), "Second order should be COMPLETED"),
            () -> verify(orderRepository).findAll()
        );
    }

    @Test
    @DisplayName("getAllOrders should complete within 100ms")
    void getAllOrders_completesWithinTimeout() {
        // Arrange
        Order order2 = new Order();
        order2.setId(2L);
        order2.setUserId(101L);
        order2.setStatus("COMPLETED");
        order2.setOrderNumber("ORD-9876543-XYZ54321");
        order2.setTotalAmount(200.0);
        order2.setOrderDate(LocalDateTime.now());
        order2.setItems(new ArrayList<>());
        
        when(orderRepository.findAll()).thenReturn(Arrays.asList(order, order2));

        // Assert
        assertTimeout(Duration.ofMillis(100), () -> {
            // Act
            List<OrderDTO> results = orderService.getAllOrders();
            // Assertions inside the timeout block
            assertEquals(2, results.size(), "Should return 2 orders");
            assertEquals("PENDING", results.get(0).getStatus(), "First order should be PENDING");
            assertEquals("COMPLETED", results.get(1).getStatus(), "Second order should be COMPLETED");
        });
        verify(orderRepository).findAll();
    }

        @Test
        @DisplayName("get orders by valid user ID returns orders")
        void getOrdersByUserId_validUserId_returnsOrders() {
            // Arrange
            when(orderRepository.findByUserId(100L)).thenReturn(Arrays.asList(order));

            // Act
            List<OrderDTO> results = orderService.getOrdersByUserId(100L);

            // Assert
            assertAll(
                () -> assertEquals(1, results.size(), "Should return 1 order"),
                () -> assertEquals(100L, results.get(0).getUserId(), "User ID should match"),
                () -> verify(orderRepository).findByUserId(100L)
            );
        }

        @Test
        @DisplayName("get order by valid ID returns order")
        void getOrderById_validId_returnsOrder() {
            // Arrange
            when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

            // Act
            OrderDTO result = orderService.getOrderById(1L);

            // Assert
            assertAll(
                () -> assertNotNull(result, "Order should not be null"),
                () -> assertEquals(1L, result.getId(), "Order ID should match"),
                () -> assertEquals("PENDING", result.getStatus(), "Order status should be PENDING"),
                () -> verify(orderRepository).findById(1L)
            );
        }

        @Test
        @DisplayName("get order by invalid ID throws exception")
        void getOrderById_invalidId_throws() {
            // Arrange
            when(orderRepository.findById(999L)).thenReturn(Optional.empty());

            // Act & Assert
            Exception exception = assertThrows(
                Exception.class,
                () -> orderService.getOrderById(999L),
                "Should throw exception for invalid order ID"
            );
            assertTrue(exception.getMessage().contains("Order not found"), 
                "Exception message should mention 'Order not found'");
        }

        @ParameterizedTest
        @ValueSource(longs = { 1L, 2L, 5L })
        @DisplayName("get order with various order IDs")
        void getOrderById_variousIds(Long orderId) {
            // Arrange
            Order testOrder = new Order();
            testOrder.setId(orderId);
            testOrder.setUserId(100L);
            testOrder.setStatus("PENDING");
            testOrder.setOrderNumber("ORD-TEST");
            testOrder.setItems(new ArrayList<>());
            when(orderRepository.findById(orderId)).thenReturn(Optional.of(testOrder));

            // Act
            OrderDTO result = orderService.getOrderById(orderId);

            // Assert
            assertEquals(orderId, result.getId(), "Should retrieve order with ID " + orderId);
        }
    }

    @Nested
    @DisplayName("Update Order Tests")
    class UpdateOrderTests {
        @Test
        @DisplayName("update order with valid DTO updates order")
        void updateOrder_validDTO_updatesOrder() {
            // Arrange
            when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
            when(orderRepository.save(any(Order.class))).thenReturn(order);

            CreateOrderDTO updateDTO = new CreateOrderDTO();
            updateDTO.setUserId(100L);
            updateDTO.setItems(new ArrayList<>());

            // Act
            OrderDTO result = orderService.updateOrder(1L, updateDTO);

            // Assert
            assertAll(
                () -> assertNotNull(result, "Updated order should not be null"),
                () -> verify(orderRepository).findById(1L),
                () -> verify(orderRepository).save(any(Order.class))
            );
        }
    }

    @Nested
    @DisplayName("Delete Order Tests")
    class DeleteOrderTests {
        @Test
        @DisplayName("delete order by valid ID deletes order")
        void deleteOrder_validId_deletesOrder() {
            // Arrange
            when(orderRepository.existsById(1L)).thenReturn(true);

            // Act
            boolean result = orderService.deleteOrder(1L);

            // Assert
            assertTrue(result, "Deletion should return true");
            verify(orderRepository).deleteById(1L);
        }

        @Test
        @DisplayName("delete order by invalid ID returns false")
        void deleteOrder_invalidId_returnsFalse() {
            // Arrange
            when(orderRepository.existsById(999L)).thenReturn(false);

            // Act
            boolean result = orderService.deleteOrder(999L);

            // Assert
            assertFalse(result, "Deletion should return false for invalid ID");
            verify(orderRepository, never()).deleteById(999L);
        }

        @ParameterizedTest
        @ValueSource(longs = { 1L, 2L, 5L })
        @DisplayName("delete order with various order IDs")
        void deleteOrder_variousIds(Long orderId) {
            // Arrange
            when(orderRepository.existsById(orderId)).thenReturn(true);

            // Act
            boolean result = orderService.deleteOrder(orderId);

            // Assert
            assertTrue(result, "Should delete order with ID " + orderId);
            verify(orderRepository).deleteById(orderId);
        }
    }
}
