package com.x.group2_timtro.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_has_role")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserHasRole {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    @ManyToOne

    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;



}
