/**
 * Example: ThemedButton Component
 * Demonstrates how to use CSS variables from Design System
 */

import './ThemedButton.css'

export default function ThemedButton({ children, variant = 'primary', onClick }) {
  return (
    <button className={`themed-button themed-button--${variant}`} onClick={onClick}>
      {children}
    </button>
  )
}
