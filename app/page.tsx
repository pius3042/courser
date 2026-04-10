import ChatWindow from '@/components/ChatWindow';

export default function Home() {
  return (
    <>
      {/* Fixed background */}
      <div
        className="fixed inset-0 -z-10"
        style={{ background: 'linear-gradient(135deg, #ede9fe 0%, #f0ebff 35%, #faf5ff 65%, #fdf4ff 100%)' }}
      />

      {/* Decorative blobs */}
      <div
        className="blob-drift fixed -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-40 pointer-events-none -z-10"
        style={{ background: 'radial-gradient(circle, #c4b5fd 0%, #a78bfa 40%, transparent 70%)' }}
      />
      <div
        className="blob-drift-slow fixed -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-30 pointer-events-none -z-10"
        style={{ background: 'radial-gradient(circle, #ddd6fe 0%, #c4b5fd 40%, transparent 70%)' }}
      />

      {/* Chat — fixed to viewport */}
      <ChatWindow />
    </>
  );
}
