# Thiệp cưới hoa sen — bản dành cho GitHub Pages

Bản HTML/CSS/JavaScript có sẵn nhạc “Ngày về anh cưới em”, hoa sen đung đưa, nước chảy, mây trôi và hiệu ứng ảnh/thời gian. Có phần tự chỉnh thông tin, ảnh, phông và cỡ chữ. Không cần cài Node.js hoặc chạy lệnh build.

**Gói này chưa có ảnh cưới riêng và thông tin ngày cưới của hai bạn. Bạn tự điền theo phần 2. Xác nhận tham dự/lời chúc chỉ hoạt động sau khi bật Google Sheets theo phần 4; khi chưa bật, thiệp hiển thị thông báo rõ ràng và không báo gửi thành công giả.**

## 1. Đưa thiệp lên GitHub bằng trình duyệt

1. Tải ZIP, bấm chuột phải → **Extract All / Giải nén tất cả**. Mở thư mục vừa giải nén, bạn phải thấy `index.html`, `assets`, `cau-hinh-thiep.js`…
2. Đăng nhập GitHub → dấu **+ → New repository**. Đặt tên ví dụ `thiep-cuoi`, chọn **Public**, bấm **Create repository**. Bản GitHub Free hỗ trợ Pages cho kho công khai.
3. Chọn **uploading an existing file**, hoặc **Add file → Upload files** nếu kho đã có tệp.
4. Kéo **toàn bộ tệp và thư mục bên trong thư mục đã giải nén** vào GitHub. Không tải nguyên ZIP lên và không bọc thêm một thư mục cha. Bấm **Commit changes** để lưu lên nhánh `main`.
5. Kiểm tra: `index.html` phải nằm ở ngay màn hình đầu của kho, cùng cấp với `assets` và `cau-hinh-thiep.js`.
6. Vào **Settings → Pages**. Trong **Build and deployment**, chọn **Source: Deploy from a branch**, **Branch: main**, **Folder: /(root)** → **Save**.
7. Chờ quá trình triển khai hoàn tất. Vào lại **Settings → Pages → Visit site** để lấy link thiệp. Thay đổi có thể cần tới khoảng 10 phút để xuất hiện.

Từ lần sau, mỗi lần bạn lưu thay đổi lên nhánh/thư mục xuất bản này, GitHub Pages sẽ triển khai bản mới. Không cần đóng ZIP lại.

## 2. Tự sửa tên, ngày, nội dung, kiểu chữ — không cần viết mã

1. Mở link thiệp → **Sửa thông tin thiệp** ở bìa, hoặc **Cá nhân hóa thiệp** sau khi mở.
2. Điền tên cô dâu/chú rể, ngày giờ, địa điểm, câu chuyện. Chọn kiểu chữ và kéo cỡ chữ riêng cho tên, tiêu đề và nội dung.
   Với link chính gửi chung cho mọi người, để trống “Tên khách được mời” để thiệp hiện “Quý khách”.
3. **Lưu & xem thiệp** lưu bản xem trên trình duyệt hiện tại.
4. Khi vừa ý, mở phần chỉnh sửa → **Tải cấu hình để cập nhật GitHub**. Trình duyệt tải tệp `cau-hinh-thiep.js`.
5. Về kho GitHub, **Add file → Upload files**, đưa tệp `cau-hinh-thiep.js` vừa tải vào **thư mục gốc**, thay tệp cũ, rồi **Commit changes**.
6. Chờ Pages cập nhật. Khách mở link chính sẽ thấy cùng một bản thiệp mới. Nếu máy bạn còn hiện bản cũ, nhấn **Ctrl + F5**.

Bạn cũng có thể mở `cau-hinh-thiep.js` ngay trên GitHub, bấm biểu tượng bút chì và sửa các giá trị nằm trong dấu ngoặc kép; đã có chú thích tiếng Việt cho từng mục.

**Hai loại đường dẫn:**

- **Link chính từ Visit site**, không có `#i=…`: lấy nội dung đang lưu trên GitHub, phù hợp để bạn tiếp tục cập nhật sau này.
- **Sao chép đường dẫn** trong phần chỉnh sửa: chứa một bản chụp nội dung và kiểu chữ tại lúc sao chép, dùng cho lời mời riêng/tên khách riêng. Link có `#i=…` không tự lấy nội dung mới từ GitHub; hãy sao chép lại nếu thay đổi thông tin cưới.

## 3. Tự thêm/thay ảnh trên GitHub

1. Đặt tên ảnh dễ nhớ, không dấu, ví dụ `anh-bia.jpg`, `co-dau.jpg`, `chu-re.jpg`, `anh-1.jpg`… Nên nén ảnh còn khoảng 200–700 KB/ảnh để mở nhanh; giữ đúng đuôi ảnh thực tế.
2. Vào thư mục **assets → photos** trong GitHub → **Add file → Upload files** → tải ảnh → **Commit changes**.
3. Trong phần chỉnh sửa thiệp, điền đường dẫn tương ứng:

