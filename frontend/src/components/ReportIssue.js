import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import VoiceRecorder from './VoiceRecorder';
import LanguageSelector from './LanguageSelector';
import './ReportIssue.css';

const ReportIssue = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    photo: null,
    location: '',
    coordinates: null,
    category: 'Pothole',
    description: '',
    voiceRecording: null,
    voiceTranscription: ''
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isLocationLoading, setIsLocationLoading] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Auto-detect location on component mount
  useEffect(() => {
    detectLocation();
  }, []);

  const detectLocation = async () => {
    setIsLocationLoading(true);
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            setFormData(prev => ({
              ...prev,
              coordinates: { lat: latitude, lng: longitude }
            }));
            
            // Mock reverse geocoding (you can integrate with real geocoding API)
            const mockAddress = "22 B Baker St, Ward 5";
            setFormData(prev => ({
              ...prev,
              location: `Auto-detected via GPS • ${mockAddress}`
            }));
            setIsLocationLoading(false);
          },
          (error) => {
            console.error('Error getting location:', error);
            setFormData(prev => ({
              ...prev,
              location: 'Unable to detect location'
            }));
            setIsLocationLoading(false);
          }
        );
      }
    } catch (error) {
      console.error('Geolocation error:', error);
      setIsLocationLoading(false);
    }
  };

  const handlePhotoUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target.result);
        setFormData(prev => ({
          ...prev,
          photo: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    cameraInputRef.current?.click();
  };

  const handleGallerySelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handlePhotoUpload(file);
    }
  };

  const handleCategoryChange = (e) => {
    setFormData(prev => ({
      ...prev,
      category: e.target.value
    }));
  };

  const handleDescriptionChange = (e) => {
    setFormData(prev => ({
      ...prev,
      description: e.target.value
    }));
  };

  const handleVoiceRecordingComplete = (audioBlob, audioUrl) => {
    setFormData(prev => ({
      ...prev,
      voiceRecording: { blob: audioBlob, url: audioUrl }
    }));
  };

  const handleVoiceTranscriptionUpdate = (transcription) => {
    setFormData(prev => ({
      ...prev,
      voiceTranscription: transcription,
      // Automatically fill description if empty
      description: prev.description || transcription
    }));
  };

  const handleLocationChange = () => {
    // In a real app, this would open a map modal for manual location selection
    detectLocation();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.photo) {
      alert(t('photoHelp'));
      return;
    }
    
    if (!formData.description.trim() && !formData.voiceTranscription.trim()) {
      alert('Please provide a description of the issue or record a voice message.');
      return;
    }
    
    if (!formData.location) {
      alert('Location is required to submit the report.');
      return;
    }

    // Submit the report (integrate with backend API)
    console.log('Submitting report:', formData);
    alert(t('success') + '! Report submitted successfully!');
    
    // Reset form
    setFormData({
      photo: null,
      location: '',
      coordinates: null,
      category: 'Pothole',
      description: '',
      voiceRecording: null,
      voiceTranscription: ''
    });
    setPreviewImage(null);
  };

  return (
    <div className="report-issue-container">
      <div className="report-header">
        <div className="header-content">
          <div className="header-left">
            <div className="civic-logo">
              <div className="logo-circle"></div>
              <span>{t('civicConnect')}</span>
            </div>
          </div>
          <div className="header-right">
            <LanguageSelector />
            <button className="header-btn">{t('drafts')}</button>
            <button className="header-btn">{t('help')}</button>
          </div>
        </div>
      </div>

      <div className="report-content">
        <div className="report-form-container">
          <div className="form-header">
            <h1>{t('reportIssue')}</h1>
            <p>{t('reportDescription')}</p>
            <button className="public-report-btn">{t('publicReport')}</button>
          </div>

          <form onSubmit={handleSubmit} className="report-form">
            <div className="form-row">
              <div className="form-section photo-section">
                <h3>{t('uploadPhoto')}</h3>
                
                <div className="photo-upload-area">
                  {previewImage ? (
                    <div className="photo-preview">
                      <img src={previewImage} alt="Issue preview" />
                      <button 
                        type="button" 
                        className="remove-photo-btn"
                        onClick={() => {
                          setPreviewImage(null);
                          setFormData(prev => ({...prev, photo: null}));
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ) : (
                    <div className="upload-options">
                      <button
                        type="button"
                        className="upload-btn camera-btn"
                        onClick={handleCameraCapture}
                      >
                        📷 {t('camera')}
                      </button>
                      <button
                        type="button"
                        className="upload-btn gallery-btn"
                        onClick={handleGallerySelect}
                      >
                        🖼️ {t('gallery')}
                      </button>
                    </div>
                  )}
                </div>
                
                <p className="photo-help-text">
                  {t('photoHelp')}
                </p>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>

              <div className="form-section location-section">
                <h3>{t('location')}</h3>
                
                <div className="location-map">
                  <div className="map-placeholder">
                    <div className="map-marker">📍</div>
                    <div className="map-grid"></div>
                  </div>
                </div>
                
                <div className="location-info">
                  <div className="location-text">
                    {isLocationLoading ? (
                      <span className="location-loading">{t('loading')}</span>
                    ) : (
                      <span className="location-address">{formData.location || 'Location not detected'}</span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="pin-location-btn"
                    onClick={handleLocationChange}
                    disabled={isLocationLoading}
                  >
                    📍 {t('pinned')}
                  </button>
                </div>
                
                <p className="location-help-text">
                  {t('locationHelp')}
                </p>
              </div>
            </div>

            <div className="form-section category-section">
              <h3>{t('category')}</h3>
              <select 
                value={formData.category}
                onChange={handleCategoryChange}
                className="category-select"
              >
                <option value="Pothole">{t('pothole')}</option>
                <option value="Garbage">{t('garbage')}</option>
                <option value="Streetlight">{t('streetlight')}</option>
                <option value="Water">{t('water')}</option>
                <option value="Others">{t('others')}</option>
              </select>
              <p className="category-options">Options: {t('pothole')}, {t('garbage')}, {t('streetlight')}, {t('water')}, {t('others')}</p>
            </div>

            {/* Voice Recording Section */}
            <VoiceRecorder 
              onRecordingComplete={handleVoiceRecordingComplete}
              onTranscriptionUpdate={handleVoiceTranscriptionUpdate}
            />

            <div className="form-section description-section">
              <h3>{t('description')}</h3>
              <textarea
                value={formData.description}
                onChange={handleDescriptionChange}
                placeholder={t('descriptionPlaceholder')}
                className="description-textarea"
                rows="6"
              />
              <p className="description-help-text">
                {t('descriptionHelp')}
              </p>
              {formData.voiceTranscription && (
                <div className="voice-transcription-notice">
                  <p className="transcription-notice-text">
                    💡 Voice transcription has been automatically added to your description above. You can edit it if needed.
                  </p>
                </div>
              )}
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {t('submitReport')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;