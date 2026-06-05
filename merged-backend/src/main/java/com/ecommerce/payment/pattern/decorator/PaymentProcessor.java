package com.ecommerce.payment.pattern.decorator;

import com.ecommerce.payment.dto.PaymentRequest;
import com.ecommerce.payment.entity.Payment;

public interface PaymentProcessor {
    Payment process(PaymentRequest request);
}
