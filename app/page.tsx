// ==========================================
//  【設定】 スプレッドシートID
// ==========================================
const SPREADSHEET_ID = '1ODNxgIzsX5jcRIWjodXO8eGaTFTIZlKClSMGcy_von4';

// ==========================================
//  1. Web API機能 (GET)
// ==========================================
function doGet(e) {
  const action = e.parameter.action;
  const result = {};
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  if (action === 'get_market_price') {
    const sheet = ss.getSheetByName('WireMaster_DB - Config') || ss.getSheetByName('Config');
    if (sheet) {
      const data = sheet.getDataRange().getValues();
      for (let i = 0; i < data.length; i++) {
        if (data[i][0] === 'market_price') {
          result.price = Number(data[i][1]);
          break;
        }
      }
    }
  } else if (action === 'get_products') {
    const sheet = ss.getSheetByName('WireMaster_DB - Products') || ss.getSheetByName('Products');
    if (sheet) {
      const data = sheet.getDataRange().getValues();
      const products = [];
      for (let i = 1; i < data.length; i++) {
        if (!data[i][0]) continue;
        products.push({
          id: data[i][0], maker: data[i][1], name: data[i][2], sq: data[i][3],
          core: data[i][4], ratio: Number(data[i][5]), category: data[i][6], image: data[i][7]
        });
      }
      result.products = products;
    }
  } else if (action === 'login') {
    const sheet = ss.getSheetByName('WireMaster_DB - Clients') || ss.getSheetByName('Clients');
    if (sheet) {
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][5]) === String(e.parameter.id) && String(data[i][6]) === String(e.parameter.pw)) {
          result.success = true;
          result.user = { id: data[i][5], name: data[i][1], rank: data[i][2] };
          break;
        }
      }
    }
  } else if (action === 'get_crm_data') {
    const sheet = ss.getSheetByName('WireMaster_DB - CRM') || ss.getSheetByName('CRM');
    if (sheet) {
      const data = sheet.getDataRange().getValues();
      const targets = [];
      for (let i = 1; i < data.length; i++) {
        if (!data[i][1]) continue;
        targets.push({ id: data[i][0], name: data[i][1], address: data[i][2], category: data[i][3], priority: data[i][4], memo: data[i][5] });
      }
      result.targets = targets;
    }
  }
  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

// ==========================================
//  2. Web API機能 (POST)
// ==========================================
function doPost(e) {
  const params = JSON.parse(e.postData.contents);
  let result = {};

  if (params.action === 'analyze_image') {
    result = analyzeImageWithGemini(params.image);
  } else if (params.action === 'update_product') {
    result = updateProductData(params);
  } else if (params.action === 'create_invoice') {
    // ★追加: PDF発行アクション
    result = createInvoicePDF(params);
  }

  return ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON);
}

