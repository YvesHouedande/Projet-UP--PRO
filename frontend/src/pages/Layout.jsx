import React, { createContext, useMemo, useState, useContext } from 'react';
import Navbar from '../components/Navbar';
import MessageModal from '../components/assets/MessageModal';
import EmailValidationModal from '../components/assets/EmailValidationModal';

export const Context = createContext("unknown");

export default function Layout(props) {
    // Utilisation du useState pour gérer l'état "showMessage"
    const [showInfo, setShowInfo] = useState({
    showMessage: false,
    message: "",
    type: "warning",
    showMailBox:false,
});


    // Utilisation du useMemo pour mémoriser la valeur du contexte
    const value = useMemo(() => ({ showInfo, setShowInfo }), [showInfo]);
    return (
        <Context.Provider value={value}>
            <Navbar />
            <MessageModal
                message={showInfo.message}
                showMailBox={showInfo.showMailBox}
                type={showInfo.type}
                showMessage={showInfo.showMessage}
            />
            <EmailValidationModal
                show={showInfo.showMailBox}
            />
            {props.children}
        </Context.Provider>
    );
}
