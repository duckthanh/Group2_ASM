package com.x.group2_timtro.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String bookingId; // Mã đặt chỗ dạng BK-2025-00123

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User tenant;

    @Column(nullable = false)
    private Integer duration; // Thời hạn thuê

    @Column(nullable = false)
    private String durationUnit; // Đơn vị: "MONTH" hoặc "YEAR"

    @Column
    private LocalDate moveInDate; // Ngày dọn vào

    @Column(nullable = false)
    private Integer numberOfPeople; // Số người (max 3)

    @Column(nullable = false)
    private String phoneNumber; // Số điện thoại liên hệ

    @Column(columnDefinition = "TEXT")
    private String note; // Ghi chú thêm

    @Column(nullable = false)
    private String status; // "HOLD", "DEPOSITED", "ACTIVE", "ENDED", "CANCELED"

    @Column(nullable = false)
    private Boolean isDeposit = false; // Đặt cọc hay thuê ngay

    // Hold expiry (for HOLD status)
    @Column
    private LocalDateTime holdExpiresAt; // Hết hạn giữ chỗ

    // Deposit info
    @Column
    private Double depositAmount; // Số tiền cọc
    
    @Column
    private Boolean depositPaid = false; // Đã thanh toán cọc
    
    @Column
    private String depositReceiptUrl; // Link biên lai cọc

    // Lease period (for ACTIVE status)
    @Column
    private LocalDate leaseStart; // Ngày bắt đầu thuê
    
    @Column
    private LocalDate leaseEnd; // Ngày kết thúc thuê

    // Contract info
    @Column
    private String contractStatus; // "PENDING", "SIGNED"
    
    @Column
    private String contractPdfUrl; // Link hợp đồng PDF

    // Cancellation
    @Column(columnDefinition = "TEXT")
    private String cancelReason; // Lý do hủy
    
    @Column
    private String canceledBy; // USER, LANDLORD, SYSTEM

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    @PrePersist
    public void prePersist() {
        if (this.bookingId == null) {
            // Generate booking ID: BK-YYYY-XXXXX
            this.bookingId = generateBookingId();
        }
    }

    private String generateBookingId() {
        int year = LocalDateTime.now().getYear();
        long timestamp = System.currentTimeMillis() % 100000;
        return String.format("BK-%d-%05d", year, timestamp);
    }
}

