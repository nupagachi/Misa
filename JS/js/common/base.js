function loadData(_url) {
    return $.ajax({
        url: _url,
        method: 'GET',
        success: function(res) {
            return res;
        },
        error: function(res) {
            return false;
        }
    });
}
function postData(_url, data) {
    return $.ajax({
        url: _url,
        method: 'POST',
        data: JSON.stringify(data),
        contentType: "application/json",
        success: function(res) {
            return res;
        },
        error: function(res) {
            return res
        }
    })
}
function putData(_url, id, data) {
    let _urlPut = _url + "/" + id;
    return $.ajax({
        url: _urlPut,
        method: 'PUT',
        data: JSON.stringify(data),
        contentType: "application/json;charset=utf8",
        success: function(res) {
            console.log("ok");
            return res;
        },
        error: function(res) {
            return res
        }
    })

}
function delData(_url, id) {
    let _urlDel = _url + '/' + id;
    return $.ajax({
        url: _urlDel,
        method: 'DELETE',
        success: function(res) {
            return res;
        },
        error: function(res) {
            return res;
        }
    })
}

function filterObj(_url, params) {
    return $.ajax({
        url: _url,
        method: 'GET',
        data: params,
        success: function(res) {
            return res;
        },
        error: function(res) {
            return false;
        }
    });
}
function loadOption(_url, classOption, parentOption) {
    var selectNeedUrl = $("div[selectName]");
    $.each(selectNeedUrl, function(index, select) {
        var name = $(select).attr("selectName");
        var value = $(select).attr("selectValue");
        loadData(_url).then(function(res) {
            $(parentOption).empty();
            $.each(res, function(index, item) {
                var div = $(`<div></div>`);
                div.addClass(classOption);
                div.data(item);
                div.append(item[name]);
                div.attr("id", item[value]);
                div.attr("value", item[value]);
                $(parentOption).append(div);
            })
        })
    })
}
function showOption(select_option, _function) {
    var _option = $(select_option);
    _option.slideDown(300);
    _option.siblings('.div-arrow').children('.fa-chevron-down').css('font-size', '0');
    _option.siblings('.div-arrow').children('.fa-chevron-up').css('font-size', '12px');
    _option.siblings("input").css('border', '1px solid #01b075');
    _function();
}
function hideOption(select_option, _function) {
    var _option = $(select_option);
    _option.slideUp(300);
    _option.siblings('.div-arrow').children('.fa-chevron-up').css('font-size', '0');
    _option.siblings('.div-arrow').children('.fa-chevron-down').css('font-size', '12px');
    _option.siblings("input").css('border', '1px solid #bbb');
    _function();
}
function chooseOption(id_select, name_option, _function) {
    $(name_option).on('click', function() {
        // _check = false;
        $(this).siblings().removeClass("choose-option");
        $(this).addClass("choose-option");
        $(this).siblings().children('i').css('visibility', 'hidden');
        let select_option = $(this).parent().attr('class');
        $(this).children().css('visibility', 'visible');
        $(id_select).val($(this).text());
        $(id_select).next().css('visibility', 'visible');
        hideOption('.select-option', function() {});
        _function($(this).data());
    })
}

function clickOutElement(_selector, _function) {
    $(document).click(function(event) {
        var $target = $(event.target);
        if (!$target.closest(_selector).length && !$target.closest($(_selector).children()).length &&
            $(_selector).is(":visible")) {
            _function();
        }
    });
}

function delOption(id_select, defaultValue) {
    $(id_select).siblings('.xselect').click(function() {
        $(id_select).val(defaultValue);
        $(id_select).siblings('.xselect').css('visibility', 'hidden');
        $(id_select).siblings('.select-option').children().removeClass('choose-option');
        $(id_select).siblings('.select-option').find('i').css('visibility', 'hidden');
    })
}

