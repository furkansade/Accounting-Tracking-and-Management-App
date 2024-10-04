const Employee = require('../../models/Employee.js');

exports.createEmployee = async (req, res) => {
    try {
      const fieldNames = {
        employeeFullName: 'Çalışan İsim Soyisim',
        employeeStartDate: 'Başlangıç Tarihi',
        employeeWorkSchedule: 'Çalışma Programı',
        employeeLeaveDays: 'İzin Günleri',
        employeeWorkType: 'Çalışma Türü',
    };

    const requiredFields = [
        'employeeFullName',
        'employeeStartDate',
        'employeeWorkSchedule',
        'employeeLeaveDays',
        'employeeWorkType',
    ];

    const missingFields = requiredFields
            .filter(field => !req.body[field])
            .map(field => fieldNames[field]);
        
    if (missingFields.length > 0) {
        const errorMessage = "Eksik alanlar: " + missingFields.join(', ');
        req.flash("error", errorMessage);
        return res.status(400).redirect('back');
    }

    const {
      employeeFullName,
      employeeStartDate,
      employeeExitDate,
      employeeWorkSchedule,
      employeeLeaveDays,
      employeeWorkType,
      employeeSalary,
      employeeSGK,
    } = req.body;

    const workScheduleArray = Object.values(employeeWorkSchedule);

    const newEmployee = new Employee({
      employeeFullName,
      employeeStartDate,
      employeeExitDate,
      employeeWorkSchedule: workScheduleArray,
      employeeLeaveDays,
      employeeWorkType,
      employeeSalary,
      employeeSGK,
    });

    await newEmployee.save();

    res.status(201).redirect('/admin/employees');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    res.status(500).redirect('back');
  }
};

exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      employeeFullName,
      employeeStartDate,
      employeeExitDate,
      employeeWorkSchedule,
      employeeLeaveDays,
      employeeWorkType,
      employeeSalary,
      employeeSGK,
    } = req.body;
    
    const workScheduleArray = Object.values(employeeWorkSchedule);
    
    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      {
        employeeFullName,
        employeeStartDate,
        employeeExitDate,
        employeeWorkSchedule: workScheduleArray,
        employeeLeaveDays,
        employeeWorkType,
        employeeSalary,
        employeeSGK,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    // eğer çıkış tarihi girilmişse çalışanlar sayfasına yönlendir
    if (employeeExitDate) {
      req.flash('success', 'Çalışan güncellendi ve çıkış tarihi eklendi!');
      return res.status(200).redirect('/admin/employees');
    }
    
    req.flash('success', 'Çalışan güncellendi!');
    
    res.status(200).redirect('back');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    res.status(500).redirect('back');
  }
};

exports.addLeaveDate = async (req, res) => {
  try {
    const { id } = req.params;
    const { leaveDate, numberOfLeaveDay, leaveReason } = req.body; // Gün sayısını aldık
    const employee = await Employee.findById(id);

    const leaveDateObj = new Date(leaveDate); 

    for (let i = 0; i < numberOfLeaveDay; i++) { 
      const currentLeaveDate = new Date(leaveDateObj);
      currentLeaveDate.setDate(leaveDateObj.getDate() + i);

      const formattedLeaveDate = currentLeaveDate.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

      await Employee.findByIdAndUpdate(
        id,
        {
          $push: {
            employeeLeaveDates: {
              leaveDate: currentLeaveDate, 
              leaveReason,
            },
          },
        },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    req.flash('success', `${employee.employeeFullName} çalışanına ${numberOfLeaveDay} günlük izin eklendi!`);
    res.status(200).redirect('back');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    res.status(500).redirect('back');
  }
};

// delete leave date
exports.deleteLeaveDate = async (req, res) => {
  try {
    const { id, leaveId } = req.params;
    const employee = await Employee.findById(id);
    
    await Employee.findByIdAndUpdate(
      id,
      {
        $pull: {
          employeeLeaveDates: {
            _id: leaveId,
          },
        },
      },
      {
        new: true,
        runValidators: true,
      }
    );
    
    req.flash('success', `${employee.employeeFullName} çalışanının izni silindi!`);
    
    res.status(204).redirect('back');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    res.status(500).redirect('back');
  }
};

exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    
    // updated employeeDeleted false to true
    await Employee.findByIdAndUpdate(
      id,
      {
        employeeDeleted: Date.now(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    req.flash('success', `${employee.employeeFullName} çalışanı silindi!`);

    res.status(204).redirect('/admin/employees');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Bir hata oluştu. Lütfen tekrar deneyin.');
    res.status(500).redirect('back');
  }
};