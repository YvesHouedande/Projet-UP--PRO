import React, { useState } from 'react';
import { Button, Modal, Label, Textarea, TextInput } from 'flowbite-react';
import EmojiPicker from 'emoji-picker-react';
import axiosService from '../../helpers/axios';
import { getUser } from '../../hooks/user.actions';
import { mutate } from 'swr';
import { useContext } from 'react';
import { Context } from '../../pages/Layout';


export default function RichPost({ show, onClose }) {
    const { showInfo, setShowInfo } = useContext(Context)

    const [form, setForm] = useState({
        title: "",
        content_type: "RICH POST",
        content: "",
        image: null,
    });

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const user = getUser();

    const handleEmojiClick = (emojiObject) => {
        setForm({ ...form, content: form.content + emojiObject.emoji });
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm({ ...form, image: file });
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!form.title) {
            alert('Le titre est requis.');
            return;
        }

        const formData = new FormData();
        formData.append('author', user.public_id);
        formData.append('title', form.title);
        formData.append('content_type', form.content_type);
        formData.append('content', form.content);
        if (form.image) {
            formData.append('image', form.image);
        }

        axiosService
            .post('/general_post/', formData)
            .then(() => {
                console.log('Post created 🚀');
                setForm({
                    title: "",
                    content: "",
                    image: null,
                });
                mutate('/general_post');
                onClose();
            })
            .catch((error) => {
                setShowInfo({
                ...showInfo,
                showMessage: true,
                message: error.response.data.error,
                type:'inp_mail'
                })
            });
    };

    return (
        <Modal dismissible show={show} onClose={onClose}>
            <Modal.Header>Poster une Publication</Modal.Header>
            <Modal.Body>
                <div className='my-4'>
                    <div className="mb-2 block">
                        <Label htmlFor="title" value="Titre de votre publication..." />
                    </div>
                    <TextInput 
                        id="title" 
                        type="text" 
                        sizing="sm" 
                        value={form.title} 
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                </div>
                <div className='my-4'>
                    <div className="mb-2 block">
                        <Label htmlFor="imageUpload" value="Télécharger une image..." />
                    </div>
                    <input 
                        id="imageUpload" 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="mb-2"
                    />
                </div>
                <div className="relative my-4">
                    <div className="mb-2 block">
                        <Label htmlFor="content" value="Plus d'informations sur le post ..." />
                    </div>
                    <Textarea 
                        id="content" 
                        placeholder="Description" 
                        required 
                        rows={4} 
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                    />
                    <div className="mt-2 flex items-center relative">
                        <Button 
                            color="gray" 
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="mr-2"
                        >
                            😊
                        </Button>
                        {showEmojiPicker && (
                            <div className="absolute top-12 z-50">
                                <EmojiPicker onEmojiClick={handleEmojiClick} />
                            </div>
                        )}
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="flex justify-between">
                <Button onClick={onClose}>Fermer</Button>
                <Button onClick={handleSubmit}>Envoyer</Button>                
            </Modal.Footer>
        </Modal>
    );
}
