var defaultDepartment = $("#department").val();
var defaultJob = $("#job").val();
var listEmployee = [];
var _urlEmployee = "http://cukcuk.manhnv.net/v1/Employees";
var _urlNewCode = "http://cukcuk.manhnv.net/v1/Employees/NewEmployeeCode";
var newCode;
var checkDepartment = false;
var checkJob = false;
var listFilter;


class Employee {
    constructor(employeeCode, fullName, gender, dateOfBirth, phoneNumber, email, positionName, departmentName, salary, workStatus) {
        this.employeeCode = employeeCode;
        this.fullName = fullName;
        this.genderName = gender;
        this.dateOfBirth = dateOfBirth;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.positionName = positionName;
        this.departmentName = departmentName;
        this.salary = salary;
        this.workStatus = workStatus;
    }

    formatData(emp) {
        emp.EmployeeCode = (emp.EmployeeCode) ? emp.EmployeeCode : 'Không xác định';
        emp.FullName = (emp.FullName) ? emp.FullName : 'Không xác định';
        emp.GenderName = (emp.GenderName) ? emp.GenderName : 'Không xác định';
        let date = new Date(emp.DateOfBirth + '');
        emp.DateOfBirth = (emp.DateOfBirth) ? date.toLocaleDateString() : "";
        emp.PhoneNumber = (emp.PhoneNumber) ? emp.PhoneNumber : 'Không xác định';
        emp.Email = (emp.Email) ? emp.Email : 'Không xác định';
        emp.PositionName = (emp.PositionName) ? emp.PositionName : 'Không xác định';
        emp.DepartmentName = (emp.DepartmentName) ? emp.DepartmentName : 'Không xác định';
        emp.Salary = (emp.Salary) ? parseFloat(emp.Salary).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.") : 'Không xác định';
        emp.WorkStatus = (emp.WorkStatus) ? emp.WorkStatus : 'Không xác định';
        return emp;
    }

    getEmployeeById(code) {
        var listGet = [];
        let emp;
        return loadData(_urlEmployee).then(function (res) {
            if (res != false) {
                listGet = res;
                return res;
            } else return false;
        })
    }

    loadEmployee() {
        let _this = this;
        let list = [];
        loadData(_urlEmployee).then(function (listEmp) {
            $.each(listEmp, function (index, _emp) {
                list.push(_this.formatData(_emp));
            })
            loadTable(list);
        })
    }

    postEmployee() {
        let _this = this;
        var emp = dataForm("#formAdd", _this);
        delete emp.genderName;
        delete emp.positionName;
        delete emp.departmentName;
        postData(_urlEmployee, emp).then(function (res) {

            _this.reloadTable();
        });
    }

    putEmployee(id) {
        let _this = this;
        var emp = dataForm("#formAdd", _this);
        console.log(emp);
        delete emp.genderName;
        delete emp.positionName;
        delete emp.departmentName;
        putData(_urlEmployee, id, emp).then(function (res) {

            _this.reloadTable();
        });
    }

    delEmployee(id) {
        let _this = this;
        delData(_urlEmployee, id).then(function (res) {
            _this.loadEmployee();
        });
    }

    filterEmployee(pageSize, pageNumber, departmentId, positionId) {
        var params = {
            pageSize: pageSize,
            pageNumber: pageNumber,
            employeeFilter: "NV",
            departmentId: departmentId,
            positionId: positionId
        }
        filterObj(_urlEmployee + "employeeFilter", params).then(function (res) {
            listFilter = res;
        }, function (res) {
            listFilter = false;
        })
    }
    reloadTable() {
        var _this = this;
        $('tbody').empty();
        _this.loadEmployee();
        checkDepartment = false;
        checkJob = false;
        $("#department").val(defaultDepartment);
        $("#job").val(defaultJob);
        $("#department, #job").siblings('.xselect').addClass('hidden');
        $("#department, #job").siblings('.select-option').children().removeClass('choose-option');
        $("#department, #job").siblings('.select-option').find('i').addClass('hidden');
    }


