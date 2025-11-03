package com.x.group2_timtro.repository;

import com.x.group2_timtro.dto.response.MonthlyRevenueResponse;
import com.x.group2_timtro.entity.Booking;
import com.x.group2_timtro.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByBooking(Booking booking);
    List<Payment> findByBookingOrderByCreatedAtDesc(Booking booking);
    List<Payment> findByStatus(String status);

    @Query(
        value = """
            SELECT DATE_FORMAT(p.paid_at, '%Y-%m') AS month,
                   SUM(p.amount) AS total_revenue
            FROM payments p
            WHERE p.status = 'PAID'
            GROUP BY DATE_FORMAT(p.paid_at, '%Y-%m')
            ORDER BY DATE_FORMAT(p.paid_at, '%Y-%m')
        """,
        nativeQuery = true
    )
    List<Object[]> getMonthlyRevenueRaw();
}

