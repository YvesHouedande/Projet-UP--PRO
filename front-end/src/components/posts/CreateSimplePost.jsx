import React, { useState, useContext } from 'react';
import { CartoonModal, CartoonButton } from '../shared/Modal';
import EmojiPicker from 'emoji-picker-react';
import { getUser } from '../../hooks/user.actions';
import { Context } from '../../pages/Layout';
import { usePosts } from '../../hooks/posts.actions';

export default function CreateSimplePost({ show, onClose, onPostCreated, peerId, serviceId, source }) {
    const { showInfo, setShowInfo } = useContext(Context);
    const { createPost } = usePosts(source, peerId, serviceId);
    const user = getUser();

    const [form, setForm] = useState({
        content_type: "SIMPLE POST",
        content: "",
        source: source
    });

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleEmojiClick = (emojiObject) => {
        setForm(prev => ({
            ...prev,
            content: prev.content + emojiObject.emoji
        }));
        setShowEmojiPicker(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!form.content.trim()) return;

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('author', user.public_id);
        formData.append('content_type', form.content_type);
        formData.append('content', form.content);
        formData.append('source', source);

        try {
            await createPost(formData);
            if (onPostCreated) {
                onPostCreated();
            }
            setForm({ ...form, content: "" });
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
            title="Nouvelle publication"
        >
            <CartoonModal.Body>
                <div className="relative">
                    <textarea
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl
                                 focus:ring-2 focus:ring-green-500 focus:border-transparent
                                 bg-gray-50 resize-none"
                        placeholder="Que souhaitez-vous partager ?"
                    />
                    <div className="absolute bottom-3 right-3">
                        <CartoonButton
                            variant="secondary"
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="!p-2"
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
                                        width={300}
                                        height={400}
                                        lazyLoadEmojis={false}
                                        searchDisabled={false}
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
            </CartoonModal.Body>

            <CartoonModal.Footer>
                <CartoonButton 
                    variant="secondary" 
                    onClick={onClose}
                >
                    Annuler
                </CartoonButton>
                <CartoonButton 
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                >
                    Publier
                </CartoonButton>
            </CartoonModal.Footer>
        </CartoonModal>
    );
}
