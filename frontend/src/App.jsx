import React, { useState } from 'react';
import ReactCompareImage from 'react-compare-image';
import viewmaster from './assets/viewmaster.png';

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
      const apiBase = import.meta.env.DEV ? 'http://localhost:8000' : '';
      const response = await fetch(`${apiBase}/emulate`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      // 4. Prepend the data URI scheme to the base64 string
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
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans antialiased">
      {/* Top Header */}
      <header className="max-w-6xl mx-auto px-6 pt-12 pb-6 border-b border-stone-200">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
          <h1 className="text-3xl font-light tracking-tight">
            NeuralFilm <span className="font-semibold text-amber-600">Gold</span>
          </h1>
          <p className="text-stone-500 font-light text-sm">
            AI-powered film emulation for digital photography
          </p>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Interactive Playground (Upload & Results) */}
        <section className="lg:col-span-7 flex flex-col gap-8">
          <div>
            <h2 className="text-xl font-medium mb-3 text-stone-800">1. Upload Image</h2>
            
            <label className="group relative flex flex-col items-center justify-center border-2 border-dashed border-stone-300 hover:border-amber-500 bg-white rounded-xl p-8 cursor-pointer transition-all duration-300 ease-in-out shadow-sm hover:shadow-md">
              <div className="flex flex-col items-center gap-2 text-stone-400 group-hover:text-amber-600">
                <svg className="w-8 h-8 stroke-current" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                </svg>
                <span className="text-sm font-medium">Select Digital Photo</span>
              </div>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleImageUpload} 
              />
            </label>
          </div>

          {isLoading && (
            <div className="flex flex-col items-center justify-center p-12 bg-white border border-stone-200 rounded-xl shadow-sm gap-3">
              <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-stone-500 text-sm font-medium">Developing film...</p>
            </div>
          )}

          {originalImage && !isLoading && (
            <div>
              <h2 className="text-xl font-medium mb-3 text-stone-800">2. Comparison Slider</h2>
              <div className="w-full rounded-xl overflow-hidden shadow-lg border border-stone-200 bg-stone-100 min-h-[350px] flex items-center justify-center">
                {!emulatedImage ? (
                  <img src={originalImage} alt="Original digital input" className="object-contain max-h-[500px]" />
                ) : (
                  <ReactCompareImage 
                    leftImage={originalImage} 
                    rightImage={emulatedImage} 
                    leftImageLabel="Digital"
                    rightImageLabel="Kodak Gold 200"
                    sliderLineColor="#d97706" 
                  />
                )}
              </div>
            </div>
          )}

          {!originalImage && !isLoading && (
            <div className="flex flex-col items-center justify-center min-h-[300px] border border-stone-200 bg-white rounded-xl shadow-sm text-stone-400">
              <p className="text-sm">Upload a digital photo to preview emulation.</p>
            </div>
          )}
        </section>

        {/* Right Column: Project Info & Assets */}
        <aside className="lg:col-span-5 flex flex-col gap-8 ">
          {/* Viewmaster Image Display */}
          <div className="flex flex-col items-center justify-center bg-white p-6 rounded-xl shadow-sm">
            <img 
              src={viewmaster} 
              alt="Viewmaster Reel" 
              className="w-56 h-56 object-contain rounded-full shadow-inner bg-stone-50 border border-stone-100" 
            />
          </div>

          {/* Project Details */}
          <div className="flex flex-col gap-6 text-stone-600 font-light text-sm leading-relaxed">
            <div>
              <h3 className="text-stone-900 font-medium text-base mb-2">Deep Learning Emulation</h3>
              <p>
                Neural Film is a machine learning demo that translates digital photos into the classic, warm appearance of <strong>Kodak Gold 200</strong> print stock.
              </p>
            </div>

            <div>
              <h3 className="text-stone-900 font-medium text-base mb-2">How it Works</h3>
              <ul className="list-disc pl-5 flex flex-col gap-2">
                <li>
                  <strong>Generator Network:</strong> Serves a CycleGAN-style ResNet neural network generator running PyTorch on the FastAPI backend.
                </li>
                <li>
                  <strong>Inference Pipeline:</strong> Input images are resized and normalized, processed by the generator model, and rendered as standard base64 JPEGs.
                </li>
                <li>
                  <strong>Visual Slider:</strong> Utilizes an interactive before/after component to compare the digital capture against the emulated print.
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-stone-900 font-medium text-base mb-2">Technological Stack</h3>
              <table className="min-w-full text-left text-xs border-collapse">
                <tbody>
                  <tr className="border-b border-stone-200">
                    <td className="py-2 font-medium text-stone-800">UI / Frontend</td>
                    <td className="py-2">React, Vite, Tailwind CSS</td>
                  </tr>
                  <tr className="border-b border-stone-200">
                    <td className="py-2 font-medium text-stone-800">Model Serving</td>
                    <td className="py-2">FastAPI, PyTorch, PIL</td>
                  </tr>
                  <tr className="border-b border-stone-200">
                    <td className="py-2 font-medium text-stone-800">Architecture</td>
                    <td className="py-2">ResNet Image-to-Image Translator</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </aside>
      </main>

      {/* Minimal Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-8 border-t border-stone-200 text-center text-xs text-stone-400 font-light">
        <p>© 2026 NeuralFilm Project. All rights reserved.</p>
      </footer>
    </div>
  );
}