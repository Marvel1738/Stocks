package com.simpleStockInfo.demo.controller;

import java.util.List;

import com.simpleStockInfo.demo.model.Stock; // Import the Stock model
import com.simpleStockInfo.demo.repository.StockRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

@Configuration
@RestController // Marks this class as a REST API controller
@RequestMapping("/api/stocks") // Base URL for this controller's endpoints
public class StockController {

    @Autowired // Injects the StockRepository dependency
    private StockRepository stockRepository; // Inject the StockRepository

    // This endpoint will return a list of all stocks
    @CrossOrigin(origins = "*") // Allow requests from any origin
    @GetMapping // Handles GET requests to "/stocks/all"
    public List<Stock> getAllStocks() {
        // Dummy data to return as a response
        return stockRepository.findAll(); // Return all stocks from the database
    }

    @CrossOrigin(origins = "*") // Allow requests from any origin

    @GetMapping("/{ticker}")
    public ResponseEntity<?> getStock(@PathVariable String ticker) {
        return stockRepository.findById(ticker)
                .map(stock -> ResponseEntity.ok(stock))
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @CrossOrigin(origins = "*") // Allow requests from any origin
    @PostMapping
    public ResponseEntity<Stock> addStock(@RequestBody Stock stock) {
        Stock savedStock = stockRepository.save(stock);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedStock);
    }

    @CrossOrigin(origins = "*")
    @PutMapping("/{ticker}")
    public ResponseEntity<Stock> updateStock(@PathVariable String ticker, @RequestBody Stock updatedStock) {
        return stockRepository.findById(ticker)
                .map(stock -> {
                    // Update all stock fields
                    stock.setCompany_name(updatedStock.getCompany_name());
                    stock.setPrice(updatedStock.getPrice());
                    stock.setMarket_cap(updatedStock.getMarket_cap());
                    stock.setPe_ratio(updatedStock.getPe_ratio());
                    stock.setSector(updatedStock.getSector());

                    Stock savedStock = stockRepository.save(stock);
                    return ResponseEntity.ok(savedStock);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @CrossOrigin(origins = "*") // Allow requests from any origin
    @DeleteMapping("/{ticker}")
    public ResponseEntity<Void> deleteStock(@PathVariable String ticker) {
        if (!stockRepository.existsById(ticker)) {
            return ResponseEntity.notFound().build();
        }
        stockRepository.deleteById(ticker);
        return ResponseEntity.noContent().build();
    }
}