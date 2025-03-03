import React from 'react'

const variants = {
  success: 'bg-green-900/10 text-green-400 border-green-900/20',
  error: 'bg-red-900/10 text-red-400 border-red-900/20',
  warning: 'bg-yellow-900/10 text-yellow-400 border-yellow-900/20',
  info: 'bg-primary-900/10 text-primary-400 border-primary-900/20'
}

function Alert({ type = 'info', message }) {
  return (
    <div className={`p-4 rounded-lg border backdrop-blur-sm ${variants[type]}`}>
      <p className="text-sm font-medium">{message}</p>
    </div>
  )
}

export default Alert 