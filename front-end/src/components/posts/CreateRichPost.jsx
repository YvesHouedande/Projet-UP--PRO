import React, { useState, useContext } from 'react';
import { CartoonModal, CartoonButton } from '../shared/Modal';
import EmojiPicker from 'emoji-picker-react';
import { getUser } from '../../hooks/user.actions';
import { Context } from '../../pages/Layout';
import { usePosts } from '../../hooks/posts.actions';
import { compressImage, isImageFile, needsCompression } from '../../utils/imageCompression';

export default function RichPost({ show, onClose, onPostCreated, peerId, serviceId, source = 'etudiant' }) {
    const { showInfo, setShowInfo } = useContext(Context);
    const { createPost } = usePosts(source, peerId, serviceId);
    const user = getUser();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');
    const [form, setForm] = useState({
        title: "",
        content_type: "RICH POST",
        content: "",
        image: null,
        imagePreview: null
    });

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            if (isImageFile(file)) {
                let imageToUpload = file;
                
                // Compresser si nécessaire
                if (needsCompression(file)) {
                    setUploadStatus('Compression de l\'image...');
                    imageToUpload = await compressImage(file);
                    setUploadStatus('');
                }

                setForm({
                    ...form,
                    image: imageToUpload,
                    imagePreview: URL.createObjectURL(imageToUpload)
                });
            } else {
                setShowInfo({
                    showMessage: true,
                    message: "Veuillez sélectionner une image valide",
                    type: 'error'
                });
            }
        } catch (error) {
            console.error('Erreur lors du traitement de l\'image:', error);
            setShowInfo({
                showMessage: true,
                message: "Erreur lors du traitement de l'image",
                type: 'error'
            });
        }
    };

    const handleEmojiClick = (emojiObject) => {
        setForm(prev => ({
            ...prev,
            content: prev.content + emojiObject.emoji
        }));
        setShowEmojiPicker(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!form.title || !form.content) return;

        // Créer une version optimiste du post
        const optimisticPost = {
            public_id: Date.now().toString(), // ID temporaire
            title: form.title,
            content: form.content,
            content_type: form.content_type,
            author: user,
            created: new Date().toISOString(),
            updated: new Date().toISOString(),
            likes_count: 0,
            comments_count: 0,
            source: source,
            imagePreview: form.imagePreview
        };

        // Appeler onPostCreated avec le post optimiste
        if (onPostCreated) {
            onPostCreated(optimisticPost);
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('author', user.public_id);
        formData.append('title', form.title);
        formData.append('content_type', form.content_type);
        formData.append('content', form.content);
        formData.append('source', source);
        if (form.image) {
            formData.append('image', form.image);
        }

        try {
            const response = await createPost(formData);
            // Mettre à jour le post optimiste avec les vraies données
            if (onPostCreated) {
                onPostCreated(response);
            }
            setForm({
                title: "",
                content: "",
                content_type: "RICH POST",
                image: null,
                imagePreview: null
            });
            onClose();
        } catch (error) {
            // En cas d'erreur, on peut retirer le post optimiste
            if (onPostCreated) {
                onPostCreated(null); // Signal pour retirer le post optimiste
            }
            console.log(error);
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
            title="Créer un article"
           className="max-h-[90vh] w-full max-w-lg"
        >
            <CartoonModal.Body className="!p-3 sm:!p-4">
                <div className="space-y-3 sm:space-y-4">
                    {/* Titre */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Titre de l'article
                        </label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl
                                     focus:ring-2 focus:ring-green-500 focus:border-transparent
                                     bg-gray-50 text-sm"
                            placeholder="Donnez un titre à votre article..."
                        />
                    </div>

                    {/* Image */}
                    <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Image (optionnel)
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
                                className="flex flex-col items-center justify-center w-full h-20 sm:h-24
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
                                    <div className="text-center">
                                        <p className="text-xs sm:text-sm text-gray-600">
                                            Cliquez pour ajouter une image
                                        </p>
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>

                    {/* Contenu */}
                    <div className="relative">
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                            Contenu de l'article
                        </label>
                        <div className="relative">
                            <textarea
                                value={form.content}
                                onChange={(e) => setForm({ ...form, content: e.target.value })}
                                rows={4}
                                className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl
                                         focus:ring-2 focus:ring-green-500 focus:border-transparent
                                         bg-gray-50 resize-none text-sm"
                                placeholder="Rédigez votre article..."
                            />
                            <div className="absolute bottom-2 right-2">
                                <CartoonButton
                                    variant="secondary"
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    className="!p-1.5 !text-sm"
                                >
                                    😊
                                </CartoonButton>
                                {showEmojiPicker && (
                                    <div className="absolute bottom-full right-0 mb-2 z-50">
                                        <div 
                                            onClick={e => e.stopPropagation()}
                                            className="bg-white rounded-lg shadow-lg"
                                        >
                                            <EmojiPicker 
                                                onEmojiClick={handleEmojiClick}
                                                width={250}
                                                height={300}
                                                lazyLoadEmojis={true}
                                                searchDisabled={true}
                                                skinTonesDisabled={true}
                                                emojiStyle="native"
                                                previewConfig={{
                                                    showPreview: false
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </CartoonModal.Body>

            <CartoonModal.Footer className="!p-3 sm:!p-4">
                <CartoonButton 
                    variant="secondary" 
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="!text-sm !py-1.5"
                >
                    Annuler
                </CartoonButton>
                <CartoonButton 
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !form.title || !form.content}
                    className="!text-sm !py-1.5"
                >
                    {isSubmitting ? (
                        <div className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                            <span>Publication...</span>
                        </div>
                    ) : (
                        'Publier'
                    )}
                </CartoonButton>
            </CartoonModal.Footer>
        </CartoonModal>
    );
}
