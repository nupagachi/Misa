var checkGender = false;

$('#findbygender').on('click', function () {
    checkGender = !checkGender;
    checkPosition = false;
    checkFormDepartment = false;
    checkStatus = false;
    if (checkGender == true) {
        showOption('.all-gender', function () {
            chooseOption('#gender', '.genders', function (res) {
                $('#gender').data(res);
            });
        });
    } else {
        hideOption('.all-gender', function () { });
    }
    clickOutElement('#findbygender', function () {
        checkGender = false;
        hideOption('all-gender', function () { });
    })
    delOption('#gender', null);
})

var checkPosition = false;
$('#findbyposition').on('click', function () {
    checkPosition = !checkPosition;
    checkGender = false;
    checkFormDepartment = false;
    checkStatus = false;
    chooseOption('#position', '.positions', function (res) {
        $('#position').data(res);
    });
    if (checkPosition == true) {
        showOption('.all-position', function () { });
    }
    if (checkPosition == false) {
        hideOption('.all-position', function () { });
    }
    clickOutElement('#findbyposition', function () {
        checkPosition = false;
        hideOption('.all-position', function () { })
    });
    delOption('#position', null);
})

var checkFormDepartment = false;
$('#findbyformdepartment').on('click', function () {
    checkFormDepartment = !checkFormDepartment;
    checkPosition = false;
    checkGender = false;
    checkStatus = false;
    chooseOption('#formdepartment', '.formdepartments', function (res) {
        $("#formdepartment").data(res);
    });
    if (checkFormDepartment == true) {
        showOption('.all-formdepartment', function () { });
    }
    if (checkFormDepartment == false) {
        hideOption('.all-formdepartment', function () { });
    }
    clickOutElement('#findbyformdepartment', function () {
        checkFormDepartment = false;
        hideOption('.all-formdepartment', function () { })
    });
    delOption('#formdepartment', null);
})

var checkStatus = false;
$('#findbystatus').on('click', function () {
    checkStatus = !checkStatus;
    checkPosition = false;
    checkGender = false;
    checkFormDepartment = false;
    chooseOption('#status', '.statuss', function (res) {
        $("#status").data(res);
    });
    if (checkStatus == true) {
        showOption('.all-status', function () { });
    }
    if (checkStatus == false) {
        hideOption('.all-status', function () { });
    }
    clickOutElement('#findbystatus', function () {
        checkStatus = false;
        hideOption('.all-status', function () { })
    });
    delOption('#status', null);
})

function loadDataToForm(obj, _selectorForm) {
    var dataInput = $(_selectorForm).find("input");
    $.each(dataInput, function (index, input) {
        var fieldName = $(input).attr('fieldName');
        if (fieldName.toLowerCase().includes("date")) {
            console.log(fieldName);
            let d = new Date(obj[fieldName] + '');
            let month = '' + (d.getMonth() + 1);
            let day = '' + d.getDate();
            let year = d.getFullYear();

            if (month.length < 2)
                month = '0' + month;
            if (day.length < 2)
                day = '0' + day;
            let date = [year, month, day].join('-');
            $(input).val(date);
        } else if (fieldName.toLowerCase().includes("salary")) {
            let salary = obj[fieldName].split(".");
            let s = "";
            for (let i = 0; i < salary.length; i++) {
                s += salary[i];
            }
            s = parseInt(s);
            $(input).val(s);
        } else {
            $(input).val(obj[fieldName]);
        }
    });
}
function dataForm(_selector, obj) {
    var inputs = $(_selector).find('input');
    $.each(inputs, function (input) {
        var name = $(input).attr('fieldName') + '';
        var fieldName = name[0].toLowerCase() + name.substr(1,);
        if (fieldName.toLowerCase() == "gendername") {
            switch ($(input).val().toLowerCase()) {
                case "nam":
                    obj.gender = 1;
                    break;
                case "nữ":
                    obj.gender = 0;
                    break;
                default:
                    obj.gender = 3;
                    break;
            }
        } else if (fieldName.toLowerCase() == "departmentname") {
            obj.departmentId = $(input).data().DepartmentId;
        } else if (fieldName.toLowerCase() == "positionname") {
            obj.positionId = $(input).data().PositionId;
        } else if (fieldName.toLowerCase().includes("date")) {

            var d = $(input).val() + '';
            var date = d.split("-");
            var dateFormat = new Date(date[2], date[0] - 1, date[1]);
            obj[fieldName] = dateFormat;
        } else if (fieldName.toLowerCase() == "workstatus") {
            switch ($(input).val().toLowerCase()) {
                case "đang làm việc":
                    obj.workStatus = 1;
                    break;
                default:
                    obj.workStatus = 0;
                    break;
            }
        } else {
            obj[fieldName] = $(input).val();
        }

    })
    return obj;
}

function validateForm(selector) {
    var formInput = $(selector).find('input');
    $.each(formInput, function (index, _input) {
        $(_input).on('focus', function () {
            $(_input).addClass('input-focus');
            if ($(_input).siblings('.select-option').length != 0) {
                showOption($(_input).siblings(".select-option"), function () { });
            }
            if ($(_input).val() != "") {
                $(_input).siblings(".xselect").css('visibility', 'visible');
                delOption(_input, "");
            }
            if (validateInput(_input) == false) {
                $(_input).parent().find(".tooltipMgs").remove();
            }
        })
        $(_input).on('blur', function () {
            $(_input).siblings(".xselect").css('visibility', 'hidden');
            $(_input).removeClass('input-focus');
            $(_input).parent().find(".tooltipMgs").remove();
            if ($(_input).siblings('.select-option').length != 0) {
                hideOption($(_input).siblings(".select-option"), function () { });
            }
            if (validateInput(_input) == false) {
                $(_input).addClass("invalid-input");
                $(_input).removeClass("input-focus");
            }
        })
    })
}

function validateInput(_input) {
    if ($(_input).attr('validate')) {
        var email = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        var tooltip = $(`<div></div>`);
        var triangle = $(`<div id="triangle-down"></div>`);
        var code = $(_input).find("#code").val();
        if (($(_input).val() != "")) {
            if ($(_input).attr("fieldName").toLowerCase().includes("email")) {
                if (email.test($(_input).val()) == true) {
                    tooltip.remove();
                    $(_input).removeClass("invalid-input");
                    return true;
                }
            } else if ($(_input).attr('fieldName').toLowerCase().includes("code")) {
                if (checkEmployeeCode(code) == false) {
                    tooltip.text("");
                    tooltip.append(triangle);
                    tooltip.addClass("tooltipMgs");
                    $(_input).parent().append(tooltip);
                    $(_input).addClass("invalid-input");
                    return false;
                } else if (phone.test($(_input).val()) == true) {
                    tooltip.remove();
                    $(_input).removeClass("invalid-input");
                    return true;
                }
            } else {
                $(".tooltipMgs").remove();
                $(_input).removeClass("invalid-input");
                return true;
            }
        } else {
            $(_input).removeClass('focus-input');
            $(_input).addClass("invalid-input");
            return false;
        }
    } else {
        return true;
    }
}
