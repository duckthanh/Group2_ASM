package com.x.group2_timtro.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(nullable = false)
    private String month; // Tháng thanh toán (format: YYYY-MM)

    @Column(nullable = false)
    private Double amount; // Số tiền

    @Column(nullable = false)
    private String status; // "PENDING", "PAID", "OVERDUE"

    @Column
    private String receiptUrl; // Link biên lai

    @Column
    private String paymentMethod; // "CASH", "BANK_TRANSFER", "MOMO", "VNPAY"

    @Column(name = "paid_at")
    private LocalDateTime paidAt; // Thời gian thanh toán

    @Column
    private LocalDateTime dueDate; // Ngày đến hạn

    @Column(columnDefinition = "TEXT")
    private String note;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

