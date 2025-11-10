# Cloudinary Setup Instructions

## Overview
The TechFusion app now supports uploading product images directly from your computer. Images are stored on Cloudinary, a cloud-based image management service.

## Setup Steps

### 1. Create a Cloudinary Account
1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. After signing up, you'll be taken to your dashboard

### 2. Get Your Cloudinary Credentials
On your Cloudinary dashboard, you'll find:
- **Cloud Name**
- **API Key**
- **API Secret**

### 3. Update Backend Environment Variables
Add the following to your `backend/.env` file:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name_here
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

Replace the placeholder values with your actual Cloudinary credentials.

### 4. Restart Backend Server
After updating the `.env` file, restart your backend server:

```bash
cd backend
npm run dev
```

## Usage

### For Admin Users
1. Navigate to Admin Dashboard → Products → Add New Product
2. Under "Product Image", you'll see two options:
   - **Image URL**: Enter a direct URL to an image
   - **Upload Image**: Upload an image from your computer (max 5MB)
3. Select "Upload Image" and choose an image file
4. The image will be uploaded to Cloudinary and automatically linked to your product

## Features
- ✅ Support for both URL and local file upload
- ✅ Image validation (file type and size)
- ✅ Automatic image optimization by Cloudinary
- ✅ Image preview before saving
- ✅ Secure upload (admin only)

## Supported Image Formats
- JPEG/JPG
- PNG
- GIF
- WEBP

## File Size Limit
- Maximum: 5MB per image

## Notes
- The free Cloudinary tier includes:
  - 25GB storage
  - 25GB bandwidth per month
  - This should be sufficient for most small to medium projects
