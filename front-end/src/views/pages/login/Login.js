import React from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { Cookies } from 'react-cookie'
import { Navigate } from 'react-router-dom'
import axios from 'axios'

const cookies = new Cookies()
const d = new Date()
const oneHour = 3600 * 1000
const expireTime = d.getTime() + 0.5 * oneHour

function isEmpty(str) {
  // Falsy value: '', undefined, null, 0, false, NaN
  if (typeof str !== 'string') throw 'considered input is not a string'
  // consider str is '' - false or not - true; place ! to reverse the result
  return !str.trim()
}

class Login extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
    }
  }

  // handle button click/submit event
  handleSubmit(e) {
    // validate
    if (isEmpty(this.state.username) || isEmpty(this.state.password)) {
      console.log('invalid')
      return
    }

    // Send username/pwd to server, then cookies is set by the response
    // axios.post('')
    d.setTime(expireTime)
    cookies.set('token2', 'ned53mlfo32498njls', { path: '/', expires: d })

    window.location.replace('/')
  }

  render() {
    // Navigate to home page if user is authenticated
    if (cookies.get('token2')) {
      // window.location.replace('/')
      return <Navigate to={'/'} replace />
    }

    return (
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={8}>
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm>
                      <h1>Login</h1>
                      <p className="text-medium-emphasis">Sign In to your account</p>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Username"
                          autoComplete="username"
                          onChange={(e) => this.setState({ username: e.target.value })}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Password"
                          autoComplete="current-password"
                          onChange={(e) => this.setState({ password: e.target.value })}
                        />
                      </CInputGroup>
                      <CRow>
                        <CCol xs={6}>
                          <CButton
                            color="primary"
                            className="px-4"
                            onClick={() => this.handleSubmit()}
                          >
                            Login
                          </CButton>
                        </CCol>
                        <CCol xs={6} className="text-right">
                          <CButton color="link" className="px-0">
                            Forgot password?
                          </CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
                <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                  <CCardBody className="text-center">
                    <div>
                      <h2>Product Move</h2>
                      Phần mềm quản lý vòng đời sản phẩm
                    </div>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    )
  }
}

export default Login
