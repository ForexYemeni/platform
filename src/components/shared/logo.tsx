'use client'

import { motion } from 'framer-motion'

export function Logo({ size = 40, withText = true }: { size?: number; withText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <motion.div
        initial={{ rotate: -10, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative"
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
          <defs>
            <linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00d4ff" />
              <stop offset="50%" stopColor="#9d4edd" />
              <stop offset="100%" stopColor="#ffd700" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            d="M24 2 L42 12 L42 36 L24 46 L6 36 L6 12 Z"
            fill="url(#logoGrad)"
            opacity="0.15"
          />
          <path
            d="M24 2 L42 12 L42 36 L24 46 L6 36 L6 12 Z"
            stroke="url(#logoGrad)"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d="M24 12 L33 17 L33 27 L24 32 L15 27 L15 17 Z"
            fill="url(#logoGrad)"
            filter="url(#glow)"
          />
          <circle cx="24" cy="22" r="3" fill="#0a0a14" />
          <circle cx="24" cy="22" r="1.5" fill="#ffd700" />
        </svg>
      </motion.div>
      {withText && (
        <div className="flex flex-col leading-none">
          <span className="font-bold text-base tracking-tight text-gradient-electric">
            CryptoMine
          </span>
          <span className="text-[10px] text-muted-foreground font-medium tracking-widest">
            INVEST • 2026
          </span>
        </div>
      )}
    </div>
  )
}
