import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProviders } from './providers/route-provoders.tsx'
import { Toaster } from 'sonner'
import { AuthProvider } from './contexts/auth-context'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <RouterProviders />
      <Toaster position="bottom-right" />
    </AuthProvider>
  </StrictMode>,
)
