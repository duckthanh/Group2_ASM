package com.x.group2_timtro.repository;

import com.x.group2_timtro.entity.Booking;
import com.x.group2_timtro.entity.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByBooking(Booking booking);
    List<Document> findByBookingOrderByCreatedAtDesc(Booking booking);
    List<Document> findByDocumentType(String documentType);
}

