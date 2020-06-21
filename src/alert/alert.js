import React from 'react'
import Alert from 'react-s-alert'
import './alert.css'

class Alert1 extends React.Component {
    render() {
        return (
            <div>
                <Alert stack={{ limit: 3, spacing: 5 }} effect="stackslide" position="top" timeout={3000} />
            </div>
        )
    }
}

export default Alert1
