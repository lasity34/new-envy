import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;

  th, td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
}

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    id: '',
    name: '',
    description: '',
    price: 0,
    stock: 0,
    imageUrl: '',
  });

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
      setProducts(response.data);
    };
    fetchProducts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const handleCreateProduct = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/products`, newProduct, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProducts([...products, response.data]);
      setNewProduct({ id: '', name: '', description: '', price: 0, stock: 0, imageUrl: '' });
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleUpdateProduct = async (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/products/${id}`, product, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProducts(products.map((p) => (p.id === id ? response.data : p)));
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProducts(products.filter((p) => p.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <Container>
      <h1>Admin Products Management</h1>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Image URL</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td><input type="text" value={product.name} onChange={(e) => handleInputChange(e)} name="name" /></td>
              <td><input type="text" value={product.description} onChange={(e) => handleInputChange(e)} name="description" /></td>
              <td><input type="number" value={product.price} onChange={(e) => handleInputChange(e)} name="price" /></td>
              <td><input type="number" value={product.stock} onChange={(e) => handleInputChange(e)} name="stock" /></td>
              <td><input type="text" value={product.imageUrl} onChange={(e) => handleInputChange(e)} name="imageUrl" /></td>
              <td>
                <Button onClick={() => handleUpdateProduct(product.id)}>Update</Button>
                <Button onClick={() => handleDeleteProduct(product.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <h2>Add New Product</h2>
      <input type="text" placeholder="Name" name="name" value={newProduct.name} onChange={handleInputChange} />
      <input type="text" placeholder="Description" name="description" value={newProduct.description} onChange={handleInputChange} />
      <input type="number" placeholder="Price" name="price" value={newProduct.price} onChange={handleInputChange} />
      <input type="number" placeholder="Stock" name="stock" value={newProduct.stock} onChange={handleInputChange} />
      <input type="text" placeholder="Image URL" name="imageUrl" value={newProduct.imageUrl} onChange={handleInputChange} />
      <Button onClick={handleCreateProduct}>Add Product</Button>
    </Container>
  );
};

export default AdminProducts;
