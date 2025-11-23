import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProviders } from './providers/route-provoders.tsx'
import { Toaster } from 'sonner'
import { AuthProvider } from './contexts/auth-context'
import { BranchProvider } from './contexts/branch-context'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BranchProvider>
        <RouterProviders />
        <Toaster position="bottom-right" />
      </BranchProvider>
    </AuthProvider>
  </StrictMode>,
)
