"use client";

export const BarberFlowLogo = ({ className = "w-12 h-12" }) => (
    <svg
        className={className}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <style>
            {`
        @keyframes scissorOpen {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(-12deg); }
        }
        @keyframes scissorClose {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(12deg); }
        }
        .scissor-top {
          animation: scissorOpen 1.5s ease-in-out infinite;
          transform-origin: 50px 50px;
        }
        .scissor-bottom {
          animation: scissorClose 1.5s ease-in-out infinite;
          transform-origin: 50px 50px;
        }
      `}
        </style>

        {/* Fondo con gradiente */}
        <defs>
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0f172a" />
                <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id="scissorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2dd4bf" />
                <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
        </defs>

        <rect width="100" height="100" rx="22" fill="url(#bgGradient)" />

        {/* Brillo sutil */}
        <rect width="100" height="50" rx="22" fill="white" opacity="0.03" />

        {/* Tijera superior */}
        <g className="scissor-top">
            {/* Hoja superior */}
            <path
                d="M50 50 L75 25 C78 22 82 24 80 28 L55 48"
                stroke="url(#scissorGradient)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            {/* Ojo de la tijera superior */}
            <circle cx="80" cy="22" r="6" stroke="#2dd4bf" strokeWidth="3" fill="none" />
        </g>

        {/* Tijera inferior */}
        <g className="scissor-bottom">
            {/* Hoja inferior */}
            <path
                d="M50 50 L75 75 C78 78 82 76 80 72 L55 52"
                stroke="url(#scissorGradient)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
            {/* Ojo de la tijera inferior */}
            <circle cx="80" cy="78" r="6" stroke="#2dd4bf" strokeWidth="3" fill="none" />
        </g>

        {/* Centro/pivote de las tijeras con brillo */}
        <circle cx="50" cy="50" r="6" fill="#2dd4bf" />
        <circle cx="50" cy="50" r="3" fill="#0f172a" />

        {/* Elemento "flow" - líneas tech */}
        <path
            d="M20 35 Q30 50 20 65"
            stroke="#2dd4bf"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.6"
        />
        <path
            d="M28 30 Q40 50 28 70"
            stroke="#14b8a6"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.4"
        />

        {/* Pequeños nodos tech */}
        <circle cx="20" cy="35" r="3" fill="#2dd4bf" opacity="0.8" />
        <circle cx="20" cy="65" r="3" fill="#2dd4bf" opacity="0.8" />
    </svg>
);
