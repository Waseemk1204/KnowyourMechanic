import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
interface BarcodeGeneratorProps {
  value: string;
  size?: number;
}
export const BarcodeGenerator: React.FC<BarcodeGeneratorProps> = ({
  value,
  size = 200
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, value, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      }, error => {
        if (error) console.error('Error generating QR code:', error);
      });
    }
  }, [value, size]);
  return <div className="flex flex-col items-center">
      <canvas ref={canvasRef} className="border rounded-md" />
      <p className="mt-2 text-sm font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
        {value}
      </p>
    </div>;
};