function loadTable(listObj) {
    $.each(listObj, function(index, obj) {
        var thData = $('table thead tr th');
        var tr = $(`<tr></tr>`);
        tr.data(obj);
        $.each(thData, function(index, _item) {
            var fieldName = $(_item).attr('fieldName');
            var value = obj[fieldName];
            var field = fieldName + '';
            if (field.toLowerCase() == "checkbox") {
                var td = $(`<td style="text-align: center;"><input type="checkbox"></td>`);
                td.children('input').addClass("checkbox");
                td.children('input').data(obj);
            } else if (field.toLowerCase().includes("date")) {
                var td = $(`<td style="text-align: center;"></td>`);
                td.append(value);
            } else if (field.toLowerCase() == "salary") {
                var td = $(`<td style="text-align: end;"></td>`);
                td.append(value);
            } else {
                var td = $(`<td></td>`);
                td.append(value);
            }
            tr.append(td);
            // tr.data()
            $("tbody").append(tr);
        })
    })
}
function showInfoPopup(action) {
    var title, message, btn1, btn2;
    var pop = $(".general-popup");
    pop.css("display", "block");
    var p_mgs = $(`<p></p>`);
    var p_title = $(`<p></p>`);
    var icon = $(`<i class="fas fa-exclamation-triangle"></i>`)
    var img = $(`<img src = "../lib/icon/warning.png">`);
    pop.find(".title-pop").empty();
    pop.find(".icon-pop").empty();
    pop.find(".notification-pop").empty();
    if (action == "post-cancel") {
        title = "Đóng Form thông tin chung";
        message = "Bạn có chắc muốn đóng form nhập thông tin<b> Thêm mới nhân viên <span></span></b> không?";
        btn1 = "Tiếp tục nhập";
        btn2 = "Đóng";
        p_title.text(title);
        pop.find(".title-pop").append(p_title);
        pop.find(".icon-pop").append(img);
        p_mgs.append(message);
        pop.find(".notification-pop").append(p_mgs);
        pop.find(".btn1-pop").text(btn1);
        pop.find(".btn2-pop").text(btn2);
        pop.find(".btn2-pop").addClass("primary-pop");
    } else if (action == "put-cancel") {
        title = "Đóng Form thông tin chung";
        message = "Bạn có chắc muốn đóng form <b> Cập nhật thông tin nhân viên <span></span></b> không?";
        btn1 = "Tiếp tục nhập";
        btn2 = "Đóng";
        p_title.text(title);
        pop.find(".title-pop").append(p_title);
        pop.find(".icon-pop").append(img);
        p_mgs.append(message);
        pop.find(".notification-pop").append(p_mgs);
        pop.find(".btn1-pop").text(btn1);
        pop.find(".btn2-pop").text(btn2);
        pop.find(".btn2-pop").addClass("primary-pop");
    } else if (action == "post") {
        title = "Form thêm mới thông tin";
        message = "Bạn có chắc muốn <b> Thêm mới nhân viên</b> không?";
        btn1 = "Hủy";
        btn2 = "Thêm";
        pop.find(".icon-pop").append(img);
        p_mgs.append(message);
        pop.find(".notification-pop").append(p_mgs);
        pop.find(".btn1-pop").text(btn1);
        pop.find(".btn2-pop").text(btn2);
        pop.find(".btn2-pop").addClass("primary-pop");
    } else if (action == "put") {
        title = "Form cập nhật thông tin";
        message = "Bạn có chắc muốn <b> Cập nhật thông tin nhân viên <span></span></b> không?";
        btn1 = "Hủy";
        btn2 = "Lưu";
        pop.find(".icon-pop").append(img);
        p_mgs.append(message);
        pop.find(".notification-pop").append(p_mgs);
        pop.find(".btn1-pop").text(btn1);
        pop.find(".btn2-pop").text(btn2);
        pop.find(".btn2-pop").addClass("primary-pop");
    } else if (action == "delete") {
        title = "Xóa thông tin nhân viên";
        message = "Bạn có chắc muốn <b> Xóa thông tin <i></i> nhân viên <span></span></b> không?";
        btn1 = "Hủy";
        btn2 = "Xóa";
        p_title.text(title);
        pop.find(".title-pop").append(p_title);
        pop.find(".icon-pop").append(icon);
        pop.find(".icon-pop i").addClass('delete-icon-pop');
        p_mgs.append(message);
        pop.find(".notification-pop").append(p_mgs);
        pop.find(".btn1-pop").text(btn1);
        pop.find(".btn2-pop").text(btn2);
        pop.find(".btn2-pop").addClass('delete-pop');
    }

}