package com.x.group2_timtro.repository;

import com.x.group2_timtro.entity.Booking;
import com.x.group2_timtro.entity.Room;
import com.x.group2_timtro.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByTenant(User tenant);
    List<Booking> findByTenantOrderByCreatedAtDesc(User tenant);
    List<Booking> findByTenantAndStatus(User tenant, String status);
    List<Booking> findByTenantAndStatusOrderByCreatedAtDesc(User tenant, String status);
    List<Booking> findByRoom(Room room);
    List<Booking> findByStatus(String status);
    Optional<Booking> findByBookingId(String bookingId);
    
    @Query("SELECT b FROM Booking b WHERE b.tenant = :tenant AND " +
           "(LOWER(b.room.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(b.room.location) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<Booking> searchByTenantAndKeyword(@Param("tenant") User tenant, @Param("keyword") String keyword);
}

