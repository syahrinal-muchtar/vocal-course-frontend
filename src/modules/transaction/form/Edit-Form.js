import React, { Component } from 'react';
import { Formik } from 'formik';
import axios from 'axios';
import { Redirect } from 'react-router-dom'
import moment from "moment";
import Select from 'react-select';
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

export default class transactionEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paymentDate: new Date(),
      teachers: [],
      teacherId: '',
      selectedTeacher: '',
      students: [],
      studentId: '',
      selectedStudent: '',
      pricings: [],
      pricingId: '',
      selectedPricing: '',
      cost: '',
      royalty: '',
      receiptNumber: '',
      note: '',
      level: ''
    };
    this.onChangePaymentDate = this.onChangePaymentDate.bind(this);
    this.onChangeStudents = this.onChangeStudents.bind(this);
    this.onChangeTeacher = this.onChangeTeacher.bind(this);
    this.onChangeReceiptNumber = this.onChangeReceiptNumber.bind(this);
    this.onChangePricing = this.onChangePricing.bind(this);
    this.onChangeNote = this.onChangeNote.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChangePaymentDate(date) {
    this.setState({
      paymentDate: date
    });
  }

  onChangeStudents = (selectedStudent) =>  {
    this.setState({ selectedStudent });
    this.setState({ studentId: selectedStudent.value})
  }
  onChangeTeacher = (selectedTeacher) =>  {
    this.setState({ selectedTeacher });
    this.setState({ teacherId: selectedTeacher.value})
  }
  onChangePricing = (selectedPricing) =>  {
    this.setState({ selectedPricing });
    this.setState({ pricingId: selectedPricing.value})

    this.fetchPrice(selectedPricing.value)
  }
  onChangeReceiptNumber(e) {
    this.setState({receiptNumber: e.target.value})  
  }
  onChangeNote(e) {
    this.setState({note: e.target.value})  
  }

  componentDidMount = () => {
    // ajax call
    this.fetchTeachers()
    this.fetchStudents()
    this.fetchPricings()
    this.fetchDatas()
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
  
  fetchStudents = () => {
    fetch('http://localhost:8000/api/students')
      .then(response => response.json())
      .then((json) => {
        this.setState({
          students: json.data
        })
      })
  }

  fetchPricings = () => {
    fetch('http://localhost:8000/api/pricings/list')
      .then(response => response.json())
      .then((json) => {
        this.setState({
          pricings: json
        })
      })
  }

  fetchPrice = (id) => {
    fetch('http://localhost:8000/api/pricing/price/' + id)
      .then(response => response.json())
      .then((json) => {
        json.map((data) => {
          this.setState({
            cost: data.price,
            royalty: data.price*0.1
          })
        })
      })
  }

    fetchDatas = () => {
        const { transactionId } = this.props
        fetch('http://localhost:8000/api/transaction/' + transactionId)
            .then(response => response.json())
            .then((json) => {
                json.map((data, index) => {
                    if (data.type_by_difficulty == 1) {
                        data.type_by_difficulty = 'Basic'
                    } else if (data.type_by_difficulty == 2) {
                        data.type_by_difficulty = 'Intermediate'
                    } else if (data.type_by_participant == 3) {
                        data.type_by_difficulty = 'Pre adv & adv'
                    }

                    //   if(data.type_by_teacher == 1){
                    //     data.type_by_teacher = 'Regular teacher class'
                    //   }else if(data.type_by_participant == 2){
                    //     data.type_by_teacher = 'Senior teacher class'
                    //   }

                    if (data.type_by_participant == 1) {
                        data.type_by_participant = 'Private'
                    } else if (data.type_by_participant == 2) {
                        data.type_by_participant = 'Semi Private'
                    } else if (data.type_by_participant == 3) {
                        data.type_by_participant = 'Group'
                    }
                    this.setState({
                        selectedStudent: [{
                            value: data.student_id,
                            label: data.first_name + ' ' + data.middle_name + ' ' + data.last_name
                        }],
                        selectedTeacher: [{
                            value: data.teacher_id,
                            label: data.teacher_name
                        }],
                        selectedPricing: [{
                            value: data.pricing_id,
                            label: data.class_name + ' - ' + data.type_by_difficulty + ' - ' + data.type_by_participant
                        }],
                        pricingId: data.pricing_id,
                        teacherId: data.teacher_id,
                        studentId: data.student_id,
                        paymentDate: data.payment_date,
                        receiptNumber: data.receipt_number,
                        cost: data.cost,
                        royalty: data.royalty,
                        note: data.note,
                    })
                })
                // this.setState({
                //   datas: json
                // })
            })
    }

  dataStudents = (students) => {
    return (
      function () {
        let rowData = []
        students.map((data) => {
          rowData.push({
            value: data.id,
            label: data.first_name + ' ' + data.middle_name + ' ' + data.last_name,
          })
        })
        return rowData
      }()
    )
  }

  dataTeachers = (teachers) => {
    return (
      function () {
        let rowData = []
        teachers.map((data) => {
          rowData.push({
            value: data.id,
            label: data.name,
          })
        })
        return rowData
      }()
    )
  }

  dataPricings = (pricings) => {
    return (
      function () {
        let rowData = []
        pricings.map((data) => {
          if(data.type_by_difficulty == 1){
            data.type_by_difficulty = 'Basic'
          }else if(data.type_by_difficulty == 2){
            data.type_by_difficulty = 'Intermediate'
          }else if(data.type_by_participant == 3){
            data.type_by_difficulty = 'Pre adv & adv'
          }

        //   if(data.type_by_teacher == 1){
        //     data.type_by_teacher = 'Regular teacher class'
        //   }else if(data.type_by_participant == 2){
        //     data.type_by_teacher = 'Senior teacher class'
        //   }

          if(data.type_by_participant == 1){
            data.type_by_participant = 'Private'
          }else if(data.type_by_participant == 2){
            data.type_by_participant = 'Semi Private'
          }else if(data.type_by_participant == 3){
            data.type_by_participant = 'Group'
          }
          rowData.push({
            value: data.id,
            label: data.name + ' - ' + data.type_by_difficulty + ' - ' + data.type_by_participant,
          })
        })
        return rowData
      }()
    )
  }

  onSubmit(e) {
    e.preventDefault();
    const obj = {
      teacher: this.state.teacherId,
      student: this.state.studentId,
      payment_date: moment(this.state.paymentDate).format("YYYY-MM-DD hh:mm:ss"),
      receipt_number: this.state.receiptNumber,
      cost: this.state.cost,
      pricing: this.state.pricingId,
      royalty: this.state.royalty,
      note: this.state.note
    };
    console.log(obj)
      axios.patch('http://localhost:8000/api/transaction/' + this.props.transactionId, obj)
        .then(res => console.log(res.data))
        .then(() => this.setState({ redirect: true }));
  }

  render() {
    const { redirect } = this.state;
    if (redirect) {
      return <Redirect to='/transaction' />;
    }
    return (
      <div>
        <Formik
          initialValues={{ email: "", password: "" }}
          validate={values => {
            let errors = {};
            if (!values.email) {
              errors.email = "Required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = "Invalid email address";
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              alert(JSON.stringify(values, null, 2));
              setSubmitting(false);
            }, 400);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting
            /* and other goodies */
          }) => (
              <div>
                <form onSubmit={this.onSubmit}>
                  <div className="form-inline mb-2">
                    <label for="name" class="mr-sm-2 text-left d-block" style={{ width: 140 }}>
                      Teacher Name
                  </label>
                    <label>: &nbsp;</label>
                    <div style={{ display: 'inline-block', width: 223.2 }}>
                      <Select
                        value={this.state.selectedTeacher}
                        onChange={this.onChangeTeacher}
                        options={this.dataTeachers(this.state.teachers)}
                      />
                    </div>
                  </div>
                  <div className="form-inline mb-2">
                    <label for="name" class="mr-sm-2 text-left d-block" style={{ width: 140 }}>
                      Student Name
                  </label>
                    <label>: &nbsp;</label>
                    <div style={{ display: 'inline-block', width: 223.2 }}>
                      <Select
                        value={this.state.selectedStudent}
                        onChange={this.onChangeStudents}
                        options={this.dataStudents(this.state.students)}
                      />
                    </div>
                  </div>
                  <div className="form-inline mb-2">
                    <label for="name" class="mr-sm-2 text-left d-block" style={{ width: 140 }}>
                      Class
                  </label>
                    <label>: &nbsp;</label>
                    <div style={{ display: 'inline-block', width: 290 }}>
                      <Select
                        value={this.state.selectedPricing}
                        onChange={this.onChangePricing}
                        options={this.dataPricings(this.state.pricings)}
                      />
                    </div>
                  </div>
                  {/* <div className="form-inline mb-2">
                    <label for="level" class="mr-sm-2 text-left d-block" style={{ width: 140 }}>
                      Level
                    </label>
                    <label>: &nbsp;</label>
                    <select class="form-control" onChange={this.onChangeLevel} style={{width: 223.2}}>
                      <option value="">Choose One ..</option>
                      <option value="Basic 1">Basic 1</option>
                      <option value="Basic 2">Basic 2</option>
                      <option value="Middle 1">Middle 1</option>
                      <option value="Middle 2">Middle 2</option>
                      <option value="Pre Advance">Pre Advance</option>
                      <option value="Advance 1">Advance 1</option>
                      <option value="Advance 2">Advance 2</option>
                      <option value="Executive">Executive</option>
                      <option value="Group">Group</option>
                      <option value="Other">Other</option>
                    </select>
                  </div> */}
                  <div className="form-inline mb-2">
                    <label for="date" class="mr-sm-2 text-left d-block" style={{ width: 140 }}>
                      Payment Date
                    </label>
                    <label>: &nbsp;</label>
                    <DatePicker
                        selected={this.state.paymentDate}
                        onChange={this.onChangePaymentDate}
                        dateFormat="d-MM-yyyy"
                        peekNextMonth
                        showMonthDropdown
                        showYearDropdown
                        dropdownMode="select"
                        className="form-control"
                      />
                  </div>
                  <div className="form-inline mb-2">
                    <label for="receipt" class="mr-sm-2 text-left d-block" style={{ width: 140 }}>
                      Receipt Number
                    </label>
                    <label>: &nbsp;</label>
                    <input type="text" class="form-control mr-sm-2" id="receipt" 
                    value={this.state.receiptNumber}
                    onChange={this.onChangeReceiptNumber}/>
                  </div>
                  <div className="form-inline mb-2">
                    <label for="cost" class="mr-sm-2 text-left d-block" style={{ width: 140 }}>
                      Cost
                    </label>
                    <label>: &nbsp;</label>
                    <input type="text" class="form-control mr-sm-2" id="cost" value={this.state.cost} disabled />
                  </div>
                  <div className="form-inline mb-2">
                    <label for="royalty" class="mr-sm-2 text-left d-block" style={{ width: 140 }}>
                      Royalty
                    </label>
                    <label>: &nbsp;</label>
                    <input type="text" class="form-control mr-sm-2" id="royalty" value={this.state.royalty} disabled />
                  </div>
                  <div className="form-inline mb-2">
                    <label for="note" class="mr-sm-2 text-left d-block" style={{ width: 140 }}>
                      Note
                    </label>
                    <label>: &nbsp;</label>
                    <textarea class="form-control mr-sm-2" id="note" 
                    value={this.state.note}
                    onChange={this.onChangeNote}/>
                  </div>

                  <div className="form-group">
                    <button type="submit" class="btn btn-primary mb-2">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            )}
        </Formik>
      </div>
    )
  }
}
