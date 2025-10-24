package com.x.group2_timtro.repository;

import com.x.group2_timtro.entity.Room;
import com.x.group2_timtro.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
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
}

