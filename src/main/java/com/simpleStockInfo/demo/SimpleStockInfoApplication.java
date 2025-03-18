package com.simpleStockInfo.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * SimpleStockInfoApplication.java
 *
 * Purpose:
 * This is the main entry point for the Spring Boot application. It initializes
 * and
 * starts the application using SpringApplication.run().
 * The @SpringBootApplication
 * annotation combines @Configuration, @EnableAutoConfiguration,
 * and @ComponentScan
 * to enable Spring Boot's auto-configuration and component scanning features.
 */
@SpringBootApplication
public class SimpleStockInfoApplication {

	public static void main(String[] args) {
		SpringApplication.run(SimpleStockInfoApplication.class, args);
	}
}