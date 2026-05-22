import React, { useState } from 'react';
import ReactCompareImage from 'react-compare-image';

export default function KodakEmulator() {
  const [originalImage, setOriginalImage] = useState(null);
  const [emulatedImage, setEmulatedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 1. Show the original image immediately using a local object URL
    setOriginalImage(URL.createObjectURL(file));
    setEmulatedImage(null); // Reset previous runs
    setIsLoading(true);

    // 2. Prepare the file to send to FastAPI
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/emulate', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      // 4. The Magic Step: Prepend the data URI scheme to the base64 string
      const base64Src = `data:image/jpeg;base64,${data.emulated_image}`;
      
      setEmulatedImage(base64Src);
    } catch (error) {
      console.error("Error emulating film:", error);
      alert("Something went wrong in the darkroom.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 flex flex-col items-center gap-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900">
        Kodak Gold 200 Emulator
      </h1>

      <label className="cursor-pointer bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
        <span>Select Digital Photo</span>
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleImageUpload} 
        />
      </label>

      {isLoading && (
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Developing film... (Running ONNX Inference)</p>
        </div>
      )}

      <div className="w-full rounded-xl overflow-hidden shadow-2xl bg-gray-100 min-h-[400px] flex items-center justify-center">
        {!originalImage && !isLoading && (
          <p className="text-gray-400">Upload an image to see the emulation.</p>
        )}
        
        {originalImage && !emulatedImage && !isLoading && (
           <img src={originalImage} alt="Original" className="object-contain" />
        )}

        {originalImage && emulatedImage && (
          <ReactCompareImage 
            leftImage={originalImage} 
            rightImage={emulatedImage} 
            leftImageLabel="Digital"
            rightImageLabel="Kodak Gold 200"
            sliderLineColor="#f59e0b" 
          />
        )}
      </div>
    </div>
  );
}