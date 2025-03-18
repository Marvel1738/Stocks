
/**
 * script.js
 *
 * Purpose:
 * This file contains the JavaScript code for the stock portfolio application's
 * front-end functionality. It handles fetching, adding, updating, deleting,
 * and searching stock data, and dynamically updates the HTML table with
 * the fetched information.
 */

// Run the fetchStocks() function when the page has fully loaded
document.addEventListener("DOMContentLoaded", () => {
    fetchStocks();
});

/**
 * fetchStocks()
 *
 * Fetches stock data from the backend API and populates the stock table.
 *
 * 
 */
function fetchStocks() {
    fetch("http://localhost:8080/api/stocks")  // Fetch all stocks from the API
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            const tableBody = document.getElementById("stockTableBody");
            tableBody.innerHTML = ""; // Clear existing rows

            data.forEach(stock => {
                const row = document.createElement("tr"); // Create a new table row for each stock
                row.innerHTML = `
                    <td>${stock.ticker}</td>
                    <td>${stock.company_name}</td>
                    <td contenteditable="true" data-field="price">${stock.price.toFixed(2)}</td>
                    <td contenteditable="true" data-field="market_cap">${(stock.market_cap / 1e9).toFixed(2)}B</td>
                    <td contenteditable="true" data-field="pe_ratio">${stock.pe_ratio.toFixed(2)}</td>
                    <td>${stock.sector}</td>
                    <td>
                        <button class="save-button">Save</button>
                        <button class="delete-button">Delete</button>
                    </td>
                `; // Populate the row with stock data and action buttons
                tableBody.appendChild(row);  // Append the row to the table

                // Add event listeners after the row is created
                const saveButton = row.querySelector('.save-button');
                const deleteButton = row.querySelector('.delete-button');

                saveButton.addEventListener('click', function() {
                    updateStock(stock.ticker, this); // Attach updateStock function to save button
                });

                deleteButton.addEventListener('click', function() {
                    deleteStock(stock.ticker); // Attach deleteStock function to delete button
                });
            });
        })
        .catch(error => console.error("Error fetching stocks:", error)); // Log any errors during fetch
}

// Add event listener to the "Add Stock" button
document.getElementById("addStockButton").addEventListener("click", addStock);

/**
 * addStock()
 *
 * Adds a new stock to the database via the API and refreshes the stock table.
 *
 * 
 */
function addStock() {
    const stock = {
        ticker: document.getElementById("ticker").value,
        company_name: document.getElementById("companyName").value,
        price: parseFloat(document.getElementById("price").value),
        market_cap: parseFloat(document.getElementById("marketCap").value), 
        pe_ratio: parseFloat(document.getElementById("peRatio").value), 
        sector: document.getElementById("sector").value
    };

    console.log("Stock to add:", stock); // Log the stock data to the console

    fetch("http://localhost:8080/api/stocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stock)
    })
    .then(response => {
        if (response.ok) {
            fetchStocks(); // Refresh table if stock is added successfully
        } else {
            console.error("Failed to add stock. Status:", response.status); // Log error if stock is not added
        }
    })
    .catch(error => console.error("Error:", error)); // Log any errors during fetch
}

/**
 * updateStock(ticker, button)
 *
 * Updates an existing stock's data in the database and refreshes the stock table.
 *
 * @param {string} ticker - The ticker symbol of the stock to update.
 * @param {HTMLButtonElement} button - The button element that triggered the update.
 * @returns {void}
 */

