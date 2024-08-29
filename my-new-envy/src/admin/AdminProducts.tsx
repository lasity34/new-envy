import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { FaEdit, FaTrash } from 'react-icons/fa';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  color: #333;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #45a049;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
`;

const Th = styled.th`
  background-color: #f2f2f2;
  color: #333;
  font-weight: bold;
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid #ddd;
`;

const Td = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ddd;
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 4px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ActionButton = styled.button`
  padding: 5px 10px;
  margin-right: 5px;
  background-color: #008CBA;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;

  &:hover {
    background-color: #007B9A;
  }
`;

const DeleteButton = styled(ActionButton)`
  background-color: #f44336;

  &:hover {
    background-color: #d32f2f;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const SaveButton = styled(Button)`
  background-color: #4CAF50;
  &:hover {
    background-color: #45a049;
  }
`;

const CancelButton = styled(Button)`
  background-color: #f44336;
  &:hover {
    background-color: #d32f2f;
  }
`;

const HomeButton = styled(Button)`
  background-color: #2e2c2c;
  &:hover {
    background-color: #464343;
  }
`;


const StockManagement = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const StockInput = styled(Input)`
  width: 80px;
`;




const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product> | null>(null);
  const [stockChange, setStockChange] = useState<{ [key: string]: number }>({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get<Product[]>(`${process.env.REACT_APP_API_URL}/api/products`);
      // Ensure all product properties are of the correct type
      const typeSafeProducts = response.data.map(product => ({
        ...product,
        price: Number(product.price),
        stock: Number(product.stock)
      }));
      setProducts(typeSafeProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products. Please try again later.');
      setLoading(false);
    }
  };



  const openModal = (product: Product | null = null) => {
    if (product) {
      setCurrentProduct({ ...product });
    } else {
      setCurrentProduct({ name: '', description: '', price: 0, stock: 0, imageUrl: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentProduct(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentProduct(prev => {
      if (!prev) return null;
      if (name === 'price' || name === 'stock') {
        return { ...prev, [name]: Number(value) };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleStockInputChange = (e: React.ChangeEvent<HTMLInputElement>, productId: string) => {
    const value = parseInt(e.target.value, 10) || 0;
    setStockChange({ ...stockChange, [productId]: value });
  };

  const handleStockUpdate = async (productId: string) => {
    const change = stockChange[productId];
    if (change === undefined) return;

    try {
      const product = products.find(p => p.id === productId);
      if (!product) return;

      const newStock = product.stock + change;
      await axios.put(`${process.env.REACT_APP_API_URL}/api/products/${productId}`, 
        { ...product, stock: newStock },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      setProducts(products.map(p => p.id === productId ? { ...p, stock: newStock } : p));
      setStockChange({ ...stockChange, [productId]: 0 });
    } catch (error) {
      console.error('Error updating stock:', error);
      setError('Failed to update stock. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) return;

    try {
      if (currentProduct.id) {
        // Editing existing product
        const response = await axios.put(
          `${process.env.REACT_APP_API_URL}/api/products/${currentProduct.id}`,
          currentProduct,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );
        setProducts(products.map(p => p.id === currentProduct.id ? response.data : p));
      } else {
        // Adding new product
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/products`,
          currentProduct,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }
        );
        setProducts([...products, response.data]);
      }
      closeModal();
    } catch (error) {
      console.error('Error saving product:', error);
      setError('Failed to save product. Please try again.');
    }
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`${process.env.REACT_APP_API_URL}/api/products/${productId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setProducts(products.filter(p => p.id !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
        setError('Failed to delete product. Please try again.');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <PageContainer>
      <Header>
        <Title>Product Management</Title>
        <HomeButton onClick={() => navigate('/admin/dashboard')}>Back to Dashboard</HomeButton>
      </Header>
      <Button onClick={() => openModal()}>Add New Product</Button>
      <Table>
        <thead>
          <tr>
            <Th>Image</Th>
            <Th>Name</Th>
            <Th>Description</Th>
            <Th>Price</Th>
            <Th>Stock</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <Td><ProductImage src={product.imageUrl} alt={product.name} /></Td>
              <Td>{product.name}</Td>
              <Td>{product.description}</Td>
              <Td>R{product.price.toFixed(2)}</Td>
              <Td>
                <StockManagement>
                  <span>Current: {product.stock}</span>
                  <StockInput
                    type="number"
                    value={stockChange[product.id] || 0}
                    onChange={(e) => handleStockInputChange(e, product.id)}
                    placeholder="Change"
                  />
                  <Button onClick={() => handleStockUpdate(product.id)}>Update Stock</Button>
                </StockManagement>
              </Td>
              <Td>
                <ActionButton onClick={() => openModal(product)}><FaEdit /></ActionButton>
                <DeleteButton onClick={() => handleDelete(product.id)}><FaTrash /></DeleteButton>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
      {isModalOpen && (
        <Modal>
          <ModalContent>
            <h2>{currentProduct?.id ? 'Edit Product' : 'Add New Product'}</h2>
            <Form onSubmit={handleSubmit}>
              <FormGroup>
                <Label>Name:</Label>
                <Input
                  type="text"
                  name="name"
                  value={currentProduct?.name || ''}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Description:</Label>
                <TextArea
                  name="description"
                  value={currentProduct?.description || ''}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Price:</Label>
                <Input
                  type="number"
                  name="price"
                  value={currentProduct?.price || ''}
                  onChange={handleInputChange}
                  required
                  step="0.01"
                />
              </FormGroup>
              <FormGroup>
                <Label>Stock:</Label>
                <Input
                  type="number"
                  name="stock"
                  value={currentProduct?.stock || ''}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label>Image URL:</Label>
                <Input
                  type="text"
                  name="imageUrl"
                  value={currentProduct?.imageUrl || ''}
                  onChange={handleInputChange}
                  required
                />
              </FormGroup>
              <ModalButtons>
                <SaveButton type="submit">Save</SaveButton>
                <CancelButton type="button" onClick={closeModal}>Cancel</CancelButton>
              </ModalButtons>
            </Form>
          </ModalContent>
        </Modal>
      )}
    </PageContainer>
  );
};

export default AdminProducts;