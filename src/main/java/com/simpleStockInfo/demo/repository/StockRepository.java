package com.simpleStockInfo.demo.repository;

import com.simpleStockInfo.demo.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository // Marks this as a repository layer
public interface StockRepository extends JpaRepository<Stock, String> {
    // JpaRepository provides built-in CRUD operations and extends JpaRepository
    // Stock is the entity type and String is the primary key type (ticker)
}
