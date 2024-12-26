import React, { useState, useRef } from 'react';
import { useUserActions } from '../../hooks/user.actions';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { HiUpload } from 'react-icons/hi';

export default function UpdateUser({ user, handleCloseEdit, mutate }) {
  const userActions = useUserActions();
  const [formData, setFormData] = useState({
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    number: user.number || '',
  });
  
  const [showCropModal, setShowCropModal] = useState(false);
  const [srcImage, setSrcImage] = useState(null);
  const [crop, setCrop] = useState({
    unit: 'px',
    width: 150,
    height: 150,
    x: 0,
    y: 0,
    aspect: 1
  });
  const [croppedImage, setCroppedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user.avatar);
  const imgRef = useRef(null);

  const handleImageSelect = (e) => {
    if (e.target.files?.length > 0) {
      const file = e.target.files[0];
      const validExtensions = ['bmp', 'gif', 'jpg', 'jpeg', 'png', 'webp'];
      const extension = file.name.split('.').pop().toLowerCase();
      
      if (!validExtensions.includes(extension)) {
        alert('Format de fichier non supporté. Veuillez utiliser une image au format : ' + validExtensions.join(', '));
        return;
      }

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setSrcImage(reader.result);
        setShowCropModal(true);
      });
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImg = async (image, crop) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(blob => {
        if (blob) {
          const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' });
          const previewUrl = URL.createObjectURL(file);
          setPreviewUrl(previewUrl);
          setCroppedImage(file);
        }
        resolve(blob);
      }, 'image/jpeg', 1);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });

    if (croppedImage) {
      formDataToSend.append('avatar', croppedImage);
    }

    try {
      await userActions.edit(formDataToSend, user.public_id);
      handleCloseEdit();
    } catch (error) {
      console.error("Erreur lors de la mise à jour", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  return (
    <div className="p-6 bg-white rounded-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Upload Section */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="relative">
            <img 
              src={previewUrl} 
              alt="Avatar preview" 
              className="w-24 h-24 rounded-full object-cover border-2 border-green-200"
            />
            <label className="absolute bottom-0 right-0 bg-green-500 rounded-full p-2 cursor-pointer
                            hover:bg-green-600 transition-colors duration-200">
              <HiUpload className="text-white" />
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/bmp,image/webp"
                onChange={handleImageSelect}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-sm text-gray-600">
            Cliquez sur l'icône pour modifier votre avatar
          </p>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prénom
            </label>
            <input 
              name="first_name" 
              value={formData.first_name} 
              onChange={handleChange} 
              className="w-full p-2 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom
            </label>
            <input 
              name="last_name" 
              value={formData.last_name} 
              onChange={handleChange} 
              className="w-full p-2 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              type="email"
              className="w-full p-2 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent" 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <input 
              type="tel"
              name="number" 
              value={formData.number} 
              onChange={handleChange} 
              pattern="[0-9]{10}"
              className="w-full p-2 border-2 border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent" 
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <button 
            type="button" 
            onClick={handleCloseEdit}
            className="px-4 py-2 border-2 border-green-200 text-green-600 rounded-xl
                     hover:bg-green-50 transition-colors duration-200"
          >
            Annuler
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 bg-green-500 text-white rounded-xl
                     hover:bg-green-600 transition-colors duration-200"
          >
            Enregistrer
          </button>
        </div>
      </form>

      {/* Crop Modal avec crop initial standard et centré */}
      {showCropModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl w-[600px] h-[580px] flex flex-col">
            {/* Header */}
            <div className="p-3 border-b border-gray-200 flex-shrink-0">
              <h3 className="text-lg font-bold text-gray-900">Ajuster l'image</h3>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-auto p-4">
              <div className="h-full flex flex-col">
                <div className="flex-1 flex items-center justify-center min-h-[350px]">
                  {srcImage && (
                    <ReactCrop
                      src={srcImage}
                      crop={crop}
                      onChange={newCrop => setCrop(newCrop)}
                      circularCrop
                      aspect={1}
                      ref={imgRef}
                      className="max-w-full"
                    >
                      <img 
                        src={srcImage} 
                        alt="Crop preview" 
                        onLoad={(e) => {
                          imgRef.current = e.target;
                          const { naturalWidth, naturalHeight } = e.target;
                          
                          // Taille standard pour le crop (150x150 pixels)
                          const standardCropSize = 150;
                          
                          // Calculer les coordonnées pour centrer le crop
                          const centerX = (naturalWidth - standardCropSize) / 2;
                          const centerY = (naturalHeight - standardCropSize) / 2;
                          
                          // Définir le crop initial
                          setCrop({
                            unit: 'px',
                            width: standardCropSize,
                            height: standardCropSize,
                            x: centerX,
                            y: centerY,
                            aspect: 1
                          });
                        }}
                        style={{
                          maxWidth: '400px',
                          maxHeight: '400px',
                          width: 'auto',
                          height: 'auto',
                          objectFit: 'contain'
                        }}
                      />
                    </ReactCrop>
                  )}
                </div>
                <p className="text-sm text-gray-600 text-center mt-3">
                  Faites glisser pour ajuster le cadrage de votre avatar
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-200 flex justify-end gap-3 flex-shrink-0">
              <button
                onClick={() => setShowCropModal(false)}
                className="px-4 py-2 border-2 border-green-200 text-green-600 rounded-xl
                         hover:bg-green-50 transition-colors duration-200 font-medium"
              >
                Annuler
              </button>
              <button
                onClick={async () => {
                  if (imgRef.current && crop.width && crop.height) {
                    await getCroppedImg(imgRef.current, crop);
                    setShowCropModal(false);
                  }
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-xl
                         hover:bg-green-600 transition-colors duration-200 font-medium"
              >
                Valider
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
