package com.x.group2_timtro.repository;

import com.x.group2_timtro.dto.response.RoomBookingStatsResponse;
import com.x.group2_timtro.entity.Room;
import com.x.group2_timtro.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    List<Room> findByOwner(User owner);
    List<Room> findByIsAvailable(Boolean isAvailable);
    List<Room> findByLocationContainingIgnoreCase(String location);
    
    // Search theo nhiều tiêu chí
    List<Room> findByNameContainingIgnoreCaseOrLocationContainingIgnoreCaseOrDetailContainingIgnoreCase(
        String name, String location, String detail);
    
    // Search theo location và name
    List<Room> findByNameContainingIgnoreCaseAndLocationContainingIgnoreCase(
        String name, String location);
    
    // Find all rooms with owner eagerly fetched
    @Query("SELECT DISTINCT r FROM Room r LEFT JOIN FETCH r.owner")
    List<Room> findAllWithOwner();

    // Top booked rooms for analytics
    @Query("""
        SELECT new com.x.group2_timtro.dto.response.RoomBookingStatsResponse(
            r.id,
            r.name,
            r.imageUrl,
            r.location,
            r.price,
            COUNT(b.id)
        )
        FROM Room r
        LEFT JOIN Booking b ON b.room.id = r.id
        GROUP BY r.id, r.name, r.imageUrl, r.location, r.price
        ORDER BY COUNT(b.id) DESC
        """)
    List<RoomBookingStatsResponse> findTopBookedRooms();
}
