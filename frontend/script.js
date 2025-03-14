// Run the fetchStocks() function when the page has fully loaded
document.addEventListener("DOMContentLoaded", () => {
    fetchStocks();
});

// Function to fetch stock data from the backend API
function fetchStocks() {
    fetch("http://localhost:8080/api/stocks") // Make a GET request to the backend
        .then(response => response.json()) // Convert the response to JSON format
        .then(data => {
            const tableBody = document.getElementById("stockTableBody"); // Get the table body element
            tableBody.innerHTML = ""; // Clear any existing rows

            // Loop through the stock data and create table rows
            data.forEach(stock => {
                const row = document.createElement("tr"); // Create a new table row

                // Insert stock details into the row using template literals
                row.innerHTML = `
                    <td>${stock.ticker}</td> <!-- Stock symbol -->
                    <td>${stock.company_name}</td> <!-- Company name -->
                    <td>$${stock.price.toFixed(2)}</td> <!-- Stock price (formatted to 2 decimal places) -->
                    <td>$${(stock.market_cap / 1e9).toFixed(2)}B</td> <!-- Market cap converted to billions -->
                    <td>${stock.pe_ratio.toFixed(2)}</td> <!-- P/E ratio (formatted to 2 decimal places) -->
                    <td>${stock.sector}</td> <!-- Industry sector -->
                `;

                tableBody.appendChild(row); // Add the row to the table body
            });
        })
        .catch(error => console.error("Error fetching stocks:", error)); // Handle any errors
}
