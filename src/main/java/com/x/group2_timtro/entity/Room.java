package com.x.group2_timtro.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String imageUrl;

    @Column(columnDefinition = "TEXT")
    private String detail;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String contact;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User owner;

    @Column(nullable = false)
    private Boolean isAvailable = true;
    
    // Filter fields
    @Column
    private String roomType; // "Nhà trọ", "Nhà nguyên căn", "Căn hộ"
    
    @Column
    private Double area; // Diện tích (m²)
    
    @Column
    private Integer capacity; // Sức chứa (số người)
    
    @Column(columnDefinition = "TEXT")
    private String amenities; // Tiện nghi (lưu dạng JSON string hoặc comma-separated)
    
    @Column
    private String availability; // "Còn trống", "Sắp trống"

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

