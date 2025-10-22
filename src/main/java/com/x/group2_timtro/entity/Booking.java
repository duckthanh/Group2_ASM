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

    @Column(nullable = false)
    private LocalDate moveInDate; // Ngày dọn vào

    @Column(nullable = false)
    private Integer numberOfPeople; // Số người (max 3)

    @Column(nullable = false)
    private String phoneNumber; // Số điện thoại liên hệ

    @Column(columnDefinition = "TEXT")
    private String note; // Ghi chú thêm

    @Column(nullable = false)
    private String status; // "PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"

    @Column(nullable = false)
    private Boolean isDeposit = false; // Đặt cọc hay thuê ngay

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

