import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface ProductQRCodeProps {
  productId: string;
  size?: number;
}

const ProductQRCode: React.FC<ProductQRCodeProps> = ({ productId, size = 256 }) => {
  const verificationUrl = `${window.location.origin}/verify?address=${productId}`;

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md">
      <QRCodeSVG
        value={verificationUrl}
        size={size}
        level="H"
        includeMargin={true}
      />
      <p className="mt-2 text-sm text-gray-600">Scan to verify product</p>
      <a
        href={verificationUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 text-sm text-blue-600 hover:text-blue-800"
      >
        View Product Details
      </a>
    </div>
  );
};

export default ProductQRCode; 