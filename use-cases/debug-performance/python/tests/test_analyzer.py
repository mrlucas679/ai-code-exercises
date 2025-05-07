import pytest
from inventory_analyzer.analyzer import find_product_combinations

# Test fixtures
@pytest.fixture
def sample_products():
    return [
        {'id': 1, 'name': 'Product 1', 'price': 100},
        {'id': 2, 'name': 'Product 2', 'price': 150},
        {'id': 3, 'name': 'Product 3', 'price': 200},
        {'id': 4, 'name': 'Product 4', 'price': 250},
        {'id': 5, 'name': 'Product 5', 'price': 300},
    ]

# Tests
def test_find_product_combinations_basic_functionality(sample_products):
    result = find_product_combinations(sample_products, target_price=350, price_margin=10)
    assert len(result) == 1
    assert result[0]['product1']['id'] == 1
    assert result[0]['product2']['id'] == 5
    assert result[0]['combined_price'] == 400

def test_find_product_combinations_with_price_margin(sample_products):
    result = find_product_combinations(sample_products, target_price=350, price_margin=50)
    assert len(result) == 3  # Should match more combinations with a wider margin

def test_find_product_combinations_avoids_duplicates(sample_products):
    result = find_product_combinations(sample_products, target_price=450, price_margin=10)
    # Check if there are no duplicate combinations (product1, product2) and (product2, product1)
    pair_ids = [(r['product1']['id'], r['product2']['id']) for r in result]
    reversed_pairs = [(p2, p1) for (p1, p2) in pair_ids]
    
    # There should be no overlaps between pairs and their reversed versions
    for pair in pair_ids:
        assert (pair[1], pair[0]) not in pair_ids

def test_find_product_combinations_sorts_by_price_difference(sample_products):
    result = find_product_combinations(sample_products, target_price=400, price_margin=100)
    # Check if results are sorted by price_difference (ascending)
    price_diffs = [r['price_difference'] for r in result]
    assert price_diffs == sorted(price_diffs)

@pytest.mark.benchmark
def test_find_product_combinations_performance(benchmark, sample_products):
    def run_find_combinations():
        return find_product_combinations(sample_products, 350, 50)
    
    result = benchmark(run_find_combinations)
    assert len(result) > 0  # Just make sure it produces some result