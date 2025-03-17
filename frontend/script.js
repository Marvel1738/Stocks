// Run the fetchStocks() function when the page has fully loaded
document.addEventListener("DOMContentLoaded", () => {
    fetchStocks();
});

// Function to fetch stock data from the backend API

// Fetch stocks and populate the table
function fetchStocks() {
    fetch("http://localhost:8080/api/stocks")
        .then(response => response.json())
        .then(data => {
            const tableBody = document.getElementById("stockTableBody");
            tableBody.innerHTML = ""; // Clear existing rows

            data.forEach(stock => {
                const row = document.createElement("tr");
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
            });
        })
        .catch(error => console.error("Error fetching stocks:", error));
}

// Add event listener to the "Add Stock" button
document.getElementById("addStockButton").addEventListener("click", addStock);

// Add a new stock
function addStock() {
    const stock = {
        ticker: document.getElementById("ticker").value,
        company_name: document.getElementById("companyName").value, // Corrected ID
        price: parseFloat(document.getElementById("price").value),
        market_cap: parseFloat(document.getElementById("marketCap").value), // Corrected ID
        pe_ratio: parseFloat(document.getElementById("peRatio").value), // Corrected ID
        sector: document.getElementById("sector").value
    };

    console.log("Stock to add:", stock); // Added console log

    fetch("http://localhost:8080/api/stocks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stock)
    })
    .then(response => {
        if (response.ok) {
            fetchStocks(); // Refresh table
        } else {
            console.error("Failed to add stock. Status:", response.status);
        }
    })
    .catch(error => console.error("Error:", error));
}


function updateStock(ticker, button) {
    const row = button.parentElement.parentElement;
    let marketCapString = row.querySelector('[data-field="market_cap"]').innerText;
    const marketCap = parseFloat(marketCapString.replace('B', '')) * 1e9;

    const updatedStock = {
        ticker: ticker,
        company_name: row.cells[1].innerText, // Get company name
        price: parseFloat(row.querySelector('[data-field="price"]').innerText),
        market_cap: marketCap,
        pe_ratio: parseFloat(row.querySelector('[data-field="pe_ratio"]').innerText),
        sector: row.cells[5].innerText // Get sector
    };

    console.log("Updated Stock:", updatedStock);

    fetch(`http://localhost:8080/api/stocks/${ticker}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedStock)
    })
    .then(response => {
        if (response.ok) {
            fetchStocks();
            setTimeout(fetchStocks, 200);
        } else {
            console.error("Failed to update stock. Status:", response.status);
        }
    })
    .catch(error => console.error("Error:", error));
}


// Delete stock
function deleteStock(ticker) {
    fetch(`http://localhost:8080/api/stocks/${ticker}`, {
        method: "DELETE"
    })
    .then(response => {
        if (response.ok) {
            fetchStocks(); // Refresh table
        } else {
            console.error("Failed to delete stock.");
        }
    })
    .catch(error => console.error("Error:", error));
}

// Add event listener to the "Search" button
document.getElementById("searchButton").addEventListener("click", searchStocks);

function searchStocks() {
    const searchTerm = document.getElementById("searchInput").value;
    if (searchTerm.trim() === "") {
        fetchStocks(); // If search term is empty, show all stocks
        return;
    }

    fetch(`http://localhost:8080/api/stocks/${searchTerm}`)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else if (response.status === 404) {
                // Handle case where stock is not found
                alert("Stock not found.");
                fetchStocks(); //show all stocks again.
                return null;
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        })
        .then(data => {
            if (data) {
                // Update the table with the search results
                updateTableWithSearchResults(data);
            }
        })
        .catch(error => console.error("Error searching stocks:", error));
}

function updateTableWithSearchResults(stock) {
    const tableBody = document.getElementById("stockTableBody");
    tableBody.innerHTML = ""; // Clear existing rows

    const row = document.createElement("tr");
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