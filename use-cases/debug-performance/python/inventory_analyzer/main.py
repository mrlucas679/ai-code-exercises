#!/usr/bin/env python3

import time
from inventory_analyzer.analyzer import find_product_combinations
from inventory_analyzer.data_generator import generate_product_list

def main():
    print("Inventory Product Combination Analyzer")
    print("=====================================")
    
    # Generate sample data
    print("Generating product data...")
    product_list = generate_product_list(count=5000, seed=42)
    print(f"Generated {len(product_list)} products")
    
    # Analysis parameters
    target_price = 500
    price_margin = 50
    
    # Measure execution time
    print(f"\nFinding product combinations with target price {target_price} ± {price_margin}...")
    start_time = time.time()
    combinations = find_product_combinations(product_list, target_price, price_margin)
    end_time = time.time()
    
    # Report results
    execution_time = end_time - start_time
    print(f"Found {len(combinations)} product combinations")
    print(f"Execution time: {execution_time:.2f} seconds")
    
    # Display top 5 combinations
    if combinations:
        print("\nTop 5 combinations (closest to target price):")
        for i, combo in enumerate(combinations[:5]):
            print(f"{i+1}. {combo['product1']['name']} (${combo['product1']['price']}) + " 
                  f"{combo['product2']['name']} (${combo['product2']['price']}) = "
                  f"${combo['combined_price']} (${combo['price_difference']} from target)")

if __name__ == "__main__":
    main()