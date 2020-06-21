import React from 'react'
import { Navbar, NavDropdown, MenuItem } from 'react-bootstrap'

import './style-navbar.css';

class NavBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            searchButton: true,
            country: "US"
        }
    }

 

    render() {
        return (
            <div className="navbar-main">
                
                    <Navbar.Brand>
                        <div className="brand-class-left" >
                            <div className="vl" />
                            <div className="quark">TODO APP</div>
                        </div>
                    </Navbar.Brand>
               
            </div>
        )
    }
}

export default NavBar
