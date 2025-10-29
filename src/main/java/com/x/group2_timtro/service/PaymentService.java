package com.x.group2_timtro.service;
import com.x.group2_timtro.entity.Booking;
import com.x.group2_timtro.entity.Payment;
import com.x.group2_timtro.repository.BookingRepository;
import com.x.group2_timtro.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@RequiredArgsConstructor
@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;

    public Payment createPayment(Payment payment) {
        payment.setStatus("PENDING");
        payment.setCreatedAt(LocalDateTime.now());
        payment.setUpdatedAt(LocalDateTime.now());
        return paymentRepository.save(payment);
    }

    // Get payments by bookingId
    public List<Payment> getPaymentsByBookingId(Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        return paymentRepository.findByBookingOrderByCreatedAtDesc(booking);
    }

    public Payment getPaymentById(Long id) {
    return paymentRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Payment not found"));
    }


    // Get all payments by status (PENDING, PAID, OVERDUE)
    public List<Payment> getPaymentsByStatus(String status) {
        return paymentRepository.findByStatus(status);
    }

    public Payment updatePaymentStatus(Long id, String status) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setStatus(status);
        if (status.equalsIgnoreCase("PAID")) {
            payment.setPaidAt(LocalDateTime.now());
        }
        payment.setUpdatedAt(LocalDateTime.now());
        return paymentRepository.save(payment);
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }
}