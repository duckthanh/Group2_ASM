package com.x.group2_timtro.repository;

import com.x.group2_timtro.entity.Booking;
import com.x.group2_timtro.entity.Room;
import com.x.group2_timtro.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByTenant(User tenant);
    List<Booking> findByRoom(Room room);
    List<Booking> findByStatus(String status);
}

