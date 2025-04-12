from setuptools import setup, find_packages

setup(
    name="inventory_analyzer",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[],
    python_requires=">=3.8",
    entry_points={
        "console_scripts": [
            "inventory-analyzer=inventory_analyzer.main:main",
        ],
    },
)