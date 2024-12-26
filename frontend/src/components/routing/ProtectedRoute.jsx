import { Navigate } from 'react-router-dom';
import { getUser } from '../../hooks/user.actions';

export default function ProtectedRoute({ children }) {
  const user = getUser();
  
  if (!user) {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
    return <Navigate to="/login" replace />;
  }

  return children;
} 