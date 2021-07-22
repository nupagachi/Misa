class Position {
  urlGetAll = "http://cukcuk.manhnv.net/v1/Positions";
  constructor() {
    this.PositionId;
    this.PositionCode;
    this.PositionName;
    this.Description;
    this.ParentId;
    this.CreatedDate;
    this.CreatedBy;
    this.ModifiedDate;
    this.ModifiedBy;
  }
}

$(document).ready(function () {
  var position = new Position();
  loadOption(position.urlGetAll, "jobs", ".all-job");
  loadOption(position.urlGetAll, "positions", ".all-position");
});
