// Nouveau composant Modal personnalisé
export const CartoonModal = ({ children, show, onClose, title }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-[0_10px_20px_rgba(0,0,0,0.15)] 
                    border-4 border-gray-100 transform transition-all duration-300 scale-100">
        {/* Effet de brillance */}
        <div className="absolute -top-2 -left-2 w-20 h-20 bg-white/20 rounded-full blur-xl"></div>
        
        {/* Header */}
        <div className="relative px-6 py-4 border-b-4 border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <h3 className="text-xl font-bold text-gray-800">
            {title}
          </h3>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center 
                     bg-red-500 hover:bg-red-600 text-white rounded-full 
                     transform transition-transform duration-200 hover:scale-110"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 bg-gradient-to-b from-white to-gray-50">
          {children}
        </div>
      </div>
    </div>
  );
};

// Sous-composants pour une meilleure organisation
CartoonModal.Body = ({ children, className = "" }) => (
  <div className={`space-y-4 ${className}`}>
    {children}
  </div>
);

CartoonModal.Footer = ({ children }) => (
  <div className="flex justify-end gap-3 mt-6 pt-4 border-t-2 border-gray-100">
    {children}
  </div>
);

// Boutons stylisés
export const CartoonButton = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false,
  className = "" 
}) => {
  const baseStyles = "px-4 py-2 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-[0_4px_0_rgb(22,163,74)] hover:shadow-[0_2px_0_rgb(22,163,74)] active:translate-y-1",
    secondary: "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 shadow-[0_4px_0_rgb(156,163,175)] hover:shadow-[0_2px_0_rgb(156,163,175)] active:translate-y-1",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-[0_4px_0_rgb(185,28,28)] hover:shadow-[0_2px_0_rgb(185,28,28)] active:translate-y-1"
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}; 