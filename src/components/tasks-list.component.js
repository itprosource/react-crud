import React, { Component } from "react";
import TaskDataService from "../services/task.service";
import FadeIn from 'react-fade-in';
import { Link } from "react-router-dom";

export default class TasksList extends Component {
    constructor(props) {
        super(props);
        this.onChangeSearchTitle = this.onChangeSearchTitle.bind(this);
        this.retrieveTasks = this.retrieveTasks.bind(this);
        this.refreshList = this.refreshList.bind(this);
        this.setActiveTask = this.setActiveTask.bind(this);
        this.removeAllTasks = this.removeAllTasks.bind(this);
        this.searchTitle = this.searchTitle.bind(this);

        this.state = {
            Tasks: [],
            currentTask: null,
            currentIndex: -1,
            searchTitle: ""
        };
    }

    componentDidMount() {
        this.retrieveTasks();
    }

    onChangeSearchTitle(e) {
        const searchTitle = e.target.value;

        this.setState({
            searchTitle: searchTitle
        });
    }

    retrieveTasks() {
        TaskDataService.getAll()
            .then(response => {
                this.setState({
                    Tasks: response.data
                });
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    refreshList() {
        this.retrieveTasks();
        this.setState({
            currentTask: null,
            currentIndex: -1
        });
    }

    setActiveTask(Task, index) {
        this.setState({
            currentTask: Task,
            currentIndex: index
        });
    }

    removeAllTasks() {
        TaskDataService.deleteAll()
            .then(response => {
                console.log(response.data);
                this.refreshList();
            })
            .catch(e => {
                console.log(e);
            });
    }

    searchTitle() {
        this.setState({
            currentTask: null,
            currentIndex: -1
        });

        TaskDataService.findByTitle(this.state.searchTitle)
            .then(response => {
                this.setState({
                    Tasks: response.data
                });
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    render() {
        const { searchTitle, Tasks, currentTask, currentIndex } = this.state;

        return (
            <FadeIn>
                <div className="list row">
                        <div className="col-md-8">
                            <div className="input-group mb-3">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by title"
                                    value={searchTitle}
                                    onChange={this.onChangeSearchTitle}
                                />
                                <div className="input-group-append">
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={this.searchTitle}
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h4>Tasks List</h4>

                            <ul className="list-group">
                                {Tasks &&
                                    Tasks.map((Task, index) => (
                                        <li
                                            className={
                                                "list-group-item " +
                                                (index === currentIndex ? "active" : "")
                                            }
                                            onClick={() => this.setActiveTask(Task, index)}
                                            key={index}
                                        >
                                            {Task.title}
                                        </li>
                                    ))}
                            </ul>

                            <button
                                className="m-3 btn btn-sm btn-danger"
                                onClick={this.removeAllTasks}
                            >
                                Remove All
                            </button>
                        </div>
                        <div className="col-md-6">
                            {currentTask ? (
                                <div>
                                    <h4>Task</h4>
                                    <div>
                                        <label>
                                            <strong>Title:</strong>
                                        </label>{" "}
                                        {currentTask.title}
                                    </div>
                                    <div>
                                        <label>
                                            <strong>Description:</strong>
                                        </label>{" "}
                                        {currentTask.description}
                                    </div>
                                    <div>
                                        <label>
                                            <strong>Status:</strong>
                                        </label>{" "}
                                        {currentTask.completed ? "Completed" : "Pending"}
                                    </div>
                                    <div>
                                        <label>
                                            <strong>Due Date:</strong>
                                        </label>{" "}
                                        {currentTask.startDate.split("T")[0]}
                                    </div>

                                    <Link
                                        to={"/Tasks/" + currentTask.id}
                                        className="badge badge-warning"
                                    >
                                        Edit
                                    </Link>
                                </div>
                            ) : (
                                <div>
                                    <br />
                                    <p>Please click on a Task...</p>
                                </div>
                            )}
                        </div>
                </div>
            </FadeIn>
        );
    }
}