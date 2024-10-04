const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
  employeeFullName: {
    type: String,
    required: true,
  },
  employeeStartDate: {
    type: Date,
    required: true,
  },
  employeeExitDate: {
    type: Date,
    required: false,
    default: null,
  },
  employeeWorkSchedule: {
    type: [{
      day: {
        type: String,
        enum: ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"],
        required: false,
      },
      startTime: {
        type: String,
        required: false,
      },
      endTime: {
        type: String,
        required: false,
      },
    }],
    required: false,
  },
  employeeLeaveDays: {
    type: Number,
    default: 14,
  },
  employeeRemainingLeaveDays: {
    type: Number,
    default: 14,
  },
  employeeLeaveDates: {
    type: [{
      leaveDate: {
        type: Date,
        required: true,
      },
      leaveReason: {
        type: String,
      },
    }],
    default: [],
  },
  employeeWorkType: {
    type: String,
    enum: ["Full Time", "Part Time", "Remote", "Stajyer", "Dönemsel"],
    required: true,
  },
  employeeSalary: {
    type: Number,
    required: false,
  },
  employeeSGK: {
    type: Number,
    required: false,
  },
  employeeCreated: {
    type: Date,
    default: Date.now,
  },
  employeeDeleted: {
    type: Date,
    default: null,
  },
});

const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;
