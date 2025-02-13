import React, { useState } from 'react';
import { Upload, ImageIcon, Loader } from 'lucide-react';
import './style.css'
const ObjectDetection = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [annotatedImage, setAnnotatedImage] = useState(null);
  const [counts, setCounts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleImageUpload = async (file) => {
    if (!file) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/detect', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setOriginalImage(`data:image/jpeg;base64,${data.original_image}`);
      setAnnotatedImage(`data:image/jpeg;base64,${data.annotated_image}`);
      setCounts(data.counts);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">Screw Counter</h1>

        <div 
          className={`upload-area ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="upload-content">
            <Upload className="upload-icon" />
            <div className="upload-text">
              Drop your image here or{' '}
              <label className="browse-label">
                browse
                <input
                  type="file"
                  className="file-input"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e.target.files[0])}
                />
              </label>
            </div>
            <p className="upload-support">Supports: JPG, PNG, WEBP</p>
          </div>
        </div>

        {isLoading && (
          <div className="loading">
            <Loader className="loading-icon" />
            <span>Processing image...</span>
          </div>
        )}

        {counts && (
          <div className="results-card">
            <h2 className="results-title">Detection Results</h2>
            <div className="counts-grid">
              {Object.entries(counts).map(([className, count]) => (
                <div key={className} className="count-card">
                  <div className="count-label">Total {className}</div>
                  <div className="count-value">{count}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(originalImage || annotatedImage) && (
          <div className="images-grid">
            {originalImage && (
              <div className="image-card">
                <h3 className="image-title">
                  <ImageIcon className="image-icon" />
                  Original Image
                </h3>
                <img 
                  src={originalImage} 
                  alt="Original" 
                  className="result-image"
                />
              </div>
            )}
            
            {annotatedImage && (
              <div className="image-card">
                <h3 className="image-title">
                  <ImageIcon className="image-icon" />
                  Detected Objects
                </h3>
                <img 
                  src={annotatedImage} 
                  alt="Annotated" 
                  className="result-image"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ObjectDetection;