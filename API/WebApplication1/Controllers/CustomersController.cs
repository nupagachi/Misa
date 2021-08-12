using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MISA.CukCuk.Api.Model;
using MySqlConnector;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace MISA.CukCuk.Api.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class CustomersController : ControllerBase
	{
		//Truy cập vào database
		//1. Khởi tạo thông tin kết nối database
		public static string connectionString = "Host= 47.241.69.179;" +
				"Database = MISA.CukCuk_Demo_NVMANH;" +
				"User Id = dev;" +
				"Password = 12345678;";
		[HttpGet]
		public IActionResult GetCustomers()
		{
			try
			{
				//2. Khởi tạo đối tượng kết nối với database
				IDbConnection dbConnection = new MySqlConnection(connectionString);

				//3. Lấy dữ liệu
				var sqlCommand = "SELECT * FROM Customer";
				var customers = dbConnection.Query<object>(sqlCommand);

				if (customers.Count() == 0)
				{
					return StatusCode(204);
				}

				//4. Trả về cho client
				var response = StatusCode(200, customers);
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

		[HttpGet("{customerId}")]
		public IActionResult GetCustomerById(Guid customerId)
		{

			try
			{
				//2. Khởi tạo đối tượng kết nối với database
				IDbConnection dbConnection = new MySqlConnection(connectionString);

				//3. Lấy dữ liệu
				var sqlCommand = $"SELECT * FROM Customer WHERE CustomerId= @CustomerIdParam";

				//De trach loi SQL Injection           
				DynamicParameters parameters = new DynamicParameters();

				parameters.Add("@CustomerIdParam", customerId);

				var customer = dbConnection.QueryFirstOrDefault<Customer>(sqlCommand, param: parameters);
				if (customer == null)
				{
					return StatusCode(204);
				}
				//4. Trả về cho client
				var response = StatusCode(200, customer);
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
		/// API thêm mới 1 bản ghi nhân viên
		/// </summary>
		/// <param name="customer"></param>
		/// <returns></returns>
		[HttpPost]
		public IActionResult InsertCustomer(Customer customer)
		{

			try
			{

				// Kiểm tra EmployeeCode empty không
				if (customer.CustomerCode == null || customer.CustomerCode == "")
				{
					var errorObject = new
					{
						userMsg = WebApplication1.Properties.Resources.CustomerCodeRequried,
						errorCode = "misa-003",
						moreInfo = "https://openapi.misa.com.vn/errorcode/misa-001",
						traceId = "ba9587fd-1a79-4ac5-a0ca-2c9f74dfd3fb"
					};


					return StatusCode(400, errorObject);
				}

				//Check email valid
				bool isEmail = System.Text.RegularExpressions.Regex.IsMatch(customer.Email, @"\A(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)\Z", RegexOptions.IgnoreCase);
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
				var properties = customer.GetType().GetProperties();
				foreach (var prop in properties)
				{
					//Lấy tên của prop:
					var propName = prop.Name;

					//Lấy value của prop
					var propValue = prop.GetValue(customer);

					//Lấy kiểu dữ liệu của prop
					var propType = prop.PropertyType;

					//Thêm param tương ứng với mỗi property của đối tượng
					dyanamicParam.Add($"@{propName}", propValue);

					columnsName += $"{propName},";

					columnsParam += $"@{propName},";

				}

				columnsName = columnsName.Remove(columnsName.Length - 1, 1);

				columnsParam = columnsParam.Remove(columnsParam.Length - 1, 1);

				var sqlCommand = $"INSERT INTO Customer({columnsName}) VALUES({columnsParam})";

				var rowsEffects = dbConnection.Execute(sqlCommand, param: dyanamicParam);

				//4. Trả về cho client
				var response = StatusCode(200, rowsEffects);
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
		/// Sửa 
		/// </summary>
		[HttpPut("{customerId}")]
		public IActionResult UpdateCustomer(Guid customerId, Customer customer)
		{
			try
			{
				//2. Khởi tạo đối tượng kết nối với database
				IDbConnection dbConnection = new MySqlConnection(connectionString);

				//Khai báo dyanamicParam:
				var dyanamicParam = new DynamicParameters();

				//3. Thêm dữ liệu vào trong database
				var columnsUpadateParam = string.Empty;

				//Đọc từng property của object:         
				var properties = customer.GetType().GetProperties();
				foreach (var prop in properties)
				{
					//Lấy tên của prop:
					var propName = prop.Name;

					//Lấy value của prop
					var propValue = prop.GetValue(customer);

					//Lấy kiểu dữ liệu của prop
					var propType = prop.PropertyType;

					//Thêm param tương ứng với mỗi property của đối tượng
					dyanamicParam.Add($"@{propName}", propValue);

					columnsUpadateParam += $"{propName} = '@{ propName}' ,";

				}

				columnsUpadateParam = columnsUpadateParam.Remove(columnsUpadateParam.Length - 1, 1);

				var sqlCommand = $"UPDATE Customer SET {columnsUpadateParam} WHERE CustomerId = @customerId";
				dyanamicParam.Add("@customerId", customerId);

				var rowsEffects = dbConnection.Execute(sqlCommand, param: dyanamicParam);

				//4. Trả về cho client
				var response = StatusCode(200, rowsEffects);
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
		/// Xóa nhân viên
		/// </summary>
		/// <param name="customerId"></param>
		/// <returns></returns>
		[HttpDelete("{customerId}")]
		public IActionResult DeleteCustomerById(Guid customerId)
		{
			try
			{
				//2. Khởi tạo đối tượng kết nối với database
				IDbConnection dbConnection = new MySqlConnection(connectionString);

				//3. Lấy dữ liệu
				var sqlCommand = $"DELETE FROM Customer WHERE CustomerId= @CustomerIdParam";

				//De trach loi SQL Injection           
				DynamicParameters parameters = new DynamicParameters();

				parameters.Add("@CustomerIdParam", customerId);

				var customer = dbConnection.QueryFirstOrDefault<Customer>(sqlCommand, param: parameters);

				//4. Trả về cho client
				var response = StatusCode(200, customer);
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
	}
}
