package com.x.group2_timtro.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long room_id;


}
