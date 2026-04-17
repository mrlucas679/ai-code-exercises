# Shipping Cost Calculator — Strategy Pattern Refactor

A JavaScript exercise demonstrating the Strategy design pattern by refactoring a complex shipping cost function.

## Overview

The original `shipping_cost.js` used nested conditionals to handle different shipping methods. This exercise refactors it into separate strategy objects, each responsible for one shipping method.

## Key Features

- Three shipping strategies: standard, express, and overnight
- A shared `getRateForCountry` helper eliminates duplicated country-lookup logic
- The main `calculateShippingCost` function delegates to the correct strategy

## Project Structure

```text
javascript/
├── src/
│   └── shipping_cost.js      # Refactored implementation using Strategy pattern
├── test/
│   └── shipping_cost.test.js # Jest tests for all shipping strategies
└── package.json
```

## Prerequisites

- Node.js 14.x or higher
- npm

## Installation

```bash
npm install
```

## Running Tests

```bash
npm test
```

## Design Pattern

The **Strategy pattern** allows the shipping method behaviour to be selected at runtime. Each strategy implements a `calculate(packageDetails, destinationCountry)` method, making it easy to add new shipping methods without modifying existing code.
