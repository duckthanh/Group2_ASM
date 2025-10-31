package com.x.group2_timtro.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Document {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(nullable = false)
    private String documentType; // "ID_CARD", "CONTRACT", "RECEIPT", "OTHER"

    @Column(nullable = false)
    private String documentUrl; // Link tài liệu

    @Column
    private String fileName; // Tên file

    @Column(nullable = false)
    private String status; // "PENDING", "APPROVED", "REJECTED"

<<<<<<< HEAD
=======
    @Column
    private String uploadedBy; // "LANDLORD" or "TENANT" - who uploaded this document

>>>>>>> origin/phong28
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

