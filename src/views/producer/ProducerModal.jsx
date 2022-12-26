/* eslint-disable react/prop-types */
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader } from '@coreui/react'
import React from 'react'
import { PropTypes } from 'prop-types'

class ProducerModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: false,
      title: '',
    }
  }

  componentDidMount() {
    // this.setState({
    //   isShown: this.props.show,
    //   title: this.props.title,
    // })
  }

  toggle() {
    this.setState({ visible: !this.state.visible })
  }

  render() {
    return (
      <CModal id={this.props.id} visible={this.state.visible}>
        <CModalHeader closeButton>{this.state.title}</CModalHeader>
        <CModalBody>
          <form action="" id="producer-info">
            1: <input type="text" />
            2: <input type="text" />
          </form>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="primary"
            onClick={() => {
              // send PUT request to modify/add profile and set modal to invisible
              /**
               * TODO: add temporary record; add edit button for each record
               */
              this.setState({ visible: false })
            }}
          >
            Xác nhận
          </CButton>{' '}
          <CButton color="secondary" onClick={() => this.toggle()}>
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
