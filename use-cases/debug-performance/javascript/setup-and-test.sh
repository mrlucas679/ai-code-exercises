#!/bin/bash

# setup-and-test.sh
# Script to initialize the database and test the getCustomerOrderDetails function

echo "=== Setting up and testing the Orders Service ==="
echo ""

# Check if PostgreSQL is running
echo "Step 1: Checking if PostgreSQL is running..."
if command -v docker &> /dev/null; then
  # Check if the orders-postgres container is running
  if docker ps | grep -q orders-postgres; then
    echo "PostgreSQL container is running."
  else
    echo "PostgreSQL container is not running. Starting it..."
    
    # Check if docker-compose is available
    if command -v docker-compose &> /dev/null; then
      echo "Starting PostgreSQL using docker-compose..."
      docker-compose up -d postgres
    else
      echo "Starting PostgreSQL using docker..."
      docker run -d --name orders-postgres -p 5432:5432 orders-service-db
    fi
    
    # Wait for PostgreSQL to start
    echo "Waiting for PostgreSQL to start..."
    sleep 10
  fi
else
  echo "Docker not found. Please make sure PostgreSQL is running manually."
  echo "You can start it using:"
  echo "  - docker-compose up -d postgres"
  echo "  - docker run -d --name orders-postgres -p 5432:5432 orders-service-db"
  echo "  - or start PostgreSQL manually"
  
  read -p "Press Enter to continue once PostgreSQL is running..."
fi

echo ""
echo "Step 2: Initializing the database with sample data..."
node init-db.js

echo ""
echo "Step 3: Testing the getCustomerOrderDetails function..."
node test-query.js

echo ""
echo "=== Setup and test completed ==="