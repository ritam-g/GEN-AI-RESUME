import React from 'react'
import { RouterProvider } from 'react-router'
import { router } from './app.routes'
import AuthContext from './features/auth/context/AuthContext'
import InterviewContext from './features/interview/context/interviewContext'

import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <>
      <AuthContext>
        <InterviewContext>
          <Toaster 
            position="top-center"
            toastOptions={{
              style: {
                background: '#161b22',
                color: '#fff',
                border: '1px solid #30363d',
              },
            }}
          />
          <RouterProvider router={router} />
        </InterviewContext>
      </AuthContext>
    </>
  )
}

export default App
