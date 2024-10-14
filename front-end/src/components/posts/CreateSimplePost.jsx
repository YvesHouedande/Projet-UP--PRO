import React, { useState } from 'react';
import { Button, Modal, Label, Textarea, TextInput } from 'flowbite-react';
import EmojiPicker from 'emoji-picker-react';
import axiosService from '../../helpers/axios';
import { getUser } from '../../hooks/user.actions';
import { mutate } from 'swr';
import { useContext } from 'react';
import { Context } from '../../pages/Layout';


export default function CreateSimplePost({ show, onClose }) {
    // for mail validation
    const { showInfo, setShowInfo } = useContext(Context)

    const [form, setForm] = useState({
        title: "",
        content_type: "SIMPLE POST",
        content: "",
    });

    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const user = getUser();

    const handleEmojiClick = (emojiObject) => {
        setForm({ ...form, content: form.content + emojiObject.emoji });
    };



    const handleSubmit = (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('author', user.public_id);
        formData.append('title', form.title);
        formData.append('content_type', form.content_type);
        formData.append('content', form.content);
        axiosService
            .post('/general_post/', formData)
            .then(() => {
                console.log('Post created 🚀');
                setForm({
                    content: "",
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
            <Modal.Header>Poster une publication</Modal.Header>
            <Modal.Body>
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
