import React, { useState, useContext } from 'react';
import { CartoonModal, CartoonButton } from '../shared/Modal';
import { getUser } from '../../hooks/user.actions';
import { Context } from '../../pages/Layout';
import { usePosts } from '../../hooks/posts.actions';

export default function CreateImagePost({ show, onClose, onPostCreated, peerId, serviceId, source = 'etudiant' }) {
  const { showInfo, setShowInfo } = useContext(Context);
  const { createPost } = usePosts(source, peerId, serviceId);
  const user = getUser();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content_type: "IMAGE POST",
    image: null,
    imagePreview: null
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({
        ...form,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title || !form.image) return;

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('author', user.public_id);
    formData.append('title', form.title);
    formData.append('content_type', form.content_type);
    formData.append('image', form.image);
    formData.append('source', source);

    try {
      await createPost(formData);
      if (onPostCreated) {
        onPostCreated();
      }
      setForm({
        title: "",
        content_type: "IMAGE POST",
        image: null,
        imagePreview: null
      });
      onClose();
    } catch (error) {
      setShowInfo({
        showMessage: true,
        message: error.response?.data?.error || "Une erreur est survenue",
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CartoonModal 
      show={show} 
      onClose={onClose}
      title="Partager une image"
    >
      <CartoonModal.Body>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titre de votre image
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl 
                       focus:ring-2 focus:ring-green-500 focus:border-transparent
                       bg-gray-50"
              placeholder="Donnez un titre à votre image..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sélectionner une image
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-32
                         border-2 border-dashed border-gray-300 rounded-xl
                         bg-gray-50 hover:bg-gray-100 cursor-pointer
                         transition-colors duration-200"
              >
                {form.imagePreview ? (
                  <img
                    src={form.imagePreview}
                    alt="Preview"
                    className="h-full w-full object-contain rounded-xl"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Cliquez pour télécharger</span>
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF jusqu'à 10MB</p>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>
      </CartoonModal.Body>

      <CartoonModal.Footer>
        <CartoonButton 
          variant="secondary" 
          onClick={onClose}
          disabled={isSubmitting}
        >
          Annuler
        </CartoonButton>
        <CartoonButton 
          variant="primary"
          onClick={handleSubmit}
          disabled={isSubmitting || !form.title || !form.image}
        >
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              <span>Publication en cours...</span>
            </div>
          ) : (
            'Publier'
          )}
        </CartoonButton>
      </CartoonModal.Footer>
    </CartoonModal>
  );
}
