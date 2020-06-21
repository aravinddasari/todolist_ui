import React from 'react'
import config from '../config'
import "./application.css"
import RESTApi from '../api/RestAPI'
import {Modal, Button} from 'react-bootstrap'
import {FormControl, Form} from 'react-bootstrap'
import Loader from 'react-loader-spinner'
import Alert from 'react-s-alert'
import history from '../history'



class todoIndexPage extends React.Component {
    constructor(props) {
        super(props)
        this.renderTodos = this.renderTodos.bind(this)
        this.fetchTodos = this.fetchTodos.bind(this)
        this.renderTask = this.renderTask.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDelete = this.renderDelete.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.renderModal = this.renderModal.bind(this)
        this.updateTask = this.updateTask.bind(this)
        this.renderCreateModal = this.renderCreateModal.bind(this)
        this.createTask = this.createTask.bind(this)
        this.state = {
            todos: [],
            show: false,
            selectedTask: {},
            isLoading: true,
            createTask: false,

        }
    }

    handleClose = () => this.setState({show: false});
    handleShow = () => this.setState({show: true});

    renderTask(task) {
        history.push({
            pathname: `/todos/${task.id}`,
            state: {
                task: task
            }
        })

    }

    renderDelete(task) {
        console.log("coming here");
        const url = "http://localhost:8080/todos/" + task.id;
        RESTApi.DELETE(
            url,
            {},
            data => {
                console.log("data is", data)
                if (data) {
                    Alert.success("Task Deleted Successfully.")
                    this.setState({isLoading: false}, () => {
                        this.fetchTodos();
                    })
                }
            },
            error => {
                Alert.error(error)
                console.log(error);
            }

        )

    }

    renderEdit(task){
        this.setState({show: true, selectedTask: task})

    }

    handleChange(fieldName, Value) {
        let task = this.state.selectedTask;

        switch(fieldName) {
            case 'name':
                task["name"] = Value
                this.setState({ selectedTask: task })
                break
            case 'description':
                task["description"] = Value
                this.setState({ selectedTask: task })
                break
            default:
                break
        }
    }

    createTask() {
        const url = "http://localhost:8080/todos"; 
        RESTApi.POST(
            url,
            {},
            this.state.selectedTask,
            data => {
                console.log("data is", data)
                Alert.success("Task Created Successfully.")
                if (data) {
                    this.setState({ isLoading: false, show: false, selectedTask: {}, createTask: false}, () => {
                        this.fetchTodos();
                    })
                }
            },
            error => {
                Alert.error(error)
                console.log(error);
            }

        )
    }

    updateTask() {
        if(!this.state.createTask) {
            const url = "http://localhost:8080/todos/" + this.state.selectedTask.id;
            RESTApi.PUT(
                url,
                {},
                this.state.selectedTask,
                data => {
                    console.log("data is", data)
                    Alert.success("Task Updated Successfully.")
                    if (data) {
                        this.setState({isLoading: false, show: false, selectedTask: {}}, () => {
                            this.fetchTodos();
                        })
                    }
                },
                error => {
                    Alert.error(error)
                    console.log(error);
                }

            )
        } else {
            this.createTask();
        }

    }

    renderCreateModal() {
        this.setState({selectedTask: {}, show: true, createTask: true})
    }

    renderModal() {
        let item = (
            <Modal show={this.state.show} onHide={this.handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>
              <div className="leads-create-body-item">
                                <div className="leads-create-item-label">
                                    Name
                                </div>
                                <FormControl
                                    type="text"
                                    className="leads-create-input"
                                    value={ this.state.selectedTask.name? this.state.selectedTask.name : ''}
                                    onChange={e => this.handleChange('name', e.target.value)}
                                />
                </div>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div className="leads-create-body-item">
                                <div className="leads-create-item-label">
                                    Description
                                </div>
                                <Form.Control as="textarea" rows="3"
                                    className="leads-create-input"
                                    value={this.state.selectedTask.description? this.state.selectedTask.description : ''}
                                    onChange={e => this.handleChange('description', e.target.value)}
                                />
                </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={this.updateTask}>
                {this.state.createTask? "Create Task" : "Update Task"}
              </Button>
            </Modal.Footer>
          </Modal>
        )
        return item
    }

    renderTodos() {
        let items = [];
        for(let i =0; i<this.state.todos.length; i++) {
            let item = null
            item = (
                <div key={i}>
                    <div className="list-item" key={i} onClick={() => this.renderTask(this.state.todos[i])}>
                        <div className="list-sub-item">
                            { this.state.todos[i]['name'] ? this.state.todos[i]['name'] : "-" }
                        </div>
                        <div className="list-sub-item">
                            { this.state.todos[i]['description'] ? this.state.todos[i]['description'] : "-" }
                        </div>
                        <div className="list-sub-item" style={{float: "right" ,postion: 'relative', cursor: 'pointer', paddingRight:15}} >
                            <div onClick={() => { this.renderDelete(this.state.todos[i]) }} className="contract-delete-button" />                      
                            <div onClick={() => { this.renderEdit(this.state.todos[i]) }} className="contract-edit-button" />  
                            
                        </div>
                    </div>
                </div>

            )
            items.push(item);
        }
        return items;
    }

    fetchTodos() {
        console.log("coming here");
        const url = "http://localhost:8080/todos";
        RESTApi.GET(
            url,
            {},
            data => {
                console.log("data is", data)
                if (data) {
                    this.setState({todos: data, isLoading: false})
                }
            },
            error => {
                Alert.error(error)
                console.log(error);
            }

        )
    }

    componentWillMount() {
        this.fetchTodos();
    }

    render() {
        return (
            <div>
                {this.state.isLoading===true?
                        <div style={{ justifyContent: 'center', alignItems: 'center',width:'100%' }}>
                            <Loader type="ThreeDots" color="#EF4023" height="100" width="100" />
                        </div>: 
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ width: '100%', marginRight: 0 }}>
                        <div className="leads-div">
                            <div className="leads-listing-container">
                                <div style={{ display: 'flex', flexDirection: 'row', marginBottom: '7px' }}>
                                    <div className="application-user-text">
                                        {"Todos"}
                                    </div>
                                    <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'row', paddingRight: '30px' }}>
                                        
                                        <button className="custom-button-div fill_green"  onClick = {() =>{this.renderCreateModal()}}>
                                            <text className="button-text text-white"> {"Add task"}</text>
                                        </button>
                                    </div>
                                </div>
                                <div className="horizontal-separator" />
                                <div className="header-style">
                                    <div  className={this.props.headerStyle? this.props.headerStyle : "header-item"} >
                                            {"Name"}
                                    </div>
                                    <div  className={this.props.headerStyle? this.props.headerStyle : "header-item"} >
                                            {"Description"}
                                    </div>
                                </div>
                                {this.state.todos.length === 0 && this.state.isLoading === false ? (
                                        <div style={{ margin: 20, fontSize: 16 }}>No Tasks</div>
                                    ) : null}
                                <div>{this.renderTodos()}</div>
                                <div>{this.renderModal()}</div>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
        )
    }
}


export default todoIndexPage
