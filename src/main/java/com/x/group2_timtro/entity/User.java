    package com.x.group2_timtro.entity;

    import com.x.group2_timtro.common.UserStatus;
    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Getter;
    import lombok.NoArgsConstructor;
    import lombok.Setter;
    import org.springframework.security.core.GrantedAuthority;
    import org.springframework.security.core.authority.SimpleGrantedAuthority;
    import org.springframework.security.core.userdetails.UserDetails;

    import java.util.Collection;
    import java.util.List;
    import java.util.stream.Collectors;

    @Entity
    @Table (name = "users")
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public class User implements UserDetails {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private long id;

        @Column(nullable = false)
        private String username;

        @Column(unique = true)
        private String email;

        private String password;

        @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
        private List<UserHasRole> userHasRoles;

        @Enumerated(EnumType.STRING)
        private UserStatus status;

        public void addRole(Role role) {
            this.userHasRoles = List.of(
                    UserHasRole.builder()
                            .user(this)
                            .role(role)
                            .build()
            );
        }

        @Override
        public Collection<? extends GrantedAuthority> getAuthorities() {
            return this.userHasRoles.stream()
                    .map(userHasRole -> new SimpleGrantedAuthority(userHasRole.getRole().getName()))
                    .toList();
        }

        @Override
        public boolean isAccountNonExpired() {
            return UserDetails.super.isAccountNonExpired();
        }

        @Override
        public boolean isAccountNonLocked() {
            return UserDetails.super.isAccountNonLocked();
        }

        @Override
        public boolean isCredentialsNonExpired() {
            return UserDetails.super.isCredentialsNonExpired();
        }

        @Override
        public boolean isEnabled() {
            return this.status == UserStatus.ACTIVE;
        }
    }