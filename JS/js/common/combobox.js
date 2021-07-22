(function($) {
    $.fn.getText = function() {
        return this.val();
    }
})(jQuery);

(function($) {
    $.fn.getValue = function() {
        return this.attr("value");
    }
})(jQuery);

(function($) {
    $.fn.getData = function() {
        var _this = this;
        var listData = [];
        var data = $(_this).siblings(".select-option").children().data();
        $.each(data, function(index, item) {
            listData = listData.filter(data => data != item);
            // listData.push($(item).data());
        })
        return listData;
    }
})(jQuery);

$(document).ready(function() {
    // var department = new Department();
    // department.loadOption(department.urlGetAll, "formdepartments", ".all-formdepartment");

    var checkFormDepartment = false;
    $("#formdepartment").focus(function() {
        $(this).css("border", "1px solid #01b075")
    })
    $('#findbyformdepartment').on('click', function() {
        checkFormDepartment = !checkFormDepartment;
        chooseOption('#formdepartment', '.formdepartments', function(res) {
            $("#formdepartment").data(res);
        });
        if (checkFormDepartment == true) {
            showOption('.all-formdepartment', function() {});
        }
        if (checkFormDepartment == false) {
            hideOption('.all-formdepartment', function() {});
        }
        clickOutElement('#findbyformdepartment', function() {
            checkFormDepartment = false;
            hideOption('.all-formdepartment', function() {})
        });
        delOption('#formdepartment', null);
    })
    autoComplete("");
})

function autoComplete(_selector, text) {
    var data = $(_selector).children().data();

}


function createData(url, name_obj) {
    var data;
    if (url == "") {
        switch (name_obj) {
            case "gender":

                break;
        }
    }
}