function updateStock(ticker, button) {
    const row = button.parentElement.parentElement; // Get the parent row of the button
    let marketCapString = row.querySelector('[data-field="market_cap"]').innerText;
    const marketCap = parseFloat(marketCapString.replace('B', '')) * 1e9; // Convert market cap to number

    const updatedStock = {
        ticker: ticker,
        company_name: row.cells[1].innerText, // Get company name
        price: parseFloat(row.querySelector('[data-field="price"]').innerText),
        market_cap: marketCap,
        pe_ratio: parseFloat(row.querySelector('[data-field="pe_ratio"]').innerText),
        sector: row.cells[5].innerText // Get sector
    }; // Create an object with the updated stock data

    console.log("Updated Stock:", updatedStock); // Log the updated stock data to the console

    fetch(`http://localhost:8080/api/stocks/${ticker}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedStock)
    }) // Send a PUT request to the API with the updated stock data
    .then(response => {
        if (response.ok) {
            fetchStocks();
            setTimeout(fetchStocks, 200); // Refresh table after 200ms
        } else {
            console.error("Failed to update stock. Status:", response.status);  // Log error if stock is not updated
        }
    })
    .catch(error => console.error("Error:", error)); // Log any errors during fetch
}


/**
 * deleteStock(ticker)
 *
 * Deletes a stock from the database and refreshes the stock table.
 *
 * @param {string} ticker - The ticker symbol of the stock to delete.
 * @returns {void}
 */

function deleteStock(ticker) {
    fetch(`http://localhost:8080/api/stocks/${ticker}`, {
        method: "DELETE"
    }) // Send a DELETE request to the API with the stock ticker
    .then(response => {
        if (response.ok) { 
            fetchStocks(); // Refresh table if stock is deleted successfully
        } else {
            console.error("Failed to delete stock."); // Log error if stock is not deleted
        } 
    })
    .catch(error => console.error("Error:", error)); // Log any errors during fetch
}

// Add event listener to the "Search" button
document.getElementById("searchButton").addEventListener("click", searchStocks);

/**
 * searchStocks()
 *
 * Searches for a stock by ticker symbol and updates the table with the result.
 *
 * @returns {void}
 */

function searchStocks() {
    const searchTerm = document.getElementById("searchInput").value; // Get the search term from the input field
    if (searchTerm.trim() === "") {
        fetchStocks(); // If search term is empty, show all stocks
        return;
    }

    fetch(`http://localhost:8080/api/stocks/${searchTerm}`) // Fetch stock data by ticker symbol
        .then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 404) {
                // Handle case where stock is not found
                alert("Stock not found.");
                fetchStocks(); //show all stocks again.
                return null;
            } else {
                throw new Error(`HTTP error! status: ${response.status}`); // Log error if response status is not 200
            }
        })
        .then(data => {
            if (data) {
                // Update the table with the search results
                updateTableWithSearchResults(data);
            }
        })
        .catch(error => console.error("Error searching stocks:", error)); // Log any errors during fetch
}

/**
 * updateTableWithSearchResults(stock)
 *
 * Updates the stock table with the search results.
 *
 * @param {object} stock - The stock object returned from the search.
 * @returns {void}
 */

function updateTableWithSearchResults(stock) {
    const tableBody = document.getElementById("stockTableBody");
    tableBody.innerHTML = ""; // Clear existing rows

    const row = document.createElement("tr"); // Create a new table row for the stock
    row.innerHTML = `
        <td>${stock.ticker}</td>
        <td>${stock.company_name}</td>
        <td contenteditable="true" data-field="price">${stock.price.toFixed(2)}</td>
        <td contenteditable="true" data-field="market_cap">${(stock.market_cap / 1e9).toFixed(2)}B</td>
        <td contenteditable="true" data-field="pe_ratio">${stock.pe_ratio.toFixed(2)}</td>
        <td>${stock.sector}</td>
        <td>
            <button class="save-button">Save</button>
            <button class="delete-button">Delete</button>
        </td>
    `;
    tableBody.appendChild(row);

    // Add event listeners after the row is created
    const saveButton = row.querySelector('.save-button');
    const deleteButton = row.querySelector('.delete-button');

    saveButton.addEventListener('click', function() {
        updateStock(stock.ticker, this);
    });

    deleteButton.addEventListener('click', function() {
        deleteStock(stock.ticker);
    });
}