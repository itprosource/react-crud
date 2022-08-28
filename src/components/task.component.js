import React, { Component } from "react";
import TaskDataService from "../services/task.service";
import DatePicker from 'react-datepicker';
import FadeIn from 'react-fade-in';

export default class Task extends Component {
    constructor(props) {
        super(props);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.getTask = this.getTask.bind(this);
        this.updateCompleted = this.updateCompleted.bind(this);
        this.updateTask = this.updateTask.bind(this);
        this.deleteTask = this.deleteTask.bind(this);

        this.state = {
            currentTask: {
                id: null,
                title: "",
                description: "",
                completed: false,
                startDate: new Date(),
            },
            message: ""
        };
    }

    componentDidMount() {
        this.getTask(this.props.match.params.id);
    }

    onChangeTitle(e) {
        const title = e.target.value;

        this.setState(function(prevState) {
            return {
                currentTask: {
                    ...prevState.currentTask,
                    title: title
                }
            };
        });
    }

    onChangeDescription(e) {
        const description = e.target.value;

        this.setState(prevState => ({
            currentTask: {
                ...prevState.currentTask,
                description: description
            }
        }));
    }

    onChangeDate(e) {
        const startDate = e;

        this.setState(prevState => ({
            currentTask: {
                ...prevState.currentTask,
                startDate: startDate.toISOString()
            }
        }));
    }

    getTask(id) {
        TaskDataService.get(id)
            .then(response => {
                this.setState({
                    currentTask: response.data
                });
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    updateCompleted(status) {
        var data = {
            id: this.state.currentTask.id,
            title: this.state.currentTask.title,
            description: this.state.currentTask.description,
            completed: status,
            startDate: this.state.currentTask.startDate
        };

        TaskDataService.update(this.state.currentTask.id, data)
            .then(response => {
                this.setState(prevState => ({
                    currentTask: {
                        ...prevState.currentTask,
                        completed: status
                    }
                }));
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    updateTask() {
        TaskDataService.update(
            this.state.currentTask.id,
            this.state.currentTask
        )
            .then(response => {
                console.log(response.data);
                this.setState({
                    message: "The Task was updated successfully!"
                });
            })
            .catch(e => {
                console.log(e);
            });
    }

    deleteTask() {
        TaskDataService.delete(this.state.currentTask.id)
            .then(response => {
                console.log(response.data);
                this.props.history.push('/Tasks')
            })
            .catch(e => {
                console.log(e);
            });
    }

    render() {
        const { currentTask } = this.state;

        return (
            <FadeIn>
                <div>
                    {currentTask ? (
                        <div className="edit-form">
                            <h4>Task</h4>
                            <form>
                                <div className="form-group">
                                    <label htmlFor="title">Title</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="title"
                                        value={currentTask.title}
                                        onChange={this.onChangeTitle}
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="description">Description</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="description"
                                        value={currentTask.description}
                                        onChange={this.onChangeDescription}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        <strong>Status:</strong>
                                    </label>
                                    {currentTask.completed ? "Completed" : "Pending"}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="startDate">Start Date</label>
                                    <DatePicker
                                        onChange={ this.onChangeDate }
                                        name="startDate"
                                        dateFormat="yyyy-MM-dd"
                                        value={currentTask.startDate.toString().split("T")[0]}
                                    />
                                </div>
                            </form>

                            {currentTask.completed ? (
                                <button
                                    className="badge badge-primary mr-2"
                                    onClick={() => this.updateCompleted(false)}
                                >
                                    Mark Pending
                                </button>
                            ) : (
                                <button
                                    className="badge badge-primary mr-2"
                                    onClick={() => this.updateCompleted(true)}
                                >
                                    Mark Complete
                                </button>
                            )}

                            <button
                                className="badge badge-danger mr-2"
                                onClick={this.deleteTask}
                            >
                                Delete
                            </button>

                            <button
                                type="submit"
                                className="badge badge-success"
                                onClick={this.updateTask}
                            >
                                Update
                            </button>
                            <p>{this.state.message}</p>
                        </div>
                    ) : (
                        <div>
                            <br />
                            <p>Please click on a Task...</p>
                        </div>
                    )}
                </div>
            </FadeIn>
        );
    }
}