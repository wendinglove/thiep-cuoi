# Bật xác nhận tham dự và lời chúc vào Google Sheets

Làm sau khi thiệp đã chạy trên GitHub Pages. Cần đăng nhập tài khoản Google sở hữu hoặc có quyền chỉnh sửa bảng. Gói này chưa triển khai hoặc cấp quyền thay bạn.

## 1. Chọn bảng nhận phản hồi

Bảng đã được chuẩn bị trong cuộc trò chuyện:

[Thiệp cưới – Xác nhận tham dự và lời chúc](https://docs.google.com/spreadsheets/d/1rU30d1yL23KApbk9wefSgbN1Y-a1a772KuaLh6KVcj0/edit)

Nếu tài khoản của bạn không mở được bảng đó, bạn có thể tạo một bảng Google Sheets mới. Sao chép ID giữa `/d/` và `/edit` trong URL, rồi thay giá trị `SPREADSHEET_ID` ở đầu `Code.gs`. Không cần chia sẻ bảng tính quyền chỉnh sửa cho mọi người.

Tab dữ liệu tên **Phản hồi**, có đúng 5 tiêu đề:

| A | B | C | D | E |
| --- | --- | --- | --- | --- |
| Thời gian gửi | Tên khách | Xác nhận tham dự | Lời chúc | Mã phản hồi |

## 2. Tạo bộ nhận cho GitHub Pages

1. Trong Google Sheets, chọn **Extensions / Tiện ích mở rộng → Apps Script** để tạo/mở dự án thuộc bảng. Nếu dự án đã chứa bộ nhận của bản Sites cũ, hãy tạo một dự án Apps Script mới riêng cho GitHub Pages để không thay đổi bộ nhận cũ.
2. Đặt tên dự án ví dụ **Thiệp cưới – GitHub Pages**.
3. Mở tệp `google-sheets/Code.gs` trong gói bằng Notepad, sao chép toàn bộ mã, dán vào tệp `Code.gs` trong Apps Script thay mã mẫu, rồi **Save**.
4. Kiểm tra lại `SPREADSHEET_ID` là ID đúng bảng của bạn.
5. Chọn hàm **setupWeddingSheet** trên thanh công cụ → **Run / Chạy**. Google yêu cầu bạn xem và cấp quyền truy cập bảng cho chính dự án này. Hàm chuẩn bị tiêu đề/định dạng, không xóa dữ liệu đã có. Chỉ tiếp tục nếu bạn nhận diện đúng dự án và các quyền đang được yêu cầu; nếu tổ chức hạn chế triển khai thì cần quản trị viên cho phép.
6. Chọn **Deploy → New deployment → Select type → Web app**.
7. **Execute as: Me** (chạy bằng tài khoản sở hữu/quyền chỉnh sửa bảng).
8. **Who has access: Anyone** (khách không cần đăng nhập Google). Nếu tài khoản công ty không cho phép lựa chọn này, dùng tài khoản/bảng riêng phù hợp hoặc hỏi quản trị viên; không chọn chỉ người trong tổ chức vì khách ngoài sẽ không gửi được.
9. Bấm **Deploy**, hoàn tất bước cấp quyền Google nếu có. Sao chép **Web app URL** kết thúc bằng **`/exec`**. Không dùng URL `/dev`.

Đây là bộ nhận **công khai dành riêng cho bản GitHub Pages**. Đường dẫn `/exec` được đưa vào mã phía khách để nhận phản hồi và đọc lời chúc công khai; không dùng địa chỉ bộ nhận riêng của bản Sites cũ. Không cần mật khẩu, token GitHub hoặc API key trong cấu hình.

## 3. Gắn địa chỉ bộ nhận vào thiệp

1. Mở `ket-noi-google.js` trên GitHub → biểu tượng bút chì.
2. Điền URL vừa sao chép vào giữa dấu ngoặc kép của `googleSheetsUrl`, ví dụ cấu trúc:

```js
window.WEDDING_CONNECTION = {
  googleSheetsUrl: "https://script.google.com/macros/s/MA_TRIEN_KHAI_CUA_BAN/exec"
};
```

3. **Commit changes** lên nhánh `main`, chờ GitHub Pages triển khai bản mới.
4. Mở link thiệp chính, nhấn **Ctrl + F5**. Nút gửi phản hồi sẽ được mở khi URL có đúng định dạng.

## 4. Kiểm tra một lần trước khi gửi thiệp

1. Dùng cửa sổ ẩn danh mở **link GitHub Pages**, không dùng tệp HTML mở trực tiếp từ máy.
2. Nhập tên **Kiểm tra kết nối**, lựa chọn **Gửi lời chúc**, nội dung **Kiểm tra trước khi phát hành thiệp** và gửi.
3. Kiểm tra Google Sheets có một dòng mới, ngày giờ đúng giờ Việt Nam, tên/lựa chọn/nội dung/mã phản hồi đủ 5 cột.
4. Thiệp chỉ báo đã lưu sau khi kiểm tra mã phản hồi tồn tại trong bảng. Phản hồi mạng không đọc được không được coi là đã lưu.
5. Tải lại thiệp và kiểm tra lời chúc vừa gửi xuất hiện trong sổ lời chúc.
6. Xóa dòng kiểm tra trong Google Sheets sau khi xác nhận kết nối hoạt động.

Nếu mạng ngắt sau khi Google đã ghi, bấm gửi lại trên cùng trang sẽ dùng lại mã phản hồi và không tạo dòng trùng. Hạn chế gửi liên tiếp 15 giây theo mã trình duyệt giúp tránh bấm lặp; đây không phải một hệ thống chống thư rác có xác thực tài khoản.

## Những gì xuất hiện trên thiệp

Chỉ tên khách, lựa chọn tham dự, lời chúc và thời gian của **12 phản hồi mới nhất** được đọc để hiển thị trên thiệp; số lượng tổng phản hồi cũng được hiển thị. Các trường này có thông báo công khai ngay trên biểu mẫu. Bộ nhận không có chức năng công khai đọc toàn bộ bảng tính, sửa/xóa dòng hoặc đọc các tab khác. Không đặt dữ liệu riêng tư vào tab Phản hồi hoặc nhập vào lời chúc.

## Khi sửa Code.gs về sau

Sau khi sửa mã, vào **Deploy → Manage deployments → Edit → Version: New version → Deploy** để cập nhật chính deployment đó; URL `/exec` có thể giữ nguyên. Nếu tạo deployment mới có URL khác, hãy sửa lại `ket-noi-google.js` trên GitHub.

Tài liệu: [Google Apps Script Web apps](https://developers.google.com/apps-script/guides/web), [Content Service/JSONP](https://developers.google.com/apps-script/guides/content).
