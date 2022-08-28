import React, { Component } from "react";
import TaskDataService from "../services/task.service";
import DatePicker from 'react-datepicker'
import FadeIn from 'react-fade-in';

import "react-datepicker/dist/react-datepicker.css";
import 'bootstrap/dist/css/bootstrap.min.css';

export default class AddTask extends Component {
    constructor(props) {
        super(props);
        this.onChangeTitle = this.onChangeTitle.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.saveTask = this.saveTask.bind(this);
        this.newTask = this.newTask.bind(this);

        this.state = {
            id: null,
            title: "",
            description: "",
            completed: false,
            startDate: new Date(),

            submitted: false
        };
    }

    onChangeTitle(e) {
        this.setState({
            title: e.target.value
        });
    }

    onChangeDescription(e) {
        this.setState({
            description: e.target.value
        });
    }

    onChangeDate(e) {
        this.setState({
            startDate: e
        })
    }

    saveTask() {
        var data = {
            title: this.state.title,
            description: this.state.description,
            startDate: this.state.startDate
        };

        TaskDataService.create(data)
            .then(response => {
                this.setState({
                    id: response.data.id,
                    title: response.data.title,
                    description: response.data.description,
                    completed: response.data.completed,
                    startDate: response.data.startDate,

                    submitted: true
                });
                console.log(response.data);
            })
            .catch(e => {
                console.log(e);
            });
    }

    newTask() {
        this.setState({
            id: null,
            title: "",
            description: "",
            completed: false,
            startDate: "",

            submitted: false
        });
    }

    render() {
        return (
            <FadeIn>
                <div className="submit-form">
                    {this.state.submitted ? (
                        <div>
                            <h4>Task submitted successfully!</h4>
                            <button className="btn btn-success" onClick={this.newTask}>
                                    Add
                            </button>

                        </div>
                    ) : (
                        <div>
                            <div className="form-group">
                                <label htmlFor="title">Title</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="title"
                                    required
                                    value={this.state.title}
                                    onChange={this.onChangeTitle}
                                    name="title"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="description">Description</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="description"
                                    required
                                    value={this.state.description}
                                    onChange={this.onChangeDescription}
                                    name="description"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="startDate">Start Date</label>
                                <DatePicker
                                    selected={ this.state.startDate }
                                    onChange={ this.onChangeDate }
                                    name="startDate"
                                    dateFormat="yyyy-MM-dd"
                                />
                            </div>

                            <button onClick={this.saveTask} className="btn btn-success">
                                Submit
                            </button>
                        </div>
                    )}
                </div>
            </FadeIn>
        );
    }
}