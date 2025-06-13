// components/Card.tsx
import React, { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={
        `border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition ${className}`
      }
    >
      {children}
    </div>
  )
}
