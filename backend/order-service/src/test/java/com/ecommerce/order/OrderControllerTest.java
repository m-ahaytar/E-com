package com.ecommerce.order;

import com.ecommerce.order.SecurityConfig;
import com.ecommerce.order.controller.OrderController;
import com.ecommerce.order.dto.CreateOrderDTO;
import com.ecommerce.order.dto.OrderDTO;
import com.ecommerce.order.dto.OrderItemDTO;
import com.ecommerce.order.facade.OrderFacade;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(OrderController.class)
@AutoConfigureMockMvc(addFilters = false)
@TestPropertySource(properties = "jwt.secret=test-secret-key-that-is-long-enough-for-hmac-sha256")
class OrderControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private OrderFacade orderFacade;


    @Test
    void createOrder_Success() throws Exception {
        OrderItemDTO itemDTO = new OrderItemDTO();
        itemDTO.setProductId(1L);
        itemDTO.setProductName("Test Product");
        itemDTO.setQuantity(2);
        itemDTO.setPrice(10.99);

        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId(1L);
        orderDTO.setUserId(1L);
        orderDTO.setStatus("PENDING");
        orderDTO.setOrderDate(LocalDateTime.now());
        orderDTO.setItems(Collections.singletonList(itemDTO));

        when(orderFacade.createOrder(any(CreateOrderDTO.class))).thenReturn(orderDTO);

        mockMvc.perform(post("/orders")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\":1,\"items\":[{\"productId\":1,\"productName\":\"Test Product\",\"quantity\":2,\"price\":10.99}]}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.userId").value(1))
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    void getOrdersByUserId_Success() throws Exception {
        OrderItemDTO itemDTO = new OrderItemDTO();
        itemDTO.setProductId(1L);
        itemDTO.setProductName("Test Product");
        itemDTO.setQuantity(2);
        itemDTO.setPrice(10.99);

        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId(1L);
        orderDTO.setUserId(1L);
        orderDTO.setStatus("PENDING");
        orderDTO.setOrderDate(LocalDateTime.now());
        orderDTO.setItems(Collections.singletonList(itemDTO));

        List<OrderDTO> orders = Collections.singletonList(orderDTO);

        when(orderFacade.getOrdersByUserId(1L)).thenReturn(orders);

        mockMvc.perform(get("/orders/user/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].userId").value(1))
                .andExpect(jsonPath("$[0].status").value("PENDING"));
    }

    @Test
    void getOrderById_Success() throws Exception {
        OrderItemDTO itemDTO = new OrderItemDTO();
        itemDTO.setProductId(1L);
        itemDTO.setProductName("Test Product");
        itemDTO.setQuantity(2);
        itemDTO.setPrice(10.99);

        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId(1L);
        orderDTO.setUserId(1L);
        orderDTO.setStatus("COMPLETED");
        orderDTO.setOrderDate(LocalDateTime.now());
        orderDTO.setItems(Collections.singletonList(itemDTO));

        when(orderFacade.getOrderById(1L)).thenReturn(orderDTO);

        mockMvc.perform(get("/orders/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.status").value("COMPLETED"));
    }

    @Test
    void getOrderById_NotFound() throws Exception {
        when(orderFacade.getOrderById(999L)).thenReturn(null);

        mockMvc.perform(get("/orders/999"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getAllOrders_Success() throws Exception {
        OrderDTO order1 = new OrderDTO();
        order1.setId(1L);
        order1.setUserId(1L);
        order1.setStatus("PENDING");

        OrderDTO order2 = new OrderDTO();
        order2.setId(2L);
        order2.setUserId(2L);
        order2.setStatus("PROCESSING");

        when(orderFacade.getAllOrders()).thenReturn(Arrays.asList(order1, order2));

        mockMvc.perform(get("/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[1].id").value(2));
    }

    @Test
    void updateOrder_Success() throws Exception {
        OrderDTO updatedOrder = new OrderDTO();
        updatedOrder.setId(1L);
        updatedOrder.setUserId(1L);
        updatedOrder.setStatus("PROCESSING");

        when(orderFacade.updateOrder(eq(1L), any(CreateOrderDTO.class))).thenReturn(updatedOrder);

        mockMvc.perform(put("/orders/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userId\":1,\"items\":[{\"productId\":1,\"productName\":\"Produit\",\"quantity\":1,\"price\":9.99}]}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.status").value("PROCESSING"));
    }

    @Test
    void deleteOrder_Success() throws Exception {
        when(orderFacade.deleteOrder(1L)).thenReturn(true);

        mockMvc.perform(delete("/orders/1"))
                .andExpect(status().isNoContent());
    }
}