    async initEvents() {
        var employee = this;
        $('.reload').on('click', function () {
            employee.reloadTable();
        })

        employee.loadEmployee();

        $('#table-body').on('dblclick', 'tr', function () {
            $(".cancel").addClass("cancel-update").removeClass("cancel");
            $(".btn-close-add").addClass("btn-close-update").removeClass("btn-close-add");
            let _tr = this;
            validateForm("#formAdd")
            $(_tr).siblings().removeClass("choose-option");
            $(_tr).addClass("choose-option");
            let obj = $(this).data();
            loadDataToForm(obj, "#formAdd");
            $('.add-item').css('display', 'flex');
            $('.save').addClass('update');
            $('.update').removeClass('save');
            $('.cancel-update, .btn-close-update').click(function () {
                showInfoPopup("post-cancel");
                $(".btn2-pop").off("click").on("click", function () {
                    $('.add-item').css('display', 'none');
                    $('.general-popup').css('display', 'none');
                    $(_tr).removeClass("choose-option");
                })
                $(".btn1-pop").off("click").on("click", function () {
                    $('.general-popup').css('display', 'none');
                })
            });
            $(".update").on('click', function () {
                showInfoPopup("put");
                var name = (" " + obj.FullName);
                $(".notification-pop p b span").text(name);
                $(".btn2-pop").off('click').on('click', function () {
                    $('.general-popup').css('display', 'none');
                    $(_tr).removeClass("choose-option");
                    var inputs = $("#formAdd input");
                    var invalid = 0;
                    var invalid1;
                    $.each(inputs, function (index, input) {
                        if (validateInput(input) == false) {
                            invalid += 1;
                            if (invalid == 1) {
                                invalid1 = input;
                            }
                        }
                        $(input).trigger("blur");
                    })
                    if (invalid > 0) {
                        $(invalid1).focus();
                        return;
                    } else {
                        employee.putEmployee(obj.EmployeeId, obj);
                        $(".add-item").css('display', 'none');
                    }
                })
                $(".btn1-pop").off('click').on('click', function () {
                    $(".general-popup").css("display", 'none');
                })
            })

        })
        var listDel = [];
        $('#table-body').off("click").on('click', 'tr td input', function () {
            if ($(this).prop("checked") == true) {
                console.log($(this).prop("checked"));
                listDel = listDel.filter(item => ((item) !== $(this).data()));
                listDel.push($(this).data());
            } else if ($(this).prop("checked") == false) {
                console.log($(this).prop("checked"));
                listDel = listDel.filter((item) => (item !== $(this).data()));
            }
        })

        $("table thead tr th i").off("click").on('click', function () {
            var name = "";
            showInfoPopup("delete");
            $.each(listDel, function (index, item) {
                name += (" " + item.FullName + ",");
            })
            $(".notification-pop p b span").text(name);
            $(".general-popup").css("display", "block");
            $(".btn1-pop").off("click").on("click", function () {
                $(".general-popup").css("display", "none");
            })
            $(".btn2-pop").off("click").on("click", function () {
                $(".general-popup").css("display", "none");
                $.each(listDel, function (index, item) {
                    listDel = listDel.filter(del => del != item);
                    employee.delEmployee(item.EmployeeId);
                })
                if (listDel.length == 0) {
                    $('#table-body').empty();
                    setTimeout(employee.loadEmployee(), 100);
                } else {
                    $('#table-body').empty();
                    employee.loadEmployee();
                }
            })
        })

        var checkDepartment = false;
        var _this = this;
        $('#findbydepartment, #department').on('click', function () {
            checkDepartment = !checkDepartment;
            checkJob = false;
            chooseOption('#department', '.departments', function (res) {
                $('tbody').empty();
                _this.filterEmployee(10, 1, res.DepartmentId, "");
                loadTable(listFilter);
            });
            if (checkDepartment == true) {
                showOption('.all-department', function () {
                    $('.all-department').siblings('.div-arrow').css({
                        'background-color': '#bbb',
                        'border-right': '1px solid #01b075'
                    });
                });
            }
            if (checkDepartment == false) {
                hideOption('.all-department', function () {
                    $('.all-department').siblings('.div-arrow').css({
                        'background-color': '#fff',
                        'border-right': '1px solid #bbb'
                    });
                });
            }
            clickOutElement('#findbydepartment, #department', function () {
                checkDepartment = false;
                hideOption('.all-department', function () {
                    $('.all-department').siblings('.div-arrow').css({
                        'background-color': '#fff',
                        'border-right': '1px solid #bbb'
                    });
                })
            });
            delOption('#department', defaultDepartment);
        })

        var checkJob = false;
        $('#findbyjob , #job').on('click', function () {
            checkJob = !checkJob;
            checkDepartment = false;
            chooseOption('#job', '.jobs', function (res) {
                $('#job').data(res);
            })
            if (checkJob == true) {
                showOption('.all-job', function () {
                    $('.all-job').siblings('.div-arrow').css({
                        'background-color': '#bbb',
                        'border-right': '1px solid #01b075'
                    });
                });
            }
            if (checkJob == false) {
                hideOption('.all-job', function () {
                    $('.all-job').siblings('.div-arrow').css({
                        'background-color': '#fff',
                        'border-right': '1px solid #bbb'
                    });
                });
            }
            clickOutElement('#findbyjob , #job', function () {
                checkJob = false;
                hideOption('.all-job', function () {
                    $('.all-job').siblings('.div-arrow').css({
                        'background-color': '#fff',
                        'border-right': '1px solid #bbb'
                    });
                })
            });
            delOption('#job', defaultJob);
        })

        $('.btn-add-emp').on("click", function () {
            validateForm("#formAdd")
            loadData(_urlNewCode).then(function (res) {
                console.log("res", res)
                newCode = res;
                $('.add-item').css('display', 'flex');
                var dataInput = $("form input");
                $.each(dataInput, function (index, input) {
                    $(input).val("");
                })
                $('.add-item form #code').val(newCode);
                console.log()
                $('#code').focus();
                $('#code').addClass('input-focus');
            }, function () {
                console.log("vao day")
                $('.add-item').css('display', 'flex');
                var dataInput = $("form input");
                $.each(dataInput, function (index, input) {
                    $(input).val("");
                })
                $('#code').focus();
                $('#code').addClass('input-focus');
            })
        });

        $('.findid input').on("focus", function () {
            $('.findid').css('border', '1px solid #01b075');
        })
        $('.findid input').on("blur", function () {
            $('.findid').css('border', '1px solid #bbbbbb');
        })

        $(".save").off("click").click(function () {
            showInfoPopup("post");
            $(".btn1-pop").off("click").on("click", function () {
                $('.general-popup').css('display', 'none');
            })
            $(".btn2-pop").off("click").on("click", function () {
                var inputs = $("#formAdd input");
                var invalid = 0;
                var invalid1;
                $.each(inputs, function (index, input) {
                    if (validateInput(input) == false) {
                        invalid += 1;
                        if (invalid == 1) {
                            invalid1 = input;
                        }
                    }
                    $(input).trigger("blur");
                })
                if (invalid > 0) {
                    $('.general-popup').css('display', 'none');
                    $(invalid1).focus();
                    return;
                } else {
                    employee.postEmployee();
                    $('.general-popup').css('display', 'none');
                    $(".add-item").css('display', 'none');
                }
            })
        })

        $('.cancel, .btn-close-add').click(function () {

            $('.add-item').css('display', 'none');
            $('.general-popup').css('display', 'none');
            $(".btn1-pop").off("click").on("click", function () {
                $('.general-popup').css('display', 'none');
            })
        });
    }
}

$(document).ready(function () {
    new Employee().initEvents();
    $(".add-emp").css("cursor", "all-scroll");
    $(".add-emp").draggable();
    $(".pop").draggable();
    $(".xpop, .btn2-pop").click(function () {
        $(".general-popup").css("display", "none");
    })
})