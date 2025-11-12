package com.x.group2_timtro.repository;

import com.x.group2_timtro.dto.response.MonthlyRevenueResponse;
import com.x.group2_timtro.dto.response.DailyRevenueResponse;
import com.x.group2_timtro.entity.Booking;
import com.x.group2_timtro.entity.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByBooking(Booking booking);

    List<Payment> findByBookingOrderByCreatedAtDesc(Booking booking);

    List<Payment> findByStatus(String status);

     @Query(value = """
        SELECT DISTINCT DATE_FORMAT(paid_at, '%Y-%m') AS month
        FROM payments
        WHERE status = 'PAID'
        ORDER BY month DESC
    """, nativeQuery = true)
    java.util.List<String> findDistinctMonths();

    @Query(value = """
        SELECT 
            DAY(paid_at) AS day,
            SUM(amount) AS totalRevenue
        FROM payments
        WHERE status = 'PAID'
          AND DATE_FORMAT(paid_at, '%Y-%m') = :month
        GROUP BY DAY(paid_at)
        ORDER BY day
    """, nativeQuery = true)
    java.util.List<Object[]> findDailyRevenueByMonthNative(@Param("month") String month);

    // 📋 Get payments in a month (with pagination)
    @Query(value = """
        SELECT p.*
        FROM payments p
        WHERE p.status = 'PAID'
          AND DATE_FORMAT(p.paid_at, '%Y-%m') = :month
        ORDER BY p.paid_at DESC
    """, nativeQuery = true)
    Page<Payment> findPaymentsByMonth(@Param("month") String month, Pageable pageable);
}


