import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProviders } from './providers/route-provoders.tsx'
import { Toaster } from 'sonner'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProviders />
    <Toaster position="bottom-right" />
  </StrictMode>,
)
