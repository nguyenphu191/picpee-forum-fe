'use client';

import { useState, useCallback, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, RotateCw, ZoomIn, Scissors, Maximize2, Square } from 'lucide-react';

interface ImageEditorModalProps {
  image: string;
  isOpen: boolean;
  onClose: () => void;
  onSave: (croppedImage: Blob) => void;
}

export default function ImageEditorModal({ image, isOpen, onClose, onSave }: ImageEditorModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState<number | undefined>(undefined);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: any,
    rotation = 0
  ): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) throw new Error('No 2d context');

    const rotRad = (rotation * Math.PI) / 180;
    const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
      image.width,
      image.height,
      rotation
    );

    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.translate(-image.width / 2, -image.height / 2);

    ctx.drawImage(image, 0, 0);

    const data = ctx.getImageData(
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height
    );

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.putImageData(data, 0, 0);

    return new Promise((resolve) => {
      canvas.toBlob((file) => {
        if (file) resolve(file);
      }, 'image/jpeg');
    });
  };

  const rotateSize = (width: number, height: number, rotation: number) => {
    const rotRad = (rotation * Math.PI) / 180;
    return {
      width:
        Math.abs(Math.cos(rotRad) * width) + Math.abs(Math.sin(rotRad) * height),
      height:
        Math.abs(Math.sin(rotRad) * width) + Math.abs(Math.cos(rotRad) * height),
    };
  };

  const handleSave = async () => {
    try {
      const croppedBlob = await getCroppedImg(image, croppedAreaPixels, rotation);
      onSave(croppedBlob);
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden shadow-2xl"
        >
          <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-primary-500/10 rounded-xl">
                <Scissors className="w-4 h-4 text-primary-500" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white">Chỉnh sửa hình ảnh</h3>
                <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Cắt, xoay và thu phóng</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 hover:bg-zinc-800 rounded-full text-zinc-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative h-[300px] md:h-[350px] bg-black">
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={aspect}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
            />
          </div>

          <div className="p-6 bg-zinc-900/80 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* ZOOM CONTROLS */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  <span className="flex items-center gap-2 pt-1"><ZoomIn className="w-3.5 h-3.5" /> Thu phóng</span>
                  <span className="text-primary-500">{Math.round(zoom * 100)}%</span>
                </div>
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary-500"
                />
              </div>

              {/* ROTATION CONTROLS */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  <span className="flex items-center gap-2 pt-1"><RotateCw className="w-3.5 h-3.5" /> Xoay ảnh</span>
                  <span className="text-primary-500">{rotation}°</span>
                </div>
                <input
                  type="range"
                  value={rotation}
                  min={0}
                  max={360}
                  step={1}
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary-500"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-4 border-t border-zinc-800/50">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mr-2">Tỷ lệ:</span>
                <button 
                  type="button"
                  onClick={() => setAspect(undefined)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${!aspect ? 'bg-primary-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}
                >
                  <Maximize2 className="w-3 h-3 inline-block mr-1" /> Tự do
                </button>
                <button 
                  type="button"
                  onClick={() => setAspect(1)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${aspect === 1 ? 'bg-primary-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}
                >
                  <Square className="w-3 h-3 inline-block mr-1" /> 1:1
                </button>
                <button 
                  type="button"
                  onClick={() => setAspect(16/9)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${aspect === 16/9 ? 'bg-primary-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}
                >
                  16:9
                </button>
                <button 
                  type="button"
                  onClick={() => setAspect(4/3)}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${aspect === 4/3 ? 'bg-primary-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}
                >
                  4:3
                </button>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 md:flex-none px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 md:flex-none px-8 py-3 bg-primary-500 text-black rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary-500/20 hover:bg-primary-400 transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  Hoàn tất
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
