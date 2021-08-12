using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MISA.CukCuk.Api.Model;
using MySqlConnector;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace MISA.CukCuk.Api.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class EmployeesController : ControllerBase
	{
		//Truy cập vào database
		//1. Khởi tạo thông tin kết nối database
		public static string connectionString = "Host= 47.241.69.179;" +
				"Database = MISA.CukCuk_Demo_NVMANH;" +
				"User Id = dev;" +
				"Password = 12345678;";


		/// <summary>
		/// API hiển thị tất cả các nhân viên
		/// </summary>
		/// <returns></returns>
		[HttpGet]
		public IActionResult GetEmployees()
		{
			try
			{
				//2. Khởi tạo đối tượng kết nối với database
				IDbConnection dbConnection = new MySqlConnection(connectionString);


				//3. Lấy dữ liệu
				var sqlCommand = "SELECT * FROM Employee";
				var employees = dbConnection.Query<object>(sqlCommand);

				if (employees.Count() == 0)
				{
					return StatusCode(204);
				}

				//4. Trả về cho client
				var response = StatusCode(200, employees);
				return response;

			}
			catch (Exception ex)
			{

				var exception = new
				{
					devMsg = ex.Message,
					userMsg = WebApplication1.Properties.Resources.CommonError,
					errorCode = "misa-001",
					moreInfo = "https://openapi.misa.com.vn/errorcode/misa-001",
					traceId = "ba9587fd-1a79-4ac5-a0ca-2c9f74dfd3fb"

				};
				return StatusCode(500, exception);
			}

		}

		/// <summary>
		/// API hiển thị nhân viên theo id
		/// </summary>
		/// <param name="employeeId"></param>
		/// <returns></returns>
		[HttpGet("{employeeId}")]
		public IActionResult GetẸmployeeById(Guid employeeId)
		{
			try
			{
				if (employeeId == null)
				{
					var errorObject = new
					{
						userMsg = WebApplication1.Properties.Resources.EmployeeCodeRequried,
						errorCode = "misa-002",
						moreInfo = "https://openapi.misa.com.vn/errorcode/misa-001",
						traceId = "ba9587fd-1a79-4ac5-a0ca-2c9f74dfd3fb"
					};
					return StatusCode(404, errorObject);
				}
				//2. Khởi tạo đối tượng kết nối với database
				IDbConnection dbConnection = new MySqlConnection(connectionString);

				//3. Lấy dữ liệu
				var sqlCommand = $"SELECT * FROM Employee WHERE EmployeeId= @EmployeeIdParam";

				//De trach loi SQL Injection           
				DynamicParameters parameters = new DynamicParameters();

				parameters.Add("@EmployeeIdParam", employeeId);

				var employee = dbConnection.QueryFirstOrDefault<Employee>(sqlCommand, param: parameters);
				if (employee == null)
				{
					return StatusCode(204);
				}

				//4. Trả về cho client
				var response = StatusCode(200, employee);
				return response;

			}
			catch (Exception ex)
			{
				var errorObjec = new
				{
					devMsg = ex.Message,
					userMsg = WebApplication1.Properties.Resources.CommonError,
					errorCode = "misa-001",
					moreInfo = "https://openapi.misa.com.vn/errorcode/misa-001",
					traceId = "ba9587fd-1a79-4ac5-a0ca-2c9f74dfd3fb"

				};
				return StatusCode(500, errorObjec);
			}


		}

		/// <summary>
		/// API thêm mới 1 bản ghi nhân viên
		/// </summary>
		/// <param name="employee"></param>
		/// <returns></returns>
		[HttpPost]
		public IActionResult InsertEmployee(Employee employee)
		{
			try
			{
				// Kiểm tra EmployeeCode empty không
				if (employee.EmployeeCode == null || employee.EmployeeCode == "")
				{
					var errorObject = new
					{
						userMsg = WebApplication1.Properties.Resources.EmployeeCodeRequried,
						errorCode = "misa-003",
						moreInfo = "https://openapi.misa.com.vn/errorcode/misa-001",
						traceId = "ba9587fd-1a79-4ac5-a0ca-2c9f74dfd3fb"
					};


					return StatusCode(400, errorObject);
				}

				//Check email valid
				bool isEmail = System.Text.RegularExpressions.Regex.IsMatch(employee.Email, @"\A(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)\Z", RegexOptions.IgnoreCase);
				if (isEmail == false)
				{
					var objectError = new
					{
						devMsg = "CustomerEmail is not correct format",
						userMsg = WebApplication1.Properties.Resources.EmailInValid,
						errorCode = "misa-001",
						moreInfo = "https://openapi.misa.com.vn/errorcode/misa-001",
						traceId = "ba9587fd-1a79-4ac5-a0ca-2c9f74dfd3fb"

					};
					return StatusCode(400, objectError);
				}
				//2. Khởi tạo đối tượng kết nối với database
				IDbConnection dbConnection = new MySqlConnection(connectionString);

				//Khai báo dyanamicParam:
				var dyanamicParam = new DynamicParameters();

				//3. Thêm dữ liệu vào trong database
				var columnsName = string.Empty;

				var columnsParam = string.Empty;

				//Đọc từng property của object:
				var properties = employee.GetType().GetProperties();
				foreach (var prop in properties)
				{
					//Lấy tên của prop:
					var propName = prop.Name;

					//Lấy value của prop
					var propValue = prop.GetValue(employee);

					//Lấy kiểu dữ liệu của prop
					var propType = prop.PropertyType;

					//Thêm param tương ứng với mỗi property của đối tượng
					dyanamicParam.Add($"@{propName}", propValue);

					columnsName += $"{propName},";

					columnsParam += $"@{propName},";

				}

				columnsName = columnsName.Remove(columnsName.Length - 1, 1);

				columnsParam = columnsParam.Remove(columnsParam.Length - 1, 1);

				var sqlCommand = $"INSERT INTO Employee({columnsName}) VALUES({columnsParam})";

				var rowsEffects = dbConnection.Execute(sqlCommand, param: dyanamicParam);

				//4. Trả về cho client
				var response = StatusCode(200, rowsEffects);
				return response;
			}
			catch (Exception ex)
			{
				var errorObjec = new
				{
					devMsg = ex.Message,
					userMsg = WebApplication1.Properties.Resources.CommonError,
					errorCode = "misa-001",
					moreInfo = "https://openapi.misa.com.vn/errorcode/misa-001",
					traceId = "ba9587fd-1a79-4ac5-a0ca-2c9f74dfd3fb"

				};
				return StatusCode(500, errorObjec);
			}


		}

		/// <summary>
		/// Xóa nhân viên
		/// </summary>
		/// <param name="employeeId"></param>
		/// <returns></returns>
		[HttpDelete("{employeeId}")]
		public IActionResult DeleteEmployeeById(Guid employeeId)
		{
			try
			{
				IDbConnection dbConnection = new MySqlConnection(connectionString);

				//3. Lấy dữ liệu
				var sqlCommand = $"DELETE FROM Employee WHERE EmployeeId= @EmployeeIdParam";

				//De trach loi SQL Injection           
				DynamicParameters parameters = new DynamicParameters();

				parameters.Add("@EmployeeIdParam", employeeId);

				var employee = dbConnection.QueryFirstOrDefault<Employee>(sqlCommand, param: parameters);

				//4. Trả về cho client
				var response = StatusCode(200, employee);
				return response;
			}
			catch (Exception ex)
			{
				var errorObjec = new
				{
					devMsg = ex.Message,
					userMsg = WebApplication1.Properties.Resources.CommonError,
					errorCode = "misa-001",
					moreInfo = "https://openapi.misa.com.vn/errorcode/misa-001",
					traceId = "ba9587fd-1a79-4ac5-a0ca-2c9f74dfd3fb"

				};
				return StatusCode(500, errorObjec);
			}

		}

		/// <summary>
		/// Sửa 
		/// </summary>
		[HttpPut("{employeeId}")]
		public IActionResult UpdateEmployee(Guid employeeId, Employee employee)
		{

			try
			{
				// Kiểm tra EmployeeCode empty không
				if (employee.EmployeeCode == null || employee.EmployeeCode == "")
				{
					var errorObject = new
					{
						userMsg = WebApplication1.Properties.Resources.EmployeeCodeRequried,
						errorCode = "misa-003",
						moreInfo = "https://openapi.misa.com.vn/errorcode/misa-001",
						traceId = "ba9587fd-1a79-4ac5-a0ca-2c9f74dfd3fb"
					};


					return StatusCode(400, errorObject);
				}

				//Check email valid
				bool isEmail = System.Text.RegularExpressions.Regex.IsMatch(employee.Email, @"\A(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)\Z", RegexOptions.IgnoreCase);
				if (isEmail == false)
				{
					var objectError = new
					{
						devMsg = "CustomerEmail is not correct format",
						userMsg = WebApplication1.Properties.Resources.EmailInValid,
						errorCode = "misa-001",
						moreInfo = "https://openapi.misa.com.vn/errorcode/misa-001",
						traceId = "ba9587fd-1a79-4ac5-a0ca-2c9f74dfd3fb"

					};
					return StatusCode(400, objectError);
				}
				//2. Khởi tạo đối tượng kết nối với database
				IDbConnection dbConnection = new MySqlConnection(connectionString);

				//Khai báo dyanamicParam:
				var dyanamicParam = new DynamicParameters();

				//3. Thêm dữ liệu vào trong database
				var columnsUpadateParam = string.Empty;

				//Đọc từng property của object:         
				var properties = employee.GetType().GetProperties();

				foreach (var prop in properties)
				{
					//Lấy tên của prop:
					var propName = prop.Name;

					//Lấy value của prop
					var propValue = prop.GetValue(employee);

					//Lấy kiểu dữ liệu của prop
					var propType = prop.PropertyType;

					//Thêm param tương ứng với mỗi property của đối tượng
					dyanamicParam.Add($"@{propName}", propValue);

					columnsUpadateParam += $"{propName} = '@{ propName}' ,";

				}

				columnsUpadateParam = columnsUpadateParam.Remove(columnsUpadateParam.Length - 1, 1);

				var sqlCommand = $"UPDATE Employee SET {columnsUpadateParam} WHERE EmployeeId = @employeeId";
				dyanamicParam.Add("@employeeId", employeeId);

				var rowsEffects = dbConnection.Execute(sqlCommand, param: dyanamicParam);

				//4. Trả về cho client
				var response = StatusCode(200, rowsEffects);
				return response;
			}
			catch (Exception ex)
			{
				var errorObjec = new
				{
					devMsg = ex.Message,
					userMsg = WebApplication1.Properties.Resources.CommonError,
					errorCode = "misa-001",
					moreInfo = "https://openapi.misa.com.vn/errorcode/misa-001",
					traceId = "ba9587fd-1a79-4ac5-a0ca-2c9f74dfd3fb"

				};
				return StatusCode(500, errorObjec);
			}



		}

	}
}
