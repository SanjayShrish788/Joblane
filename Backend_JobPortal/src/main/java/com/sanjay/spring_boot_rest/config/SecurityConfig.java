package com.sanjay.spring_boot_rest.config;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.*;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.*;
import java.net.URI;
import java.util.List;
@Configuration
public class SecurityConfig {
    @Bean AuthenticationProvider authProvider(UserDetailsService users) {
        var provider=new DaoAuthenticationProvider(users);
        provider.setPasswordEncoder(new BCryptPasswordEncoder(12));
        return provider;
    }
    @Bean CorsConfigurationSource corsConfigurationSource(@Value("${app.frontend-origin}") String origin) {
        URI uri=URI.create(origin);
        if (uri.getHost()==null || origin.contains("*") || uri.getUserInfo()!=null || uri.getQuery()!=null
            || uri.getFragment()!=null || !uri.getPath().isEmpty()
            || !("https".equals(uri.getScheme()) || ("http".equals(uri.getScheme()) && "localhost".equals(uri.getHost()))))
            throw new IllegalArgumentException("FRONTEND_ORIGIN must be one exact HTTPS origin (no trailing slash)");
        var cors=new CorsConfiguration();
        cors.setAllowedOrigins(List.of(origin));
        cors.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
        cors.setAllowedHeaders(List.of("Authorization","Content-Type","X-Requested-With"));
        cors.setAllowCredentials(false);
        cors.setMaxAge(3600L);
        var source=new UrlBasedCorsConfigurationSource(); source.registerCorsConfiguration("/**",cors); return source;
    }
    @Bean SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // Stateless API: a required non-simple header on writes plus exact CORS prevents browser CSRF.
        http.csrf(csrf -> csrf.disable()).cors(Customizer.withDefaults());
        http.addFilterBefore(new ApiWriteFilter(), BasicAuthenticationFilter.class);
        http.authorizeHttpRequests(auth -> auth
            .dispatcherTypeMatchers(jakarta.servlet.DispatcherType.ERROR).permitAll()
            .requestMatchers(HttpMethod.GET,"/actuator/health","/actuator/health/**","/jobPosts","/jobPosts/keyword/**","/jobPost/*").permitAll()
            .requestMatchers(HttpMethod.POST,"/register").permitAll()
            .requestMatchers("/load").denyAll()
            .anyRequest().authenticated());
        http.httpBasic(basic -> basic.authenticationEntryPoint((request,response,error) -> response.sendError(401)));
        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        return http.build();
    }
}
