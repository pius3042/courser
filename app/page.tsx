import ChatWindow from '@/components/ChatWindow';
import FloatingDecors from '@/components/FloatingDecors';

export default function Home() {
  return (
    <main
      className="relative h-screen overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #FFF8F0 0%, #FFF0F8 45%, #EFF5FF 100%)',
      }}
    >
      {/* Floating bakery decorations */}
      <FloatingDecors />

      {/* Chat card — full-screen on mobile, centered card on desktop */}
      <div className="relative z-10 h-full flex items-stretch md:items-center md:justify-center md:p-6">
        <div
          className="w-full h-full md:h-[92vh] md:max-w-[430px]
                     md:rounded-3xl md:overflow-hidden
                     md:shadow-[0_24px_80px_rgba(0,0,0,0.18)]"
        >
          <ChatWindow />
        </div>
      </div>
    </main>
  );
}
