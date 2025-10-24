package com.x.group2_timtro.configuration;

import com.x.group2_timtro.service.UserDetailServiceCustomizer;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfiguration {

    private final JwtDecoderConfiguration jwtDecoderConfiguration;
    private final UserDetailServiceCustomizer userDetailService;


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationConverter jwtAuthenticationConverter) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(authorize -> authorize
                        // Static files - public để xem ảnh (phải đặt đầu tiên)
                        .requestMatchers("/uploads/**").permitAll()
                        // Auth endpoints - public
                        .requestMatchers(HttpMethod.POST, "/api/auth/login", "/api/auth/register", "/api/auth/create-admin").permitAll()
                        // User endpoints - For testing purposes, permit all for now
                        .requestMatchers("/api/users/**").permitAll() 
                        // Room endpoints - For testing purposes, permit all for now
                        .requestMatchers("/api/rooms/**").permitAll()
                        // My Rooms endpoints - For testing purposes, permit all for now
                        .requestMatchers("/api/me/rooms/**").permitAll()
                        // File upload endpoints - For testing purposes, permit all for now
                        .requestMatchers("/api/upload/**").permitAll()
                        // Booking endpoints - For testing purposes, permit all for now
                        .requestMatchers("/api/bookings/**").permitAll()
                        // Saved Rooms endpoints - For testing purposes, permit all for now
                        .requestMatchers("/api/saved-rooms/**").permitAll()
                        // Reports endpoints - For testing purposes, permit all for now
                        .requestMatchers("/api/reports/**").permitAll()
                        // Viewing Schedules endpoints - For testing purposes, permit all for now
                        .requestMatchers("/api/viewing-schedules/**").permitAll()
                        // Tất cả request khác cần authenticated (still keep this for safety)
                        .anyRequest().authenticated()
                )
                .oauth2ResourceServer((oauth2) -> oauth2
                        .jwt(jwtConfigurer -> jwtConfigurer
                                .decoder(jwtDecoderConfiguration)
                                .jwtAuthenticationConverter(jwtAuthenticationConverter()))
                );

        return http.build();
    }



    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider(userDetailService);
        authenticationProvider.setPasswordEncoder(passwordEncoder());

        return new ProviderManager(authenticationProvider);
    }

    @Bean
    public JwtAuthenticationConverter jwtAuthenticationConverter() {
        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
        grantedAuthoritiesConverter.setAuthorityPrefix("");
        grantedAuthoritiesConverter.setAuthoritiesClaimName("authorities"); //scope user

        JwtAuthenticationConverter jwtAuthenticationConverter = new JwtAuthenticationConverter();
        jwtAuthenticationConverter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
        return jwtAuthenticationConverter;
    }

}
