package com.x.group2_timtro.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "issues")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Issue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(nullable = false)
    private String title; // Tiêu đề sự cố

    @Column(columnDefinition = "TEXT")
    private String description; // Mô tả chi tiết

    @Column(columnDefinition = "TEXT")
    private String photos; // JSON array of photo URLs

    @Column(nullable = false)
    private String status; // "PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED"

    @Column(columnDefinition = "TEXT")
    private String landlordResponse; // Phản hồi từ chủ trọ

    @Column
    private LocalDateTime resolvedAt;

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

