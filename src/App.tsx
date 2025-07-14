import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './hooks/useTheme'
import Layout from './components/Layout'
import LoadingSpinner from './components/LoadingSpinner'
import ToastContainer from './components/ui/ToastContainer'

// Lazy loading para las páginas
const Kanban = React.lazy(() => import('./pages/Kanban'))
const Products = React.lazy(() => import('./pages/Products'))

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Navigate to="/kanban" replace />} />
              <Route path="/kanban" element={<Kanban />} />
              <Route path="/products" element={<Products />} />
            </Routes>
          </Suspense>
        </Layout>
        <ToastContainer />
      </Router>
    </ThemeProvider>
  )
}

export default App