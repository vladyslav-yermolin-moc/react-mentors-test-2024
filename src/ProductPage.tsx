import React, { useState, useEffect } from 'react';
import css from './ProductPage.module.css';

interface Product {
  category: {
    id: number,
    name: string,
    image: string
  };
  creationAt: string;
  description: string;
  id: number;
  images: string[];
  price: number;
  title: string;
  updatedAt:  string;
}

const ProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<{ new: boolean; old: boolean }>({
    new: false,
    old: false
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    // Симуляція отримання даних з сервера
    const response = await fetch('https://api.escuelajs.co/api/v1/products?limit=0&offset=0');
    const data = await response.json();
    console.log(data);
    setProducts(data);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    filterProducts();
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
    sortProducts();
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setFilterOptions({ ...filterOptions, [name]: checked });
    filterProducts();
  };

  const filterProducts = () => {
    let filteredProducts = [...products];
    if (filterOptions.new) {
      filteredProducts = filteredProducts.filter((product) => product.creationAt > '2021-01-01');
    }
    if (filterOptions.old) {
      filteredProducts = filteredProducts.filter((product) => product.creationAt < '2021-01-01');
    }
    setProducts(filteredProducts);
  };

  const sortProducts = () => {
    const sortedProducts = [...products];
    if (sortBy === 'priceLowToHigh') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceHighToLow') {
      sortedProducts.sort((a, b) => b.price - a.price);
    }
    setProducts(sortedProducts);
  };

  return (
    <div>
      <input type="text" value={searchTerm} onChange={handleSearchChange} placeholder="Search..." />
      <select value={sortBy} onChange={handleSortChange}>
        <option value="">Sort By</option>
        <option value="priceLowToHigh">Price: Low to High</option>
        <option value="priceHighToLow">Price: High to Low</option>
      </select>
      <label>
        New
        <input type="checkbox" name="new" checked={filterOptions.new} onChange={handleFilterChange} />
      </label>
      <label>
        Old
        <input type="checkbox" name="old" checked={filterOptions.old} onChange={handleFilterChange} />
      </label>

      <div className={css.productList}>
        {products.map((product: Product) => (
          <div key={product.id} className={css.product}>
            <h2>{product.title}</h2>
            <p>Price: ${product.price}</p>
            <p>{product.description}</p>
            <img src={product.images[0]} alt={product.title} className={css.product__image} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductPage;
