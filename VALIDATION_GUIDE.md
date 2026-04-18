# Phase 3: Validation Implementation Guide

## Overview

This guide documents the comprehensive validation system implemented across the e-commerce application, including backend server-side validation and frontend client-side validation.

## Backend Validation (Java Spring Boot)

### 1. **DTO Validation Annotations**

#### Product Service DTOs

**ProductCreateDTO.java**

```java
@NotBlank(message = "Product name is required")
@Size(min = 3, max = 100, message = "Product name must be between 3 and 100 characters")
private String name;

@NotNull(message = "Price is required")
@DecimalMin(value = "0.01", message = "Price must be greater than 0")
@DecimalMax(value = "999999.99", message = "Price is too high")
private Double price;

@NotNull(message = "Stock is required")
@Min(value = 0, message = "Stock cannot be negative")
private Integer stock;

@NotNull(message = "Category is required")
private Long categoryId;
```

**CategoryDTO.java**

```java
@NotBlank(message = "Category name is required")
@Size(min = 2, max = 50, message = "Category name must be between 2 and 50 characters")
private String name;
```

#### Order Service DTOs

**OrderDTO.java**

```java
@NotNull(message = "User ID is required")
private Long userId;

@Pattern(regexp = "PENDING|CONFIRMED|SHIPPED|DELIVERED|CANCELLED",
         message = "Status must be one of: PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED")
private String status;

@NotNull(message = "Total amount is required")
@DecimalMin(value = "0.01", message = "Total must be greater than 0")
private Double total;

@Valid
@NotEmpty(message = "Order must contain at least one item")
private List<OrderItemDTO> items;
```

**OrderItemDTO.java**

```java
@NotNull(message = "Product ID is required")
private Long productId;

@NotNull(message = "Quantity is required")
@Min(value = 1, message = "Quantity must be at least 1")
@Max(value = 999, message = "Quantity cannot exceed 999")
private Integer quantity;

@NotNull(message = "Price is required")
@DecimalMin(value = "0.01", message = "Price must be greater than 0")
private Double price;
```

#### Auth Service DTOs

**LoginRequest.java**

```java
@NotBlank(message = "Username is required")
@Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
private String username;

@NotBlank(message = "Password is required")
@Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
private String password;
```

**RegisterRequest.java**

```java
@NotBlank(message = "Username is required")
@Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
private String username;

@NotBlank(message = "Password is required")
@Size(min = 6, max = 100, message = "Password must be between 6 and 100 characters")
private String password;

@NotBlank(message = "Role is required")
@Pattern(regexp = "CUSTOMER|ADMIN", message = "Role must be either CUSTOMER or ADMIN")
private String role;
```

#### Payment Service DTOs

**PaymentRequest.java & PaymentDTO.java**

```java
@NotNull(message = "Order ID is required")
private Long orderId;

@NotBlank(message = "Payment method is required")
@Pattern(regexp = "CREDIT_CARD|DEBIT_CARD|UPI|WALLET",
         message = "Payment method must be one of: CREDIT_CARD, DEBIT_CARD, UPI, WALLET")
private String method;

@NotNull(message = "Amount is required")
@DecimalMin(value = "0.01", message = "Amount must be greater than 0")
private Double amount;
```

### 2. **Global Exception Handler**

**GlobalExceptionHandler.java** (API Gateway)

- Catches `MethodArgumentNotValidException` for validation errors
- Returns structured error responses with field-level error messages
- Handles generic exceptions with appropriate HTTP status codes

**Response Format:**

```json
{
  "message": "Validation failed",
  "status": 400,
  "timestamp": "2024-01-15T10:30:00",
  "errors": {
    "name": "Product name must be between 3 and 100 characters",
    "price": "Price must be greater than 0",
    "categoryId": "Category is required"
  }
}
```

### 3. **Enabling Validation in Controllers**

Add `@Valid` annotation to DTO parameters:

```java
@PostMapping("/products")
public ResponseEntity<?> createProduct(@Valid @RequestBody ProductCreateDTO dto) {
    // Validation errors are automatically caught by GlobalExceptionHandler
    return productService.create(dto);
}

@PostMapping("/orders")
public ResponseEntity<?> createOrder(@Valid @RequestBody OrderDTO dto) {
    // Nested validation also works with @Valid
    return orderService.create(dto);
}
```

## Frontend Validation (React)

### 1. **Client-Side Validation Functions**

#### AdminProducts Component Example

```javascript
const validateForm = () => {
  const errors = {};

  // Text field validation
  if (!formData.name || formData.name.trim().length < 3) {
    errors.name = "Product name must be at least 3 characters";
  }
  if (formData.name && formData.name.length > 100) {
    errors.name = "Product name cannot exceed 100 characters";
  }

  // Number field validation
  const price = parseFloat(formData.price);
  if (!formData.price || isNaN(price)) {
    errors.price = "Price is required and must be a number";
  } else if (price <= 0) {
    errors.price = "Price must be greater than 0";
  }

  // Dropdown validation
  if (!formData.categoryId) {
    errors.categoryId = "Category is required";
  }

  setValidationErrors(errors);
  return Object.keys(errors).length === 0;
};
```

#### LoginPage Component Example

```javascript
const validateForm = () => {
  const errors = {};

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!formData.email) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(formData.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (!formData.password) {
    errors.password = "Password is required";
  } else if (formData.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  setValidationErrors(errors);
  return Object.keys(errors).length === 0;
};
```

### 2. **Real-Time Error Clearing**

Validation errors clear as the user types:

