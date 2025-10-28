package com.x.group2_timtro.repository;

import com.x.group2_timtro.entity.Booking;
import com.x.group2_timtro.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByBooking(Booking booking);
    List<Payment> findByBookingOrderByCreatedAtDesc(Booking booking);
    List<Payment> findByStatus(String status);
}

