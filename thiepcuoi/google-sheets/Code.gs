// DÀNH RIÊNG CHO BẢN GITHUB PAGES: nhận POST, đọc lời chúc công khai bằng JSONP.
// Triển khai Web app: Execute as = Me; Who has access = Anyone.
// Bảng tính không cần chia sẻ quyền chỉnh sửa công khai.
const SPREADSHEET_ID = '1rU30d1yL23KApbk9wefSgbN1Y-a1a772KuaLh6KVcj0';
const SHEET_NAME = 'Phản hồi';
const HEADERS = ['Thời gian gửi', 'Tên khách', 'Xác nhận tham dự', 'Lời chúc', 'Mã phản hồi'];
const MAX_ROWS = 25000;
const VALID_ID = /^[a-zA-Z0-9-]{16,80}$/;

// Chạy thủ công một lần trong Apps Script để cấp quyền và chuẩn bị tiêu đề.
// Không xóa hoặc thay thế dữ liệu đã có.
function setupWeddingSheet() {
  const book = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = book.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) sheet.getRange(1, 1, 1, 5).setValues([HEADERS]);
  if (sheet.getRange(1, 1, 1, 5).getValues()[0].join('|') !== HEADERS.join('|')) throw new Error('Tiêu đề cột không đúng. Kiểm tra lại tab Phản hồi.');
  book.setSpreadsheetTimeZone('Asia/Ho_Chi_Minh');
  sheet.setFrozenRows(1);
  sheet.getRange(1, 1, 1, 5).setFontWeight('bold').setBackground('#f2eee6');
  sheet.setColumnWidth(1, 170);sheet.setColumnWidth(2, 180);sheet.setColumnWidth(3, 180);sheet.setColumnWidth(4, 420);sheet.setColumnWidth(5, 280);
}

function doGet(event) {
  const params = event && event.parameter || {};
  let result;
  try {
    if (params.action === 'list') {
      const sheet = readSheet_(), last = sheet.getLastRow();
      const count = Math.min(12, Math.max(0, last - 1));
      const rows = count ? sheet.getRange(last - count + 1, 1, count, 5).getValues().reverse() : [];
      result = {ok:true,total:Math.max(0,last-1),items:rows.map(row => ({
        createdAt:row[0] instanceof Date ? row[0].getTime() : new Date(row[0]).getTime(),
        name:String(row[1]),message:String(row[3]),
        attendance:row[2] === 'Sẽ tham dự' ? 'yes' : row[2] === 'Không tham dự' ? 'no' : 'wish',
      }))};
    } else if (params.action === 'status' && VALID_ID.test(String(params.id || ''))) {
      // Verify the row itself before considering a cached error or timeout.
      const exists = hasId_(readSheet_(), params.id);
      const failure = CacheService.getScriptCache().get('error:' + params.id);
      result = {ok:true,saved:exists,error:exists ? null : failure || null};
    } else if (!params.action) result = {ok:true,service:'wedding-github-pages',ready:!!readSheet_()};
    else result = {ok:false,error:'invalid_request'};
  } catch (_) { result = {ok:false,error:'read_failed'}; }
  return output_(result, params.callback);
}

function doPost(event) {
  let item;
  try {
    const raw = event && event.postData && event.postData.contents;
    if (!raw || raw.length > 8000) throw new Error('body');
    item = JSON.parse(raw);
    if (!item || !VALID_ID.test(String(item.submissionId || '')) || !VALID_ID.test(String(item.guestId || '')) ||
        typeof item.name !== 'string' || !item.name.trim() || item.name.length > 80 ||
        typeof item.message !== 'string' || item.message.length > 1200 ||
        !['yes','no','wish'].includes(item.attendance) || (item.attendance === 'wish' && !item.message.trim())) throw new Error('fields');
  } catch (_) { return failure_(item, 'invalid_request'); }

  const lock = LockService.getScriptLock();
  if (!lock.tryLock(8000)) return failure_(item, 'busy');
  try {
    const sheet = readSheet_(), cache = CacheService.getScriptCache();
    if (hasId_(sheet, item.submissionId)) {cache.remove('error:' + item.submissionId);return output_({ok:true,saved:true});}
    if (cache.get('guest:' + item.guestId)) return failure_(item, 'rate_limited');
    const last = sheet.getLastRow();
    if (last >= MAX_ROWS) return failure_(item, 'capacity');
    if (last + 1 > sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(), 100);
    sheet.getRange(last + 1, 1, 1, 5).setValues([[
      new Date(),safeText_(item.name.trim()),{yes:'Sẽ tham dự',no:'Không tham dự',wish:'Chỉ gửi lời chúc'}[item.attendance],
      safeText_(item.message.trim()),item.submissionId,
    ]]);
    sheet.getRange(last + 1, 1).setNumberFormat('dd/MM/yyyy HH:mm');
    sheet.getRange(last + 1, 2, 1, 3).setWrap(true);
    SpreadsheetApp.flush();
    cache.put('guest:' + item.guestId, '1', 15);
    cache.remove('error:' + item.submissionId);
    return output_({ok:true,saved:true});
  } catch (_) { return failure_(item, 'write_failed'); }
  finally { lock.releaseLock(); }
}

function readSheet_() {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
  if (!sheet || sheet.getRange(1,1,1,5).getValues()[0].join('|') !== HEADERS.join('|')) throw new Error('headers');
  if (sheet.getLastRow() > MAX_ROWS) throw new Error('capacity');
  return sheet;
}
function hasId_(sheet, id) {
  const last = sheet.getLastRow();
  return last > 1 && sheet.getRange(2,5,last-1,1).getDisplayValues().some(row => row[0] === id);
}
function safeText_(value) {return /^[=+\-@\t\r]/.test(value) ? "'" + value : value;}
function failure_(item, error) {
  try {if (item && VALID_ID.test(String(item.submissionId || ''))) CacheService.getScriptCache().put('error:' + item.submissionId, error, 120);} catch (_) {}
  return output_({ok:false,error:error});
}
function output_(result, callback) {
  const json = JSON.stringify(result).replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
  if (callback && /^__wedding_jsonp_\d+_\d+$/.test(callback)) {
    return ContentService.createTextOutput(callback + '(' + json + ');').setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  // Invalid callback strings are never executable. GET is read-only.
  return ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}
