import imageCompression from 'browser-image-compression';

export async function compressImage(imageFile) {
  const options = {
    maxSizeMB: 1,              // Taille maximale en MB
    maxWidthOrHeight: 1920,    // Dimension maximale
    useWebWorker: true,        // Utilise un Web Worker pour ne pas bloquer le thread principal
    initialQuality: 0.8,       // Qualité initiale
  };

  try {
    const compressedFile = await imageCompression(imageFile, options);
    
    // Créer un nouveau fichier avec le même nom
    return new File([compressedFile], imageFile.name, {
      type: compressedFile.type
    });
  } catch (error) {
    console.error('Erreur lors de la compression:', error);
    throw error;
  }
}

// Fonction utilitaire pour vérifier si un fichier est une image
export function isImageFile(file) {
  return file && file.type.split('/')[0] === 'image';
}

// Fonction pour vérifier la taille avant compression
export function needsCompression(file, maxSizeMB = 1) {
  return file.size > maxSizeMB * 1024 * 1024;
} 