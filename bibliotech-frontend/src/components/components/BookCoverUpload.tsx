import React, { useState } from 'react';
import axios from 'axios';

const BookCoverUpload = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    
    // Create a preview
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
    
    setError(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Vui lòng chọn file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token'); // Assuming you store your auth token in localStorage
      
      const response = await axios.post('/api/books/upload-cover', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      onUploadSuccess(response.data.imageUrl);
      setLoading(false);
      setFile(null);
      setPreview(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi khi tải lên ảnh');
      setLoading(false);
    }
  };

  return (
    <div className="upload-container">
      <div className="form-group">
        <label>Tải lên ảnh bìa sách:</label>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className="form-control"
        />
      </div>
      
      {preview && (
        <div className="preview-container mt-3">
          <img 
            src={preview} 
            alt="Preview" 
            style={{ maxWidth: '200px', maxHeight: '200px' }} 
            className="img-thumbnail"
          />
        </div>
      )}
      
      {error && <div className="alert alert-danger mt-2">{error}</div>}
      
      <button 
        onClick={handleUpload} 
        disabled={!file || loading} 
        className="btn btn-primary mt-3"
      >
        {loading ? 'Đang tải lên...' : 'Tải lên'}
      </button>
    </div>
  );
};

export default BookCoverUpload;