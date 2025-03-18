package com.simpleStockInfo.demo.repository;

import com.simpleStockInfo.demo.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * StockRepository.java
 *
 * Purpose:
 * This interface defines the repository for the Stock entity, providing data
 * access
 * methods to interact with the 'stocks' table in the database. It extends
 * JpaRepository,
 * which provides built-in CRUD (Create, Read, Update, Delete) operations. The
 * entity type
 * is Stock, and the primary key type is String (ticker).
 */
@Repository // Marks this as a repository layer
public interface StockRepository extends JpaRepository<Stock, String> {
    // JpaRepository provides built-in CRUD operations and extends JpaRepository
    // Stock is the entity type and String is the primary key type (ticker)
}