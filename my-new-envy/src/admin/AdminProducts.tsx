import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  text-align: center;
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;

  th, td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
  }

  img {
    max-width: 100px;
    max-height: 100px;
    object-fit: cover;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  margin-right: 10px;
  font-size: 1rem;
  border-radius: 4px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
`;

const DeleteButton = styled(Button)`
  background-color: #f44336;

  &:hover {
    background-color: #d32f2f;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin: 8px 0;
  box-sizing: border-box;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const AddProductSection = styled.div`
  margin-top: 40px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
`;

const SubTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 20px;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const FormItem = styled.div`
  flex: 1;
  min-width: 200px;
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
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    stock: 0,
    imageUrl: '',
  });
  const [imageFiles, setImageFiles] = useState<{ [key: string]: File | null }>({});
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, productId?: string) => {
    const { name, value } = e.target;
    if (productId) {
      setProducts(products.map((product) => 
        product.id === productId ? { ...product, [name]: value } : product
      ));
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, productId?: string) => {
    if (e.target.files) {
      if (productId) {
        setImageFiles({ ...imageFiles, [productId]: e.target.files[0] });
      } else {
        setNewImageFile(e.target.files[0]);
      }
    }
  };

  const handleUploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/products/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data.imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleCreateProduct = async () => {
    let imageUrl = '';
    if (newImageFile) {
      imageUrl = await handleUploadImage(newImageFile);
      if (!imageUrl) return;
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/products`, { ...newProduct, imageUrl }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProducts([...products, response.data]);
      setNewProduct({ name: '', description: '', price: 0, stock: 0, imageUrl: '' });
      setNewImageFile(null);
    } catch (error) {
      console.error('Error creating product:', error);
    }
  };

  const handleUpdateProduct = async (id: string) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;

    let imageUrl = product.imageUrl;
    if (imageFiles[id]) {
      const uploadedImageUrl = await handleUploadImage(imageFiles[id]!);
      if (uploadedImageUrl) {
        imageUrl = uploadedImageUrl;
      } else {
        return;
      }
    }

    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/products/${id}`, { ...product, imageUrl }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProducts(products.map((p) => (p.id === id ? response.data : p)));
      setImageFiles({ ...imageFiles, [id]: null });
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
      <Title>Admin Products Management</Title>
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Image</th>
            <th>Image File</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td><Input type="text" value={product.name} onChange={(e) => handleInputChange(e, product.id)} name="name" /></td>
              <td><Input type="text" value={product.description} onChange={(e) => handleInputChange(e, product.id)} name="description" /></td>
              <td><Input type="number" value={product.price} onChange={(e) => handleInputChange(e, product.id)} name="price" /></td>
              <td><Input type="number" value={product.stock} onChange={(e) => handleInputChange(e, product.id)} name="stock" /></td>
              <td>{product.imageUrl && <img src={product.imageUrl} alt={product.name} />}</td>
              <td><Input type="file" onChange={(e) => handleFileChange(e, product.id)} /></td>
              <td>
                <ButtonContainer>
                  <Button onClick={() => handleUpdateProduct(product.id)}>Update</Button>
                  <DeleteButton onClick={() => handleDeleteProduct(product.id)}>Delete</DeleteButton>
                </ButtonContainer>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <AddProductSection>
        <SubTitle>Add New Product</SubTitle>
        <Form onSubmit={(e) => { e.preventDefault(); handleCreateProduct(); }}>
          <FormItem>
            <Input type="text" placeholder="Name" name="name" value={newProduct.name} onChange={(e) => handleInputChange(e)} />
          </FormItem>
          <FormItem>
            <Input type="text" placeholder="Description" name="description" value={newProduct.description} onChange={(e) => handleInputChange(e)} />
          </FormItem>
          <FormItem>
            <Input type="number" placeholder="Price" name="price" value={newProduct.price} onChange={(e) => handleInputChange(e)} />
          </FormItem>
          <FormItem>
            <Input type="number" placeholder="Stock" name="stock" value={newProduct.stock} onChange={(e) => handleInputChange(e)} />
          </FormItem>
          <FormItem>
            <Input type="file" onChange={(e) => handleFileChange(e)} />
          </FormItem>
          <Button type="submit">Add Product</Button>
        </Form>
      </AddProductSection>
    </Container>
  );
};

export default AdminProducts;
