import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useCookies } from 'react-cookie'
import { Navigate } from 'react-router-dom'

const DefaultLayout = () => {
  // check user validation state with access token
  const [cookies, SetCookie] = useCookies()
  if (!cookies.token2) return <Navigate to={'/login'} replace />

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
        <AppFooter />
      </div>
    </div>
  )
}

export default DefaultLayout
