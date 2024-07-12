class CustomUploadAdapter {
  constructor(loader, uploadUrl) {
    this.loader = loader;
    this.uploadUrl = uploadUrl;
  }

  // Starts the upload process.
  upload() {
    return this.loader.file
      .then(file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result.split(',')[1];
          resolve({
            default: `data:${file.type};base64,${base64}`
          });
        };
        reader.onerror = err => reject(err);
        reader.readAsDataURL(file);
      }))
      .catch(err => {
        console.error('Error reading file:', err);
      });
  }

  // Aborts the upload process.
  abort() {
    // Handle aborting the upload process if necessary
  }
}

export default CustomUploadAdapter;
