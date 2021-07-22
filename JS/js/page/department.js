class Department {
    urlGetAll = "http://cukcuk.manhnv.net/api/Department";
    constructor() {
        this.DepartmentId;
        this.DepartmentCode;
        this.DepartmentName;
        this.Description;
        this.CreatedDate;
        this.CreatedBy;
        this.ModifiedDate;
        this.ModifiedBy;
    }
}

$(document).ready(function() {
    var department = new Department();
    loadOption(department.urlGetAll, "departments", ".all-department");
    loadOption(department.urlGetAll, "formdepartments", ".all-formdepartment");
})