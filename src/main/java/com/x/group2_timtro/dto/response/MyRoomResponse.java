package com.x.group2_timtro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MyRoomResponse {
    private Long id;
    private String bookingId;
    private Long roomId;
    private String roomTitle;
    private String addressShort;
    private Double pricePerMonth;
    private Double area;
    private Integer capacity;
    private String imageUrl;
    private String status;
    private LocalDateTime holdExpiresAt;
    
    // Deposit info
    private DepositInfo deposit;
    
    // Contract info
    private ContractInfo contract;
    
    // Lease info
    private LeaseInfo lease;
    
    // Landlord info
    private LandlordInfo landlord;
    
    // Timestamps
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Cancel info
    private String cancelReason;
    private String canceledBy;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DepositInfo {
        private Double amount;
        private Boolean paid;
        private String receiptUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ContractInfo {
        private String status;
        private String pdfUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LeaseInfo {
        private LocalDate start;
        private LocalDate end;
        private Integer daysRemaining;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LandlordInfo {
        private String name;
        private String phone;
        private String email;
    }
}

