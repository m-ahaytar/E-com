package com.ecommerce.auth.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public class UpdateUserRequest {
    @Pattern(regexp = "CUSTOMER|SELLER|ADMIN",
             message = "Role must be CUSTOMER, SELLER, or ADMIN")
    private String role;

    @Size(max = 50)
    private String firstName;

    @Size(max = 50)
    private String lastName;

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
}
