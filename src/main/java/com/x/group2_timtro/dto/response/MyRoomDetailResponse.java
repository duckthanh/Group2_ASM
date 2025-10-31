package com.x.group2_timtro.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MyRoomDetailResponse {
    private Long id;
    private String bookingId;
    private RoomInfo room;
    private String status;
    private LocalDateTime holdExpiresAt;
    
    // Booking details
    private Integer duration;
    private String durationUnit;
    private LocalDate moveInDate;
    private Integer numberOfPeople;
    private String phoneNumber;
    private String note;
    
    // Deposit info
    private DepositInfo deposit;
    
    // Contract info
    private ContractInfo contract;
    
    // Lease info
    private LeaseInfo lease;
    
    // Landlord info
    private LandlordInfo landlord;
    
    // Payments
    private List<PaymentInfo> payments;
    
    // Documents
    private List<DocumentInfo> documents;
    
    // Issues
    private List<IssueInfo> issues;
    
    // Timeline
    private List<TimelineEvent> timeline;
    
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
    public static class RoomInfo {
        private Long id;
        private String name;
        private String location;
        private Double price;
        private Double area;
        private Integer capacity;
        private String imageUrl;
        private String detail;
        private String paymentQrImageUrl;
        private String paymentDescription; // Content for payment transfer
    }

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
        private Long id;
        private String name;
        private String phone;
        private String email;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentInfo {
        private Long id;
        private String month;
        private Double amount;
        private String status;
        private String receiptUrl;
        private LocalDateTime paidAt;
        private LocalDateTime dueDate;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DocumentInfo {
        private Long id;
        private String documentType;
        private String documentUrl;
        private String fileName;
        private String status;
        private String uploadedBy; // "LANDLORD" or "TENANT"
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class IssueInfo {
        private Long id;
        private String title;
        private String description;
        private String status;
        private LocalDateTime createdAt;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TimelineEvent {
        private String event;
        private String description;
        private LocalDateTime timestamp;
        private String status; // "COMPLETED", "CURRENT", "PENDING"
    }
}

