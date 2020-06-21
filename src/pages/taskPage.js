import React from 'react'
import config from '../config'
import "./application.css"
import RESTApi from '../api/RestAPI'
import {Modal, Button} from 'react-bootstrap'
import {FormControl, Form} from 'react-bootstrap'
import Loader from 'react-loader-spinner'
import Alert from 'react-s-alert'
import Collapsible from 'react-collapsible'
import history from '../history'




class taskPage extends React.Component {
    constructor(props) {
        super(props)
        this.renderTodos = this.renderTodos.bind(this)
        this.fetchTask = this.fetchTask.bind(this)
        this.renderTask = this.renderTask.bind(this)
        this.renderEdit = this.renderEdit.bind(this)
        this.renderDelete = this.renderDelete.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.renderModal = this.renderModal.bind(this)
        this.updateTask = this.updateTask.bind(this)
        this.renderCreateModal = this.renderCreateModal.bind(this)
        this.createTask = this.createTask.bind(this)
        this.renderSubTasks = this.renderSubTasks.bind(this)
        this.addTask = this.addTask.bind(this)
        this.state = {
            todos: [],
            show: false,
            selectedTask: {},
            isLoading: true,
            createTask: false,
            openTask: false,
            createSubTask: false,
            parentId: null

        }
    }

    handleClose = () => this.setState({show: false});
    handleShow = () => this.setState({show: true});

    renderTask(task) {
        history.push('/');
        history.push({
            pathname: `/todos/${task.id}`,
            state: {
                task: task
            }
        })

    }

    renderDelete(task) {
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

    addTask(task){
        this.setState({show: true, createSubTask: true, parentId: task.id})
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
        let task = this.state.selectedTask
        if(this.state.createSubTask) {
           task["parentId"] = this.state.parentId
        }
        const url = "http://localhost:8080/todos"; 
        RESTApi.POST(
            url,
            {},
            task,
            data => {
                console.log("data is", data)
                Alert.success("Task Created Successfully.")
                if (data) {
                    this.setState({ isLoading: false, show: false, selectedTask: {}, createTask: false, createSubTask: false, parentId: null}, () => {
                        this.fetchTask();
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
        if(this.state.createSubTask || this.state.createTask) {
            this.createTask();
        }
        else {
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
        } 
    }

    renderCreateModal() {
        this.setState({selectedTask: {}, show: true, createSubTask: true, parentId: this.state.task.id})
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

    renderSubTasks() {
        let items = [];
        for(let i=0; i< this.state.task.subTasks.length; i++) {
            let item = null
            item = (
                <div className="list-item" style={{ padding: "10px"}} onClick={() => this.renderTask(this.state.task.subTasks[i])}>
                    <div className="list-sub-item">
                        { this.state.task.subTasks[i]['name'] ? this.state.task.subTasks[i]['name'] : "-" }
                    </div>
                    <div className="list-sub-item">
                        { this.state.task.subTasks[i]['description'] ? this.state.task.subTasks[i]['description'] : "-" }
                    </div>
                    <div className="list-sub-item" style={{float: "right" ,postion: 'relative', cursor: 'pointer', paddingRight:15}} >
                        <div onClick={() => { this.renderDelete(this.state.task.subTasks[i]) }} className="contract-delete-button" />                      
                        <div onClick={() => { this.renderEdit(this.state.task.subTasks[i]) }} className="contract-edit-button" />  
                    </div>
                </div>
            )
            items.push(item)
        }

        return items;

    }

    renderTodos() {
        let item = (
                <div>
                    <div className="list-item">
                        <div className="list-sub-item">
                            { this.state.task['name'] ? this.state.task['name'] : "-" }
                        </div>
                        <div className="list-sub-item">
                            { this.state.task['description'] ? this.state.task['description'] : "-" }
                        </div>
                        <div className="list-sub-item" style={{float: "right" ,postion: 'relative', cursor: 'pointer', paddingRight:15}} >
                            <div onClick={() => { this.renderDelete(this.state.task) }} className="contract-delete-button" />                      
                            <div onClick={() => { this.renderEdit(this.state.task) }} className="contract-edit-button" />  
                            <div onClick={() => { this.addTask(this.state.task) }} className="contract-plus-button" />  
                        </div>
                        <div onClick={() => {this.setState({openTask: !this.state.openTask})}} className="single-row">
                            <i className= {"initial-payment-arrow" + ((this.state.openTask) ? ' arrow-up' : ' arrow-down')} >
                                
                            </i>
                        </div>   
                    </div>
                    <div style={{ margin: "0px 40px", backgroundColor: "whitesmoke"}}>
                    <Collapsible open={this.state.openTask} transitionTime={100} style={{ margin: "0px 40px"}}>
                        <div className="list-item"> SubTasks </div>
                        {this.renderSubTasks()}
                    </Collapsible>
                    </div>
                </div>

            )

        return item;
    }

    fetchTask() {
        let taskId = this.props.match.params['id']
        const url = "http://localhost:8080/todos/" + taskId;
        RESTApi.GET(
            url,
            {},
            data => {
                console.log("data is", data)
                if (data) {
                    this.setState({task: data, isLoading: false})
                }
            },
            error => {
                Alert.error(error)
                console.log(error);
            }

        )
    }

    componentWillReceiveProps() {
        this.setState({adsa: true}, () =>  this.fetchTask() )
    }

    componentDidMount() {
        this.fetchTask();
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
                                        {"Todos-" }
                                    </div>
                                    {/* <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'row', paddingRight: '30px' }}>
                                        
                                        <button className="custom-button-div fill_green"  onClick = {() =>{this.renderCreateModal()}}>
                                            <text className="button-text text-white"> {"Add Sub task"}</text>
                                        </button>
                                    </div> */}
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


export default taskPage
