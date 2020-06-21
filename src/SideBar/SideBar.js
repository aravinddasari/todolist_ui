import React from 'react'
import { Link } from 'react-router-dom'


import './style-sidebar.css';

export default class SideBar extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            component: 'leads',
            propertyOpen: false,
        }
    }



    render() {
        return (
            <div>
                <div className="side-bar">
                    <Link style={{ color: 'rgba(0,0,0,0.54)', textDecoration: 'none' }}  to="/">
                        <div className={this.state.component === 'leads' ? 'selected-side-bar-item' : 'side-bar-item'}>
                            { "All Tasks"}
                        </div>
                    </Link>
                    <div className="horizontal-separator" />

                    {/* <Link style={{ color: 'rgba(0,0,0,0.54)', textDecoration: 'none' }} onClick={() => this.changeComponent('reports')} to="/reports">
                        <div className={this.state.component === 'reports' ? 'selected-side-bar-item' : 'side-bar-item'}>
                        { i18n.t("reports") }
                        </div>
                    </Link> */}
                </div>
            </div>
        )
    }
}
