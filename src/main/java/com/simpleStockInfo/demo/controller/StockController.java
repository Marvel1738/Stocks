package com.simpleStockInfo.demo.controller;

import java.util.List;

import com.simpleStockInfo.demo.model.Stock; // Import the Stock model
import com.simpleStockInfo.demo.repository.StockRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;

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

    @GetMapping("/{ticker}") // Handles GET requests to "/stocks/{ticker}"
    public Stock getStockByTicker(@PathVariable String ticker) {
        return stockRepository.findById(ticker).orElse(null); // Return the stock with the given ticker
    }

    @PostMapping // Handles POST requests to "/stocks")
    public Stock addStock(@RequestBody Stock stock) {
        return stockRepository.save(stock); // Save the stock to the database
    }

    @PutMapping("/{ticker}") // Handles PUT requests to "/stocks/{ticker}"
    public Stock updateStock(@PathVariable String ticker, @RequestBody Stock updatedStock) {
        return stockRepository.findById(ticker)
                .map(stock -> {
                    stock.setCompany_name(updatedStock.getCompany_name());
                    stock.setPrice(updatedStock.getPrice());
                    stock.setMarket_cap(updatedStock.getMarket_cap());
                    stock.setPe_ratio(updatedStock.getPe_ratio());
                    stock.setSector(updatedStock.getSector());
                    return stockRepository.save(stock); // Saves updated stock
                }).orElseThrow(() -> new RuntimeException("Stock not found"));
    }

    // ✅ Delete a stock by ticker
    @DeleteMapping("/{ticker}")
    public String deleteStock(@PathVariable String ticker) {
        stockRepository.deleteById(ticker); // Deletes stock by ticker
        return "Stock with ticker " + ticker + " deleted";
    }

}
