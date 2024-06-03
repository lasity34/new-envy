import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../db/database.js';
import { uploadFileToS3 } from '../services/aws-services.js';

// Fetch all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (error) {
    console.error('Error fetching all products:', error);
    res.status(500).json({ error: error.message });
  }
};

// Fetch a single product by ID
export const getProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await getProductById(id);
    if (!product) {
      console.error(`Product not found with ID: ${id}`);
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error(`Error fetching product with ID: ${id}`, error);
    res.status(500).json({ error: error.message });
  }
};


export const addProduct = async (req, res) => {
  const { name, description, price, stock } = req.body;
  let imageUrl = '';

  try {
    if (req.file) {
      console.log('File received for add product:', req.file);
      imageUrl = await uploadFileToS3(req.file);
      console.log('Uploaded image URL:', imageUrl);
    }

    console.log('Creating product with data:', { name, description, price, stock, imageUrl });
    const newProduct = await createProduct({ name, description, price, stock, imageUrl });
    console.log('New product created:', newProduct);
  
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateProductDetails = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock } = req.body;
  let imageUrl = req.body.imageUrl;

  try {
    if (req.file) {
    
      imageUrl = await uploadFileToS3(req.file);
      console.log('Uploaded image URL:', imageUrl);
    }

  
    const updatedProduct = await updateProduct(id, { name, description, price, stock, imageUrl });
    if (!updatedProduct) {
      console.error(`Product not found for update with ID: ${id}`);
      return res.status(404).json({ error: 'Product not found' });
    }
    console.log(`Updated product:`, updatedProduct);
  
    res.json(updatedProduct);
  } catch (error) {
    console.error(`Error updating product with ID: ${id}`, error);
    res.status(500).json({ error: error.message });
  }
};


// Delete a product
export const removeProduct = async (req, res) => {
  const { id } = req.params;
  try {
    console.log(`Deleting product with ID: ${id}`);
    const deletedProduct = await deleteProduct(id);
    if (!deletedProduct) {
      console.error(`Product not found for deletion with ID: ${id}`);
      return res.status(404).json({ error: 'Product not found' });
    }
    console.log('Deleted product:', deletedProduct);
    res.json(deletedProduct);
  } catch (error) {
    console.error(`Error deleting product with ID: ${id}`, error);
    res.status(500).json({ error: error.message });
  }
};

// Upload image and return the URL
export const uploadImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      console.error('No file uploaded');
      return res.status(400).send({ error: 'No file uploaded' });
    }

    console.log('File to upload:', file);
    const imageUrl = await uploadFileToS3(file);
    console.log('Uploaded image URL:', imageUrl);
    res.status(200).send({ imageUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).send({ error: 'Failed to upload image' });
  }
};
