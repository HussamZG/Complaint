import React from 'react'

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div className="fixed inset-0 bg-dark-900/75 transition-opacity" onClick={onClose} />
        
        <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-dark-800 text-right shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal 