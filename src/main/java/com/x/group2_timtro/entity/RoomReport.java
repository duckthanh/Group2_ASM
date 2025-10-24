package com.x.group2_timtro.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "room_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @ManyToOne
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;

    @Column(nullable = false)
    private String reason; // "spam", "wrong_price", "fake_images", "other"

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    @Builder.Default
    private String status = "PENDING"; // PENDING, REVIEWING, RESOLVED, REJECTED

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime reportedAt = LocalDateTime.now();

    @Column
    private LocalDateTime resolvedAt;

    @PrePersist
    public void prePersist() {
        this.reportedAt = LocalDateTime.now();
    }
}

