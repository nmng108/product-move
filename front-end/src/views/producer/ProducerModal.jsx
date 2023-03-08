/**
 * This component renders a modal for add new producer/manufactory or alter an existing one.
 */
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CRow } from '@coreui/react'
import React from 'react'
import { PropTypes } from 'prop-types'
import _ from 'lodash'
import { replicateObject, sendRequest, ADD, EDIT } from 'src/Utilities'
import './style.scss'

class ProducerModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // 0: ADD; 1: EDIT
      type: ADD,
      visible: false,
      title: '',
      editMode: false,
      index: -1,
      data: null,
      originalData: null,
      notification: 'text-danger',
    }
  }

  /**
   * This function is used to open/close modal,
   * called from parent component or by its buttons.
   * @param {null | boolean} modalIsOpen
   * @param {0 | 1} type 0 is ADD type, 1 means EDIT type
   * @param {{data: object, index: number}} record (optional) with form {data, index (in table)}, set by parent component
   */
  toggle(modalIsOpen = null, type, record) {
    let visible = !this.state.visible
    if (typeof modalIsOpen === 'boolean') {
      visible = modalIsOpen
    }
    // Open edit mode by default if the purpose is adding new record
    if (type === ADD) this.setEditMode(true)

    this.setModalType(type, () => {
      if (typeof record === 'object') {
        this.getProfile(record, () => this.setState({ visible: visible }))
      } else this.setState({ visible: visible })
    })
  }

  setEditMode(isOpen = false) {
    this.setState({ editMode: isOpen })
  }

  setModalType(type, callback) {
    let newTitle = ''
    if (type === ADD) {
      newTitle = 'Thêm mới'
    } else if (type === EDIT) {
      newTitle = 'Sửa thông tin'
    }

    this.setState({ type: type, title: newTitle }, callback)
  }

  isAddMode() {
    return this.state.type === ADD
  }

  /**
   * Set profile taken from parent to state variables
   * @param {{data: object, index: number}} record (optional) with form {data, index (in table)}
   * @param {function} callback
   */
  getProfile(record, callback) {
    if (!record) {
      console.log('profile not found')
      return
    }

    this.setState({ data: record.data, index: record.index, originalData: record.data }, callback)
  }

  resetModal() {
    // clear modal and lock
    this.setState({ data: null, index: -1, editMode: false })
  }

  /**
   * Update data state on input changes
   * @param {string} attribute fields in the data state variable
   * @param {string | number} value
   */
  handleInputOnChange(attribute, value) {
    if (typeof attribute !== 'string') {
      console.log(toString(attribute), ' is not of string type')
      return
    }

    let profile = replicateObject(this.state.data)
    // if set new record
    if (!this.state.data) profile = {}

    profile[attribute] = value
    this.setState({ data: profile }, () => {
      // console.log('data state var after change:\n', this.state.data),
    })
  }

  handleConfirmButton(index) {
    let isConfirmed = window.confirm('Bạn chắc chắn muốn lưu không?')
    if (isConfirmed) {
      this.setEditMode(false)
      if (this.isAddMode()) {
        sendRequest('/admin/api/cssx/create', 'post', this.state.data).then((res) => {
          if (res.status === 201) {
            let user_info = {
              username: this.state.data.username,
              password: this.state.data.username,
              name: this.state.data.namePerson,
              numberphone: this.state.data.contact,
              role: 'producer',
              // lack of 2 field: email and address
            }
            sendRequest('/admin/api/user/create', 'post', user_info)
              .then((res) => {
                this.toggle(false)
                this.resetModal()
                // then modify the record in table
                this.props.setProfile(this.state.data, index)

                this.setState({ notification: 'Tạo mới thành công', notifClass: 'text-success' })
                setTimeout(() => {
                  this.setState({ notification: '' })
                  this.toggle(false)
                  this.resetModal()
                }, 2000)
              })
              .catch((err) => {
                console.log(err)
                this.setState({
                  notification: 'Tạo mới không thành công',
                  notifClass: 'text-danger',
                })
                setTimeout(() => this.setState({ notification: '' }), 2000)
              })
          } else {
            this.setEditMode(true)
          }
        })
      } else if (this.state.type === EDIT) {
        sendRequest(`/admin/api/cssx/update/${this.state.data._id}`, 'put', this.state.data)
          .then((res) => {
            this.toggle(false)
            this.resetModal()
            // then modify the record in table
            this.props.setProfile(this.state.data, index)
          })
          .catch((err) => {
            this.setEditMode(true)
            console.log(err)
          })
      }
    }
  }

  handleDeleteButton(index) {
    // show confirmation dialog
    let isConfirmed = window.confirm('Bạn chắc chắn muốn xóa không?')
    if (isConfirmed) {
      // send DELETE request, then remove the record
      sendRequest(`/admin/api/cssx/delete/${this.state.data._id}`).then((res) => {
        if (res.status === 200) {
          // this.toggle(false)
          // this.resetModal()
          // this.props.deleteProfile(index)
        }
        // keep modal open if failed
      })
    }
  }

  handleCancelButton(id) {
    if (this.isAddMode()) this.toggle(false)
    else this.setEditMode(false)
  }

  handleCloseButton() {
    this.toggle(false)
    this.resetModal()
  }

  render() {
    let profile = this.state.data || {}
    console.log('profile:\n', profile)
    return (
      // turn to form or able to edit when open edit mode
      <CModal
        id={this.props.id}
        visible={this.state.visible}
        onClose={() => this.handleCloseButton()}
      >
        <CModalHeader closeButton>
          <h2>{this.state.title}</h2>
          <div className="button-group" hidden={this.isAddMode()}>
            <CButton
              className="edit-btn"
              color="warning"
              disabled={this.state.editMode}
              onClick={() => {
                this.setState({
                  editMode: !this.state.editMode,
                })
              }}
            >
              Sửa
            </CButton>{' '}
            <CButton
              className="btn-danger delete-btn"
              onClick={() => this.handleDeleteButton(this.state.index)}
            >
              Xóa
            </CButton>{' '}
          </div>
        </CModalHeader>
        <CModalBody>
          <form action="" id="producer-info">
            <CRow>
              <label className="form-label" htmlFor="input-name">
                Tên nhà sản xuất (theo đăng ký)
              </label>
              <input
                className="form-input"
                type="text"
                defaultValue={profile.name}
                disabled={!this.state.editMode}
                onChange={(e) => this.handleInputOnChange('name', e.target.value)}
              />
            </CRow>
            <CRow>
              <label className="form-label" htmlFor="input-registedDate">
                Ngày đăng ký
              </label>
              <input
                className="form-input"
                type="date"
                defaultValue={profile.date_register}
                disabled={!this.state.editMode}
                onChange={(e) => this.handleInputOnChange('date_register', e.target.value)}
              />
            </CRow>
            <CRow>
              <label className="form-label" htmlFor="input-launchDate">
                Ngày đi vào hoạt động
              </label>
              <input
                className="form-input"
                type="date"
                defaultValue={profile.date_active}
                disabled={!this.state.editMode}
                onChange={(e) => this.handleInputOnChange('date_active', e.target.value)}
              />
            </CRow>
            <CRow>
              <label className="form-label" htmlFor="input-address">
                Địa chỉ đặt nhà máy
              </label>
              <input
                className="form-input"
                type="text"
                defaultValue={profile.address}
                disabled={!this.state.editMode}
                onChange={(e) => this.handleInputOnChange('address', e.target.value)}
              />
            </CRow>
            <CRow>
              <label className="form-label" htmlFor="input-representative">
                Người đại diện
              </label>
              <input
                className="form-input"
                type="text"
                defaultValue={profile.namePerson}
                disabled={!this.state.editMode}
                onChange={(e) => this.handleInputOnChange('namePerson', e.target.value)}
              />
            </CRow>
            <CRow>
              <label className="form-label" htmlFor="input-representativeID">
                Số căn cước
              </label>
              <input
                className="form-input"
                type="text"
                defaultValue={profile.representativeID}
                disabled={!this.state.editMode}
                onChange={(e) => this.handleInputOnChange('representativeID', e.target.value)}
              />
            </CRow>
            <CRow>
              <label className="form-label" htmlFor="input-contact">
                Thông tin liên hệ
              </label>
              <input
                className="form-input"
                type="text"
                defaultValue={profile.contact}
                disabled={!this.state.editMode}
                onChange={(e) => this.handleInputOnChange('contact', e.target.value)}
              />
            </CRow>
            <CRow>
              <label className="form-label" htmlFor="input-username">
                Username
              </label>
              <input
                className="form-input"
                type="text"
                defaultValue={profile.username}
                disabled={!this.state.editMode}
                onChange={(e) => this.handleInputOnChange('username', e.target.value)}
              />
            </CRow>
            <CRow>
              <label className="form-label" htmlFor="input-password">
                Password
              </label>
              <input
                className="form-input"
                type="password"
                defaultValue={profile.password}
                disabled={!this.state.editMode}
                onChange={(e) => this.handleInputOnChange('password', e.target.value)}
              />
            </CRow>
          </form>
        </CModalBody>
        <CModalFooter>
          <CButton
            className="btn-warning"
            hidden={!this.state.editMode && !this.isAddMode()}
            disabled={
              this.state.type === EDIT && _.isEqual(this.state.data, this.state.originalData)
            }
            onClick={() => {
              if (this.state.editMode) {
                this.handleConfirmButton(this.state.index)
              }
            }}
          >
            Xong
          </CButton>{' '}
          <CButton
            hidden={!this.state.editMode}
            color="secondary"
            onClick={() => this.handleCancelButton()}
          >
            Hủy
          </CButton>
        </CModalFooter>
      </CModal>
    )
  }
}

ProducerModal.propsTypes = {
  show: PropTypes.bool,
  title: PropTypes.string,
}

export default ProducerModal
