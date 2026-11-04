package com.sanjay.spring_boot_rest.config;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.Set;
public class ApiWriteFilter extends OncePerRequestFilter {
    @Override protected void doFilterInternal(HttpServletRequest request,HttpServletResponse response,FilterChain chain) throws ServletException,IOException {
        if (!Set.of("GET","HEAD","OPTIONS").contains(request.getMethod()) && !"XMLHttpRequest".equals(request.getHeader("X-Requested-With"))) {
            response.setStatus(403); return;
        }
        chain.doFilter(request,response);
    }
}
