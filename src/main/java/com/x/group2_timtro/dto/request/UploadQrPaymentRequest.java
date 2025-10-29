package com.x.group2_timtro.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UploadQrPaymentRequest {
    private String imageUrl; // URL of the QR code image
    private String paymentDescription; // Payment transfer content (e.g., "Thanh toan tien phong thang 10/2024")
}

