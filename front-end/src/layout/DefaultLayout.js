import React from 'react'
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'
import { useCookies } from 'react-cookie'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import { sendRequest, cookies } from 'src/Utilities'

const refreshToken = (token) => {
  sendRequest('/auth/refreshToken', 'post').then((res) => {
    if (res.status === 201) console.log('refreshed', res.data)
  })
}

const DefaultLayout = () => {
  // check user validation state with access token
  if (!cookies.get('accessToken')) return <Navigate to={'/login'} replace />
  // else {
  //   refreshToken(cookies.get('accessToken'))
  // }

  return (
    <div>
      <AppSidebar />
      <div className="wrapper d-flex flex-column min-vh-100 bg-light">
        <AppHeader />
        <div className="body flex-grow-1 px-3">
          <AppContent />
        </div>
      </div>
    </div>
  )
}

export default DefaultLayout
