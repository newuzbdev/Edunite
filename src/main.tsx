import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProviders } from './providers/route-provoders.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProviders />
     </StrictMode>,
)
