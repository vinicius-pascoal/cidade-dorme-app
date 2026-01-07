'use client';

export function QRCode({ value }: { value: string }) {
  // Gerar QR Code usando uma API externa
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(value)}`;

  return (
    <div className="flex justify-center">
      <img src={qrUrl} alt="QR Code da sala" className="w-64 h-64 border-4 border-purple-500 rounded-lg" />
    </div>
  );
}
