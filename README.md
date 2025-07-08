# renart-demo

This project demonstrates a product listing application with filtering capabilities, built using Next.js. It fetches product data and dynamically calculates prices based on a gold price API.

## Features and Functionality

*   **Product Listing:** Displays a list of products with their names, images, prices, and popularity ratings.
*   **Dynamic Pricing:** Calculates product prices based on their popularity score, weight, and the current gold price fetched from an external API.
*   **Filtering:** Allows users to filter products based on:
    *   Minimum and maximum price.
    *   Minimum popularity rating (star rating).
    *   Available colors.
*   **Product Details:**  Retrieves and displays detailed information for a specific product.
*   **Color Variants:** Displays product images based on selected color.
*   **Responsive Design:** Uses scss modules for styling.
*   **Client-Side Routing:** Utilizes `next/navigation` for client-side routing and URL parameter management.

## Technology Stack

*   **Next.js:**  A React framework for building performant web applications.
*   **React:**  A JavaScript library for building user interfaces.
*   **JavaScript (ES6+):**  The primary programming language.
*   **SCSS:** CSS preprocessor for styling.
*   **goldapi.io:** (Potentially) External API for fetching gold prices.
*   **Vercel:** Used to fetch initial data.

## Prerequisites

*   Node.js (version 18 or higher recommended)
*   npm or yarn package manager
*   A [goldapi.io](https://www.goldapi.io/) API key (if you want to use live gold prices).
    *   Set the `GOLD_API_KEY` environment variable.  If you do not have a key or prefer not to use one, the application will gracefully fall back to a gold price of 0.

## Installation Instructions

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/farukkamcici/renart-demo.git
    cd renart-demo
    ```

2.  **Install dependencies:**

    ```bash
    npm install  # or yarn install
    ```

3.  **Set up environment variables:**

    Create a `.env.local` file in the root directory and add your `GOLD_API_KEY`:

    ```
    GOLD_API_KEY=YOUR_GOLD_API_KEY
    ```

    If you do not have a gold API key, you can leave the variable empty, and the application will use a default gold price of `0`.

4.  **Run the development server:**

    ```bash
    npm run dev  # or yarn dev
    ```

    The application will be available at `http://localhost:3000`.

## Usage Guide

1.  **Access the application:** Open your web browser and navigate to `http://localhost:3000`.

2.  **View product listings:** The main page displays a list of products.  You can scroll horizontally through the product list.

3.  **Apply filters:** Use the filter controls on the left-hand side to refine the product list.
    *   **Price Range:** Enter minimum and maximum price values.
    *   **Minimum Rating:** Select a minimum star rating.
    *   **Color:** Check the boxes for the desired colors (yellow, white, rose).

4.  **Clear filters:**  Remove the filter values from the price/rating inputs or uncheck the color checkboxes and click "Apply".

5.  **Observe dynamic pricing:** The product prices will update automatically based on the gold price fetched from the API (or a default price of 0 if the API key is not available or the API request fails).  Product prices are calculated by the `priceCalculator` function located in `lib/priceCalculator.js`.

## API Documentation

The application exposes the following API endpoints:

*   **`/api/products`**: Retrieves a list of products, optionally filtered by price, popularity, and color.

    *   **Method:** `GET`
    *   **Query Parameters:**
        *   `minPrice`: Minimum price (number).
        *   `maxPrice`: Maximum price (number).
        *   `minPopularity`: Minimum popularity score (number, corresponding to star rating).
        *   `color`: Comma-separated list of colors (string).  Valid colors are "yellow", "white", and "rose".

        Example: `/api/products?minPrice=100&maxPrice=500&minPopularity=3&color=yellow,rose`

        This will return all products that satisfy all of the criteria: a price between $100 and $500, a rating of at least 3 stars, and image variants for yellow and rose gold exist.

*   **`/api/products/[id]`**: Retrieves a specific product by its ID.

    *   **Method:** `GET`
    *   **Path Parameter:**
        *   `id`: The ID of the product (number).

        Example: `/api/products/1`

        This will return details of the product whose ID is `1`.

    *   **Error Handling:**
        *   Returns a 400 status code with `INVALID_ID` code if the ID is not a number.
        *   Returns a 404 status code with `PRODUCT_NOT_FOUND` code if the product with the specified ID is not found.

## Contributing Guidelines

Contributions are welcome! To contribute:

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and commit them with descriptive messages.
4.  Push your changes to your forked repository.
5.  Submit a pull request to the `main` branch of the original repository.

## License Information

No license specified. All rights reserved.

## Contact/Support Information

For questions or support, please contact the repository owner through GitHub.