// ------------------------------------------
//  PDF生成ロジック (HTML -> PDF)
// ------------------------------------------
function createInvoicePDF(data) {
  try {
    const { cart, total, weight, user } = data;
    const dateStr = Utilities.formatDate(new Date(), "JST", "yyyy年MM月dd日 HH:mm");
    const docId = "INV-" + new Date().getTime();

    // 帳票HTMLの構築
    let html = `
      <html>
        <head>
          <style>
            body { font-family: 'MSGothic', sans-serif; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; margin: 10px; }
            .meta { display: flex; justify-content: space-between; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th { border-bottom: 1px solid #333; text-align: left; padding: 5px; background-color: #eee; }
            td { border-bottom: 1px solid #ccc; padding: 5px; }
            .total-area { text-align: right; font-size: 18px; font-weight: bold; margin-top: 20px; }
            .footer { margin-top: 50px; font-size: 12px; text-align: center; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">廃電線 買取明細書</div>
            <div>株式会社 月寒製作所 苫小牧工場</div>
          </div>
          <div class="meta">
            <div>取引日時: ${dateStr}<br>取引ID: ${docId}</div>
            <div style="text-align:right">
              様: ${user ? user.name : '上様'} <br>
              担当: システム自動発行
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>品目名</th>
                <th>重量(kg)</th>
                <th>単価(円)</th>
                <th>小計(円)</th>
              </tr>
            </thead>
            <tbody>
    `;

    cart.forEach(item => {
      html += `
        <tr>
          <td>${item.name}</td>
          <td>${item.weight}</td>
          <td>${item.unit.toLocaleString()}</td>
          <td>${item.subtotal.toLocaleString()}</td>
        </tr>
      `;
    });

    html += `
            </tbody>
          </table>
          <div class="total-area">
            <div>総重量: ${weight} kg</div>
            <div style="font-size: 28px; border-bottom: 4px double #333; display:inline-block;">買取総額: ¥${total.toLocaleString()}</div>
          </div>
          <div class="footer">
            <p>※本明細書は電子的に発行されました。</p>
            <p>北海道苫小牧市勇払123-4 / TEL: 0144-XX-XXXX</p>
          </div>
        </body>
      </html>
    `;

    // PDF化処理
    const blob = Utilities.newBlob(html, MimeType.HTML).getAs(MimeType.PDF).setName(`買取明細_${docId}.pdf`);
    
    // 一時フォルダへ保存（ルートディレクトリ）
    // ※実運用では専用フォルダIDを指定推奨
    const file = DriveApp.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    
    // 1時間後に消すトリガーなどを入れても良いが、今回はURLを返すだけ
    return { success: true, url: file.getDownloadUrl() };

  } catch (e) {
    return { success: false, error: e.toString() };
  }
}

// ------------------------------------------
//  Gemini連携ロジック
// ------------------------------------------
function analyzeImageWithGemini(base64Image) {
  const apiKey = PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");
  if (!apiKey) return { error: "API Key not set" };
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  const promptText = `あなたは廃電線スクラップの専門家です。画像を分析しJSONのみ出力:{ "category": "選択肢...", "copper_ratio_estimate": 45, "confidence": 0.9, "reasoning": "..." }`;
  const payload = { contents: [{ parts: [{ text: promptText }, { inline_data: { mime_type: "image/jpeg", data: base64Image } }] }] };
  try {
    const response = UrlFetchApp.fetch(url, { method: "post", contentType: "application/json", payload: JSON.stringify(payload), muteHttpExceptions: true });
    const json = JSON.parse(response.getContentText());
    let rawText = json.candidates[0].content.parts[0].text;
    return JSON.parse(rawText.replace(/```json/g, "").replace(/```/g, "").trim());
  } catch (e) { return { error: e.toString() }; }
}

// ------------------------------------------
//  データ更新ロジック
// ------------------------------------------
function updateProductData(data) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  const sheet = ss.getSheetByName('WireMaster_DB - Products') || ss.getSheetByName('Products');
  if (!sheet) return { success: false, message: "Sheet not found" };
  const values = sheet.getDataRange().getValues();
  let rowIndex = -1;
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(data.productId)) { rowIndex = i + 1; break; }
  }
  if (rowIndex === -1) return { success: false, message: "ID Not Found" };
  if (data.ratio) sheet.getRange(rowIndex, 6).setValue(data.ratio);
  if (data.imageBase64) {
    const fileName = `${data.productId}_${new Date().getTime()}.jpg`;
    const blob = Utilities.newBlob(Utilities.base64Decode(data.imageBase64), MimeType.JPEG, fileName);
    const file = DriveApp.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    sheet.getRange(rowIndex, 8).setValue(file.getDownloadUrl());
    return { success: true, newImageUrl: file.getDownloadUrl() };
  }
  return { success: true };
}

// ------------------------------------------
//  スクレイピング & 救出 (維持)
// ------------------------------------------
function importCRMData() { /* 省略（以前のコードを維持してください。長くなるので割愛しますが、消さないで！） */ }
function updateCopperPriceFromJX() { /* 省略（以前のコードを維持） */ }