```javascript
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData({ ...formData, [name]: value });

  // Clear validation error for this field
  if (validationErrors[name]) {
    setValidationErrors({ ...validationErrors, [name]: "" });
  }
};
```

### 3. **UI Components with Validation**

**Form Input with Error Display:**

```jsx
<div className="form-group">
  <label>Price * (USD)</label>
  <input
    type="number"
    name="price"
    step="0.01"
    min="0"
    max="999999.99"
    value={formData.price}
    onChange={handleChange}
    className={
      validationErrors.price ? "form-control is-invalid" : "form-control"
    }
    placeholder="0.00"
  />
  {validationErrors.price && (
    <span className="form-error">
      <i className="bi bi-exclamation-triangle me-1"></i>
      {validationErrors.price}
    </span>
  )}
</div>
```

**Form Input with Character Counter:**

```jsx
<div className="form-group">
  <label>Description</label>
  <textarea
    name="description"
    value={formData.description}
    onChange={handleChange}
    maxLength="1000"
    rows="4"
  />
  {validationErrors.description && (
    <span className="form-error">{validationErrors.description}</span>
  )}
  <small className="char-count">{formData.description.length}/1000</small>
</div>
```

### 4. **CSS Validation Styling**

**.form-control.is-invalid** - Red border and error background

```css
.form-control.is-invalid {
  border-color: var(--danger-color) !important;
  background-image: url("...");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
}

.form-control.is-invalid:focus {
  border-color: var(--danger-color);
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}
```

**.invalid-feedback** - Error message styling

```css
.invalid-feedback {
  display: block;
  color: var(--danger-color);
  font-size: 0.875rem;
  margin-top: 0.5rem;
}
```

## Validation Rules Summary

### Common Rules Across Components

| Field Type    | Required | Min Length | Max Length | Pattern  | Min Value | Max Value |
| ------------- | -------- | ---------- | ---------- | -------- | --------- | --------- |
| Username      | Yes      | 3          | 50         | -        | -         | -         |
| Password      | Yes      | 6          | 100        | -        | -         | -         |
| Email         | Yes      | -          | -          | RFC 5322 | -         | -         |
| Product Name  | Yes      | 3          | 100        | -        | -         | -         |
| Description   | No       | -          | 1000       | -        | -         | -         |
| Price         | Yes      | -          | -          | -        | 0.01      | 999999.99 |
| Stock         | Yes      | -          | -          | -        | 0         | -         |
| Quantity      | Yes      | -          | -          | -        | 1         | 999       |
| Category Name | Yes      | 2          | 50         | -        | -         | -         |

### Enum Validations

**Order Status:** PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED

**Payment Method:** CREDIT_CARD, DEBIT_CARD, UPI, WALLET

**Payment Status:** PENDING, COMPLETED, FAILED, REFUNDED

**User Role:** CUSTOMER, ADMIN

## Form Submission Flow

### Backend Flow

```
Request with @Valid DTO
    ↓
Spring Validation Framework
    ↓
If valid → Process request
If invalid → Catch exception in GlobalExceptionHandler
    ↓
Return error response with field-level messages
    ↓
HTTP 400 Bad Request
```

### Frontend Flow

```
User submits form
    ↓
Call validateForm()
    ↓
If valid → Send request to backend
If invalid → Display error messages
    ↓
User edits field → Clear that field's error
    ↓
Retry submission
```

## Error Response Examples

### Product Creation Error

```json
{
  "message": "Validation failed",
  "status": 400,
  "timestamp": "2024-01-15T10:30:00",
  "errors": {
    "name": "Product name must be between 3 and 100 characters",
    "price": "Price must be greater than 0",
    "stock": "Stock cannot be negative"
  }
}
```

### Order Creation Error

```json
{
  "message": "Validation failed",
  "status": 400,
  "timestamp": "2024-01-15T10:30:00",
  "errors": {
    "items": "Order must contain at least one item",
    "total": "Total must be greater than 0"
  }
}
```

## Testing Validation

### Unit Tests (Backend)

```java
@Test
public void testProductNameValidation() {
    ProductCreateDTO dto = new ProductCreateDTO();
    dto.setName(""); // Too short

    Set<ConstraintViolation<ProductCreateDTO>> violations =
        validator.validate(dto);

    assertEquals(1, violations.size());
    assertTrue(violations.stream()
        .anyMatch(v -> v.getMessage().contains("required")));
}
```

### Manual Testing Checklist

- [ ] Product name less than 3 characters
- [ ] Product price is negative
- [ ] Stock is negative
- [ ] Email format is invalid
- [ ] Password is less than 6 characters
- [ ] Passwords don't match on registration
- [ ] Order with no items
- [ ] Payment amount is zero or negative
- [ ] Character limits are enforced

## Best Practices

1. **Always validate on both frontend and backend**
   - Frontend for UX
   - Backend for security

2. **Use clear, actionable error messages**
   - Tell users what's wrong and how to fix it
   - Avoid technical jargon

3. **Provide real-time feedback**
   - Clear errors as user types
   - Show character counts for limited fields

4. **Validate at form level and field level**
   - Check individual fields first
   - Then check relationships between fields

5. **Use consistent validation rules**
   - Same rules on frontend and backend
   - Document in one place

6. **Handle edge cases**
   - Null values
   - Empty strings
   - Whitespace-only strings
   - Invalid data types

## Future Improvements

1. Add async validation (e.g., check if email exists)
2. Add custom validators for complex rules
3. Implement field dependencies (e.g., if Type=X then Field=required)
4. Add multi-language support for error messages
5. Create validation utility library for shared rules
6. Add server-side rate limiting for validation attempts
