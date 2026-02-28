package com.datp.user_service.security;

import java.io.IOException;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;


@Component
public class JwtAuthFilter extends OncePerRequestFilter {

	@Autowired
	private JwtUtil jwtUtil;
	

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		String authHeader = request.getHeader("Authorization");
//		System.out.println("filter - 0");
		
		if(authHeader !=null && authHeader.startsWith("Bearer ")) {
			String token = authHeader.substring(7);
//			System.out.println("filter - 1" + token);
			
			if(jwtUtil.validateToken(token)) {
				String email = jwtUtil.extractEmail(token);
//				System.out.println("filter - 3" + email);
				
				UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(email, null, Collections.emptyList());
				
				authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
				
				SecurityContextHolder.getContext().setAuthentication(authentication);
			}
		}
		
		filterChain.doFilter(request, response);
		
	}
	

}
