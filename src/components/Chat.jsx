import React, { useState } from 'react'

function Chat({ messages = [], onSendMessage }) {
  const [newMessage, setNewMessage] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (newMessage.trim()) {
      onSendMessage(newMessage)
      setNewMessage('')
    }
  }

  return (
    <div className="flex flex-col h-[500px] bg-white dark:bg-dark-800 rounded-lg shadow-soft">
      {/* رأس المحادثة */}
      <div className="px-4 py-3 border-b border-dark-200 dark:border-dark-700">
        <h3 className="text-lg font-medium text-dark-900 dark:text-white">
          المحادثة
        </h3>
      </div>

      {/* منطقة الرسائل */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.isAdmin ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-lg ${
                message.isAdmin
                  ? 'bg-dark-100 dark:bg-dark-700 text-dark-900 dark:text-white'
                  : 'bg-primary-600 text-white'
              }`}
            >
              <div className="text-sm">{message.content}</div>
              <div className={`text-xs mt-1 ${
                message.isAdmin
                  ? 'text-dark-500 dark:text-dark-400'
                  : 'text-primary-100'
              }`}>
                {message.time}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* نموذج إرسال الرسالة */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-dark-200 dark:border-dark-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="اكتب رسالتك هنا..."
            className="flex-1 px-4 py-2 border border-dark-300 dark:border-dark-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-dark-800 text-dark-900 dark:text-white"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors duration-200"
          >
            إرسال
          </button>
        </div>
      </form>
    </div>
  )
}

export default Chat 