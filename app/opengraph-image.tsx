import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Smart Course Registration Portal - UNIPORT';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
          position: 'relative',
        }}
      >
        {/* Decorative orbs */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            right: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(59, 130, 246, 0.15)',
            filter: 'blur(80px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            left: '-100px',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'rgba(139, 92, 246, 0.15)',
            filter: 'blur(80px)',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            padding: '80px',
            zIndex: 10,
          }}
        >
          {/* Icon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '120px',
              height: '120px',
              borderRadius: '30px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              marginBottom: '40px',
              boxShadow: '0 20px 60px rgba(59, 130, 246, 0.4)',
            }}
          >
            <svg
              width="70"
              height="70"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 14L12 3M12 3L8 7M12 3L16 7"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 17L2 19C2 20.1046 2.89543 21 4 21L20 21C21.1046 21 22 20.1046 22 19L22 17"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M6 10L4 12L6 14"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M18 10L20 12L18 14"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: '20px',
              lineHeight: 1.2,
            }}
          >
            Smart Course Registration
          </div>

          {/* Subtitle */}
          <div
            style={{
              fontSize: '32px',
              color: 'rgba(255, 255, 255, 0.7)',
              marginBottom: '30px',
            }}
          >
            University of Port Harcourt
          </div>

          {/* Features */}
          <div
            style={{
              display: 'flex',
              gap: '30px',
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>✓</span>
              <span>AI-Powered Suggestions</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>✓</span>
              <span>Real-time Validation</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>✓</span>
              <span>Smart Warnings</span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
