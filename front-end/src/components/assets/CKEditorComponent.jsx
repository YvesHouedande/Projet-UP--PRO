import React, { useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Button, Modal } from 'flowbite-react';

const CKEditorComponent = ({show, onClose}) => {
  const [editorData, setEditorData] = useState('');

  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    setEditorData(data);
  };

  return (
      <Modal show={show} onClose={onClose} >
      <Modal.Header>Écrire un Post</Modal.Header>
      <Modal.Body >
      <div className="h-full w-full">
          <CKEditor
            editor={ClassicEditor}
            data={editorData}
            onChange={handleEditorChange}
            config={{
              toolbar: {
                items: [
                  'heading',
                  '|',
                  'bold',
                  'italic',
                  'underline',
                  'strikethrough',
                  '|',
                  'fontColor',
                  'fontBackgroundColor',
                  '|',
                  'link',
                  '|',
                  'bulletedList',
                  'numberedList',
                  '|',
                  'imageUpload',
                  '|',
                  'undo',
                  'redo'
                ],
              },
              image: {
                toolbar: [
                  'imageTextAlternative',
                  '|',
                  'imageStyle:alignLeft',
                  'imageStyle:full',
                  'imageStyle:alignRight'
                ],
              },
              language: 'fr',
            }}
          />
    </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onClose}>Fermer</Button>
        <Button>Envoyer</Button>
        </Modal.Footer>
    </Modal>
  );
};

export default CKEditorComponent;

