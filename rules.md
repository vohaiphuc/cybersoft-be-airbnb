# Quy tắc chung khi làm việc với controller và service:

**Controller**

- Làm api route
- Xử lý middleware (guard, filter, file upload)
- Validate input (pipe)

**Service**

- Xử lý business logic
- Trả về kết quả trong database
- Throw lỗi

**Lưu ý**

- Xử lý lỗi / kết quả: viết trong service, không viết trong controller

# Đặt tên

**Tất cả file đặt tên bằng tiếng Anh, theo cú pháp như sau:**
<br>[Tên file].[Thư mục / loại file].ts

Tên file:

- Bỏ dấu [ ] khi sử dụng
- Nếu 2 từ: cách nhau bởi "-" (vd: http-exception)

Thư mục / loại file:

- Bỏ dấu [ ] khi sử dụng
- Thư mục chứa file đó
- Loại file: controller / module / service

Lưu ý: với các file ko thể đặt theo cú pháp này, hãy đặt tên có ý nghĩa (nhìn vào tên ít nhất có thể đoán được nó có tác dụng gì)

# Sắp xếp decorator (trong controller) theo thứ tự

1. HTTP method + Route (vd: @Get("user") )
2. (optional) Mô tả swagger: @ApiOperation({ summary: "Viết mô tả ở đây" })
3. Middleware / Metadata:

- 3a.
  - ApiBearerAuth
  - @UseGuards
  - @UseFilters
  - @UsePipes
- 3b.
  - @UseInterceptor
  - @ApiConsumes

4. Handle request:
   4a.
   - @ApiBody

Controller method

# Viết mô tả swagger

[LÀM GÌ]: nội dung

- VD:
  - LẤY: danh sách tất cả phòng
  - CẬP NHẬT: ảnh đại diện của người dùng

LÀM GÌ:

- Dùng tiếng Việt
- VIẾT HOA
- Sử dụng động từ: vd: LẤY / ĐĂNG / XÓA / CẬP NHẬT

nội dung:

- Dùng tiếng Việt
- viết thường
- Mục đích của API này

# Viết body swagger (để hiện input)

Các bước gán type vào body (để swagger hiện input field)

1. **Tạo type**

- Thư mục dto trong mỗi module là thư mục chứa các type
- Tham khảo:
  https://github.com/vohaiphuc/pinterest-be/blob/main/src/modules/user/dto/update-user.dto.ts

2. **Dùng decorator ApiBody**

- @ApiBody({type: UpdateUserDto})

# Dùng biến chung /common

1. **src\common\const\message.const.ts**

- Quản lý danh sách các thông báo trả về

2. **src\common\util\response.utils.ts**

- Định dạnh chuẩn cho các response (bao gồm: statusCode, message, content, timestamp)

# Sử dụng filter / Xử lý lỗi trả về

Một số lưu ý:

1. **Lỗi mạc định**

Trong NestJs, nếu http request gặp lỗi thì nó sẽ tự động throw lỗi mạc định:
{
"statusCode": 500,
"message": "Internal server error"
}
Cho nên không cần làm theo giảng viên là viết if else statusCode !== 500 ...

2. **try...catch...**

- Việc sử dụng cú pháp try...catch... liên tục trong các controller method sẽ gây lặp lại không cần thiết. Với 10 api trong 1 controller sẽ tạo ra "Try Catch Tower" (giống Callback Hell)
- Trong NestJs, với những thao tác lặp đi lặp lại, có thể gộp chúng vào 1 decorator (thậm chí có thể gộp nhiều decorator vào 1 decorator)
- Trong trường hợp này, decorator @UseFilters với filter tên là HttpExceptionFilter - nhận nhiệm vụ xử lý các exception (lỗi) xảy ra trong quá trình gọi API
- src\filters\http-exception.fitler.ts (copy từ NestJs document)

Tham khảo:
https://github.com/vohaiphuc/pinterest-be/blob/main/src/modules/user/user.controller.ts

- Trong file này, @UseFilters được để cùng cấp với @Controller. Các controller khác đều được viết tương tự
- Không để @UseFilters ở cấp global, vì trong quá trình code, nếu muốn test try...catch... ở 1 api, thì chỉ cần comment @UseFilters ở controller hiện tại, và viết try...catch... ở api, việc này sẽ giúp hạn chế chỉnh sửa trực tiếp vào file global => hạn chế lỗi khi merge

## Xử lý lỗi / kết quả

- Với lỗi:
  - throw new HttpException()
- Với kết quả:
  - return ResponseData()

**Lưu ý: Xử lý lỗi / kết quả đều phải được viết trong service, không viết trong controller**

# Hướng dẫn sử dụng useGuard

_Đang cập nhật (khi nào viết xong JWT thì Phúc sẽ phổ biến sau)_
