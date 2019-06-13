import React, { Component } from "react";
import { MDBDataTable, MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter  } from 'mdbreact';
import { NavLink } from "react-router-dom";
import update from 'react-addons-update';
import moment from "moment";
import DatePicker from "react-datepicker";
import axios from 'axios';

import "react-datepicker/dist/react-datepicker.css";

export default class attendancesList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      attendances: [],
      filterDate: new Date(),
      deleteConfirm: false,
      students: [],
      studentSelected: [],
      teachers: [],
      teacherSelected: [],
      studentStatus: [],
      teacherStatus: [],
      deleteId : ''
    }
    this.delete = this.delete.bind(this);
    this.onChangeStudentStatus = this.onChangeStudentStatus.bind(this);
    this.onChangeTeacherStatus = this.onChangeTeacherStatus.bind(this);
    this.onChangeStudent = this.onChangeStudent.bind(this);
    this.onChangeTeacher = this.onChangeTeacher.bind(this);
  }

  onChangeStudentStatus(e, id) {
    this.setState({
      studentStatus: update(this.state.studentStatus, {[id]: {$set: e.target.value}})
    })
    const obj = {
      student_status: e.target.value
    };
    axios.patch('http://localhost:8000/api/attendance/' + id, obj)
      .then(res => console.log(res.data))
      .catch(error => {
        console.log(error.message);
      })
  }

  onChangeTeacherStatus(e, id) {
    this.setState({
      teacherStatus: update(this.state.teacherStatus, {[id]: {$set: e.target.value}})
    })
    const obj = {
      teacher_status: e.target.value
    };
    axios.patch('http://localhost:8000/api/attendance/' + id, obj)
      .then(res => console.log(res.data))
      .catch(error => {
        console.log(error.message);
      })
  }

  onChangeStudent(e, id) {
    this.setState({
      studentSelected: update(this.state.studentSelected, {[id]: {$set: e.target.value}})
    })
    const obj = {
      student_id: e.target.value
    };
    console.log(obj, id)
    axios.patch('http://localhost:8000/api/attendance/' + id, obj)
      .then(res => console.log(res.data))
      .catch(error => {
        console.log(error.message);
      })
  }

  onChangeTeacher(e, id) {
    this.setState({
      teacherSelected: update(this.state.teacherSelected, {[id]: {$set: e.target.value}})
    })
    const obj = {
      teacher_id: e.target.value
    };
    axios.patch('http://localhost:8000/api/attendance/' + id, obj)
      .then(res => console.log(res.data))
      .catch(error => {
        console.log(error.message);
      })
  }

  onChangeFilterDate = filterDate => {
    this.setState({
      filterDate: filterDate
    });
    this.filterData(filterDate)
  }

  delete(id) {
    axios.delete('http://localhost:8000/api/teacher_attendance/' + id)
      .then(console.log('Deleted'))
      .then(() => this.setState({deleteConfirm: !this.state.deleteConfirm}))
      .then(() => this.fetchData())
      .catch(err => console.log(err))
  }

  toggleDeleteConfirmation = (id) => {
    this.setState({
      deleteConfirm: !this.state.deleteConfirm,
      deleteId: id
    });
  }

  componentDidMount = () => {
    // ajax call
    this.fetchData()
    this.fetchStudents()
    this.fetchTeachers()
  }

  createStudentPicker = (students) => {
    let opt = []

    students.map((student) => {
      Array.isArray(student) && student.map((data) => {
        opt.push(<option value={data.id}>{data.first_name + ' ' + data.middle_name + ' ' + data.last_name}</option>)
      })
    })

    return (
        opt
    )
  }

  createTeacherPicker = (teachers) => {
    let opt = []

    teachers.map((data) => {
      opt.push(<option value={data.id}>{data.name}</option>)
    })

    return (
        opt
    )
  }

  fetchData = () => {
    fetch('http://localhost:8000/api/attendances')
      .then(response => response.json())
      .then((json) => {
        this.setState({
          attendances: json,
        })
        console.log(json)
        json.map((data, index) => {
          this.setState({
            studentStatus: update(this.state.studentStatus, {[data[0].attendances_id]: {$set: data[0].student_status}}),
            teacherStatus: update(this.state.teacherStatus, {[data[0].attendances_id]: {$set: data[0].teacher_status}}),
            studentSelected: update(this.state.studentSelected, {[data[0].attendances_id]: {$set: data[0].student_id}}),
            teacherSelected: update(this.state.teacherSelected, {[data[0].attendances_id]: {$set: data[0].teacher_id}})
          })
        })
      })
  }

  fetchStudents = () => {
    fetch('http://localhost:8000/api/students?status=3')
      .then(response => response.json())
      .then((json) => {
        console.log('student', json)
        this.setState({
          students: json
        })
      })
  }

  fetchTeachers = () => {
    fetch('http://localhost:8000/api/teachers')
      .then(response => response.json())
      .then((json) => {
        this.setState({
          teachers: json.data
        })
      })
  }

  filterData = (filterDate) => {
    fetch('http://localhost:8000/api/attendances/filter?date='+moment(filterDate).format("YYYY-MM-DD"))
      .then(response => response.json())
      .then((json) => {
        this.setState({
          attendances: json
        })
        console.log('coba', json)
        json.map((data, index) => {
          this.setState({
            studentStatus: update(this.state.studentStatus, {[data[0].attendances_id]: {$set: data[0].student_status}}),
            teacherStatus: update(this.state.teacherStatus, {[data[0].attendances_id]: {$set: data[0].teacher_status}}),
            studentSelected: update(this.state.studentSelected, {[data[0].attendances_id]: {$set: data[0].student_id}}),
            teacherSelected: update(this.state.teacherSelected, {[data[0].attendances_id]: {$set: data[0].teacher_id}})
          })
        })
      })
  }

  data = (attendances) => {
    const {studentStatus, teachers, teacherStatus, teacherSelected, students, studentSelected} = this.state
    const onChangeStudentStatus = this.onChangeStudentStatus
    const onChangeTeacherStatus = this.onChangeTeacherStatus
    const onChangeStudent = this.onChangeStudent
    const onChangeTeacher = this.onChangeTeacher
    const createStudentPicker = this.createStudentPicker
    const createTeacherPicker = this.createTeacherPicker

    return ({
      columns: [
        {
          label: 'Day',
          field: 'day',
          sort: 'asc',
          width: 150
        },
        {
          label: 'Time',
          field: 'time',
          sort: 'asc',
          width: 270
        },
        {
          label: 'Student\'s Name',
          field: 'student',
          sort: 'asc',
          width: 200
        },
        {
          label: 'Status Student',
          field: 'status_student',
          sort: 'asc',
          width: 150
        },
        {
          label: 'Teacher\'s Name',
          field: 'teacher',
          sort: 'asc',
          width: 100
        },
        {
          label: 'Status Teacher',
          field: 'status_teacher',
          sort: 'asc',
          width: 150
        },
      ],
      rows: (function () {
        let rowData = []

        // console.log('bang',students)
        attendances.map((data, index) => {
          // console.log('coba1 studentID:',data.student_id,'isi:', studentSelected[data.student_id], 'class', data.class_name)
          rowData.push({
            day: data.day,
            time: data.time,
            student: <select class="form-control" onChange={(e) => onChangeStudent(e, data.attendances_id)} value={studentSelected[data.attendances_id]}>
              {createStudentPicker(students)}
            </select>,
            status_student: <select class="form-control" onChange={(e) => onChangeStudentStatus(e, data.attendances_id)} value={studentStatus[data.attendances_id]}>
              <option value="0"></option>
              <option value="1">Absent</option>
              <option value="2">With Permission</option>  
              <option value="3">Attend</option>
            </select>,
            teacher: <select class="form-control" onChange={(e) => onChangeTeacher(e, data.attendances_id)} value={teacherSelected[data.attendances_id]}>
            {createTeacherPicker(teachers)}
          </select>,
            teacher_student: <select class="form-control" onChange={(e) => onChangeTeacherStatus(e, data.attendances_id)} value={teacherStatus[data.attendances_id]}>
              <option value="0"></option>
              <option value="1">Absent</option>
              <option value="2">With Permission</option>
              <option value="3">Attend</option>
            </select>
          })
        })
        return rowData
      }())
    })
    
  };

  tableAttendancesGroup = (attendances) => {
    let table = []

    attendances.forEach((attendance, index) => {
      // console.log('coba2',attendance)

      table.push(
        <section className="content-header">
        <div className="row">
          <div className="col-md-12">
            <div className="box">
              <div className="content">
              <h5>Class : {attendance[0].class_name}</h5>
                <div class="box-header">
                  {/* <NavLink to="/schedule/add" class="btn btn-success"><i class="fa fa-plus"></i> Add Schedule</NavLink> */}
                    <div class="float-right">
                      {index < 1 && (
                        <>
                          <DatePicker
                            selected={this.state.filterDate}
                            onChange={this.onChangeFilterDate}
                            dateFormat="d-MM-yyyy"
                            peekNextMonth
                            dropdownMode="select"
                            className="form-control"
                          />
                        </>
                      )}
                  </div>
                </div>
                <MDBDataTable
                  striped
                  bordered
                  hover
                  data={this.data(attendance)}
                  btn
                />
                <MDBContainer>
                  <MDBModal isOpen={this.state.deleteConfirm} toggle={this.toggleDeleteConfirmation} size="sm" centered>
                    <MDBModalHeader toggle={this.toggleDeleteConfirmation}>Delete</MDBModalHeader>
                    <MDBModalBody>
                      Are you sure you want to delete it ?
                    </MDBModalBody>
                    <MDBModalFooter>
                      <MDBBtn color="secondary" onClick={this.toggleDeleteConfirmation}>Cancel</MDBBtn>
                      <MDBBtn color="danger" onClick={() => this.delete(this.state.deleteId)}>Delete</MDBBtn>
                    </MDBModalFooter>
                  </MDBModal>
                </MDBContainer>
              </div>
            </div>
          </div>
        </div>
      </section>
      )
    });
    return(
      table
    )
  }

  render() {
    // console.log('coba3',this.state.studentSelected[6])
    const { attendances } = this.state
    return (
      <>
        {this.tableAttendancesGroup(attendances)}
      </>
    )
  }
}

