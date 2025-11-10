import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { productService } from '../../services/productService';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState('url'); // 'url' or 'file'
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'Laptops',
    brand: '',
    images: [''],
    stock: '',
    isFeatured: false
  });

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await productService.getProductById(id);
      setFormData({
        name: data.name,
        description: data.description,
        price: data.price,
        originalPrice: data.originalPrice || '',
        category: data.category,
        brand: data.brand,
        images: data.images,
        stock: data.stock,
        isFeatured: data.isFeatured
      });
    } catch (error) {
      toast.error('Product not found');
      navigate('/admin/products');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      // Get token from auth-storage (Zustand persist)
      const authStorage = localStorage.getItem('auth-storage');
      let token = null;
      if (authStorage) {
        const { state } = JSON.parse(authStorage);
        token = state?.token;
      }

      if (!token) {
        throw new Error('Authentication token not found. Please login again.');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL || '/api'}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formDataUpload
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Upload failed:', response.status, errorData);
        throw new Error(errorData.message || `Upload failed: ${response.status}`);
      }

      const data = await response.json();
      setFormData({ ...formData, images: [data.url] });
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      if (error.message.includes('token')) {
        toast.error('Authentication error. Please logout and login again.');
      } else {
        toast.error(error.message || 'Failed to upload image');
      }
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : 0,
        stock: parseInt(formData.stock)
      };

      if (isEdit) {
        await productService.updateProduct(id, productData);
        toast.success('Product updated successfully');
      } else {
        await productService.createProduct(productData);
        toast.success('Product created successfully');
      }
      navigate('/admin/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Laptops', 'Smartphones', 'Tablets', 'Accessories', 'Smart Watches', 'Headphones', 'Cameras', 'Gaming'];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Product Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Description *</label>
              <textarea
                required
                rows="4"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Price *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Original Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input-field"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Brand *</label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Stock *</label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="input-field"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-5 h-5"
                />
                <span className="text-sm font-semibold">Featured Product</span>
              </label>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2">Product Image *</label>
              
              {/* Toggle between URL and File upload */}
              <div className="flex gap-4 mb-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="url"
                    checked={uploadMethod === 'url'}
                    onChange={(e) => setUploadMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Image URL</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="file"
                    checked={uploadMethod === 'file'}
                    onChange={(e) => setUploadMethod(e.target.value)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Upload Image</span>
                </label>
              </div>

              {/* Image URL Input */}
              {uploadMethod === 'url' && (
                <input
                  type="url"
                  required
                  value={formData.images[0]}
                  onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                  className="input-field"
                  placeholder="https://example.com/image.jpg"
                />
              )}

              {/* File Upload Input */}
              {uploadMethod === 'file' && (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="input-field"
                  />
                  {uploading && (
                    <p className="text-sm text-blue-600 mt-2">Uploading image...</p>
                  )}
                </div>
              )}

              {/* Image Preview */}
              {formData.images[0] && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                  <img
                    src={formData.images[0]}
                    alt="Product preview"
                    className="w-48 h-48 object-cover rounded-lg border border-gray-300"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={loading} className="btn-primary flex-1">
              {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin/products')}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProductForm;
