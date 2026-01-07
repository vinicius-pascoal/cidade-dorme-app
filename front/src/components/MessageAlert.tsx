'use client';

interface MessageAlertProps {
  type: 'error' | 'info' | 'success';
  message: string | null;
}

const colorMap = {
  error: 'bg-red-500/80',
  info: 'bg-blue-500/80',
  success: 'bg-emerald-600/80',
};

export function MessageAlert({ type, message }: MessageAlertProps) {
  if (!message) return null;

  return (
    <div className={`w-full rounded-xl ${colorMap[type]} text-white px-4 py-3 text-sm shadow-lg`}>
      {message}
    </div>
  );
}
