
import React, { useState, useContext } from 'react';
import { Button, Modal, Label, TextInput } from 'flowbite-react';
import { Context } from '../../pages/Layout';
import Loading from './Loading';
import axiosService from '../../helpers/axios';

const EmailValidationModal = ({ show, onClose }) => {
  const { showInfo, setShowInfo } = useContext(Context);
  const [email, setEmail] = useState('');
  const [validationCode, setValidationCode] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(false);

  // Fonction pour confirmer l'email et passer à la validation
  const handleEmailConfirm = async () => {
    try {
      setLoading(true);
      const response = await axiosService.post('send-validation-code-to-email/', { email });
      setMessage(response.data.message);
      setIsEmailConfirmed(true); // Passe à l'étape de validation
    } catch (error) {
      setMessage(error.response?.data?.error || "Une erreur s'est produite: Il se peut que l'email ait déjà été utilisé.");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour valider le code
  const validateCode = async () => {
    try {
      setLoading(true);
      const response = await axiosService.post('validate-email-code/', { code: validationCode });
      setMessage(response.data.message);
      // Ici, vous pouvez ajouter des actions supplémentaires après validation
    } catch (error) {
      setMessage(error.response?.data?.error || "Code incorrect. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour revenir à la saisie de l'email
  const handleBackToEmailInput = () => {
    setIsEmailConfirmed(false);
    setValidationCode(''); 
    setMessage(''); 
  };

  // Affichage du composant de chargement si en cours
  if (loading) return <Loading />;

  return (
    <Modal show={show} onClose={() => setShowInfo({ ...showInfo, showMailBox: false })}>
      <Modal.Header>Validation de l'Email INP</Modal.Header>
      <Modal.Body>
        {!isEmailConfirmed ? (
          <div className="my-4">
            <Label htmlFor="email" value="Entrez votre email INP" />
            <TextInput
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Votre email INP"
              required
            />
            <Button onClick={handleEmailConfirm} disabled={loading || !email} className="mt-4">
              Confirmer l'email
            </Button>
            {message && <p className="text-red-500 mt-2">{message}</p>}
          </div>
        ) : (
          <div className="my-4">
            <Label htmlFor="validation-code" value="Entrez le code de validation" />
            <TextInput
              id="validation-code"
              value={validationCode}
              onChange={(e) => setValidationCode(e.target.value)}
              placeholder="Code de validation"
              required
            />
            <Button onClick={validateCode} disabled={loading} className="mt-4">
              Valider le code
            </Button>
            {message && <p className="text-red-500 mt-2">{message}</p>}
            <Button onClick={handleBackToEmailInput} disabled={loading} className="mt-4">
              Retour
            </Button>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={isEmailConfirmed ? validateCode : handleEmailConfirm} disabled={loading}>
          {isEmailConfirmed ? 'Renvoyer le code' : 'Envoyer'}
        </Button>
        <Button onClick={() => setShowInfo({ ...showInfo, showMailBox: false })}>Fermer</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EmailValidationModal;