| Vị trí trên thiệp | Ví dụ đường dẫn |
| --- | --- |
| Ảnh bìa | `./assets/photos/anh-bia.jpg` |
| Chân dung cô dâu | `./assets/photos/co-dau.jpg` |
| Chân dung chú rể | `./assets/photos/chu-re.jpg` |
| Album, ảnh thứ nhất | `./assets/photos/anh-1.jpg` |
| Album, ảnh thứ sáu | `./assets/photos/anh-6.jpg` |

4. Xem thử → **Tải cấu hình để cập nhật GitHub** → tải `cau-hinh-thiep.js` lên thư mục gốc như phần 2.

Nếu thay ảnh và giữ nguyên **tên + thư mục + đuôi ảnh**, đường dẫn không cần đổi. Nếu đổi tên/đuôi thì cập nhật lại đường dẫn. GitHub phân biệt chữ hoa/thường: `Anh-Bia.JPG` khác `anh-bia.jpg`. Link HTTPS trực tiếp tới ảnh cũng được hỗ trợ; link trang chia sẻ Google Drive thường không phải link ảnh trực tiếp.

## 4. Bật Google Sheets cho xác nhận tham dự và lời chúc

GitHub Pages chỉ phục vụ tệp tĩnh. Gói này có bộ nhận Google Apps Script riêng, dùng Google Sheets làm nơi lưu phản hồi và đọc 12 lời chúc mới nhất để hiển thị trên thiệp.

Mở **[hướng dẫn bật Google Sheets](google-sheets/HUONG-DAN.md)** và làm một lần. Các tệp cần dùng:

- `google-sheets/Code.gs`: dán vào một dự án Google Apps Script mới, triển khai dưới tài khoản sở hữu bảng.
- `ket-noi-google.js`: sau khi triển khai, điền URL Web app kết thúc bằng `/exec`, rồi lưu tệp này lên GitHub.

**Gói chưa có URL Web app đã kích hoạt và chưa được kiểm tra ghi thật vào Google Sheets.** Chỉ coi kết nối hoàn tất sau khi gửi thử từ link GitHub Pages, thấy đúng dòng trong bảng và thiệp báo đã lưu. Tên, lựa chọn tham dự, lời chúc sẽ được hiển thị công khai trên thiệp theo thông báo ngay trên biểu mẫu; không nhập thông tin riêng tư vào lời chúc.

## 5. Nếu gặp lỗi

| Hiện tượng | Cách kiểm tra |
| --- | --- |
| Pages báo 404 | Chắc chắn có `index.html` ở thư mục gốc; Pages chọn `main` và `/(root)`; xem mục Actions để biết triển khai đã xong chưa. |
| Thiếu ảnh/mất nền hoặc nhạc | Tải đủ thư mục `assets`; không đổi các đường dẫn thành `/assets/…` vì kho dự án có thêm tên kho trong URL. |
| Chỉnh trên thiệp nhưng khách vẫn thấy cũ | Dùng nút tải cấu hình rồi lưu `cau-hinh-thiep.js` lên GitHub; chỉ bấm Lưu & xem chưa cập nhật tệp trên GitHub. |
| Ảnh vẫn là bản cũ | Chờ Pages triển khai, nhấn Ctrl + F5; có thể thêm `?v=2` cuối đường dẫn ảnh trong cấu hình. |
| Không có nhạc ngay khi vừa tải trang | Trình duyệt có thể chặn âm thanh tự phát. Chạm mở thiệp hoặc bấm Bật nhạc. |
| Không gửi được xác nhận/lời chúc | Làm phần Google Sheets. Không dùng URL `/dev` hoặc giới hạn truy cập chỉ người đã đăng nhập. |
| Google báo không có quyền | Đăng nhập tài khoản sở hữu/quyền chỉnh sửa bảng; có thể tạo bảng riêng và sửa SPREADSHEET_ID trong Code.gs. |

Bạn có thể dùng tên miền `nguyenthienit.site` sau khi link GitHub Pages hoạt động. Gói không gắn sẵn tên miền để bạn có thể chạy thử trước khi đổi DNS tại Tenten.

## Tài liệu chính thức

- [Tải tệp lên kho GitHub](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)
- [Chọn nhánh và thư mục xuất bản Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [Tạo website GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site)
- [Triển khai Google Apps Script Web app](https://developers.google.com/apps-script/guides/web)
- [Google Content Service và JSONP chỉ đọc](https://developers.google.com/apps-script/guides/content)
