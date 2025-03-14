package com.simpleStockInfo.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity // Marks this class as a database entity so tells java this class is a table in the database
@Table(name = "stocks") // Specifies the table name in the database
@Data // Generates getters and setters using Lombok
@AllArgsConstructor // Generates a constructor with all fields
@NoArgsConstructor // Generates a no-args constructor
public class Stock {

    @Id // Marks this field as the primary key in the database
    private String ticker;
    
    // Fields for the stock object same exact fields as the database table
    private String company_name;
    private double price;
    private double market_cap;
    private double pe_ratio;
    private String sector;
}
