// // Code.gs
// function doGet() {
//   var html = HtmlService.createTemplateFromFile("index");
//   var evaluated = html.evaluate();
//   evaluated.addMetaTag("viewport", "width=device-width, initial-scale=1");
//   return evaluated
//     .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
//     .setTitle("Essential Links – Glass Edition");
// }

// function include(filename) {
//   return HtmlService.createHtmlOutputFromFile(filename).getContent();
// }

// function getSpreadsheet() {
//   return SpreadsheetApp.getActiveSpreadsheet();
// }

// function getLinksFromSheet() {
//   try {
//     var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Links");
//     if (!sheet) {
//       return JSON.stringify({ error: "Sheet 'Links' not found" });
//     }
    
//     var data = sheet.getDataRange().getValues();
//     var links = [];
//     var credentials = [];
    
//     // Start from row 2 (skip header row)
//     for (var i = 1; i < data.length; i++) {
//       var row = data[i];
//       // Check if URL exists in column A
//       if (row[0] && row[0].toString().trim() !== "") {
//         var url = row[0].toString().trim();
//         var group = (row[1] && row[1].toString().trim()) || "General";
//         var tags = [];
        
//         // Get tags from column C
//         if (row[2] && row[2].toString().trim() !== "") {
//           tags = row[2].toString().split(',').map(function(tag) {
//             return tag.trim();
//           });
//         }
        
//         links.push({
//           url: url,
//           group: group,
//           tags: tags
//         });
        
//         // Store credentials from columns E and F (columns 4 and 5 in 0-index)
//         if (row[4] && row[5]) {
//           var id = row[4].toString().trim();
//           var password = row[5].toString().trim();
//           if (id !== "" && password !== "") {
//             credentials.push({
//               id: id,
//               password: password
//             });
//           }
//         }
//       }
//     }
    
//     return JSON.stringify({ 
//       success: true, 
//       data: links,
//       credentials: credentials 
//     });
//   } catch (error) {
//     return JSON.stringify({ 
//       error: error.toString(),
//       message: "Failed to read data from sheet"
//     });
//   }
// }

// function verifyCredentials(id, password) {
//   try {
//     var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Links");
//     if (!sheet) {
//       return JSON.stringify({ error: "Sheet 'Links' not found" });
//     }
    
//     var data = sheet.getDataRange().getValues();
    
//     // Check credentials against columns E and F (columns 4 and 5 in 0-index)
//     for (var i = 1; i < data.length; i++) {
//       var row = data[i];
//       var sheetId = row[4] ? row[4].toString().trim() : "";
//       var sheetPassword = row[5] ? row[5].toString().trim() : "";
      
//       if (sheetId === id && sheetPassword === password) {
//         return JSON.stringify({ 
//           success: true, 
//           message: "Credentials verified"
//         });
//       }
//     }
    
//     return JSON.stringify({ 
//       success: false, 
//       message: "Invalid credentials" 
//     });
//   } catch (error) {
//     return JSON.stringify({ 
//       error: error.toString(),
//       message: "Failed to verify credentials"
//     });
//   }
// }

// function saveLinkToSheet(url, group, tags) {
//   try {
//     var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Links");
//     if (!sheet) {
//       sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Links");
//       // Add headers
//       sheet.getRange("A1:F1").setValues([["URL", "GROUP", "TAGS", "", "ID", "Password"]]);
//     }
    
//     var lastRow = sheet.getLastRow();
//     var newRow = lastRow + 1;
    
//     sheet.getRange(newRow, 1).setValue(url);
//     sheet.getRange(newRow, 2).setValue(group);
//     sheet.getRange(newRow, 3).setValue(tags.join(', '));
    
//     return JSON.stringify({ success: true, message: "Link added to sheet" });
//   } catch (error) {
//     return JSON.stringify({ error: error.toString() });
//   }
// }

// function updateLinkInSheet(oldUrl, newUrl, group, tags) {
//   try {
//     var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Links");
//     if (!sheet) {
//       return JSON.stringify({ error: "Sheet 'Links' not found" });
//     }
    
//     var data = sheet.getDataRange().getValues();
    
//     for (var i = 1; i < data.length; i++) {
//       if (data[i][0] === oldUrl) {
//         var row = i + 1; // +1 because array is 0-indexed, sheet is 1-indexed
        
//         sheet.getRange(row, 1).setValue(newUrl);
//         sheet.getRange(row, 2).setValue(group);
//         sheet.getRange(row, 3).setValue(tags.join(', '));
        
//         return JSON.stringify({ success: true, message: "Link updated" });
//       }
//     }
    
//     return JSON.stringify({ error: "Link not found in sheet" });
//   } catch (error) {
//     return JSON.stringify({ error: error.toString() });
//   }
// }

// function deleteLinkFromSheet(url) {
//   try {
//     var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Links");
//     if (!sheet) {
//       return JSON.stringify({ error: "Sheet 'Links' not found" });
//     }
    
//     var data = sheet.getDataRange().getValues();
    
//     for (var i = 1; i < data.length; i++) {
//       if (data[i][0] === url) {
//         sheet.deleteRow(i + 1); // +1 because array is 0-indexed, sheet is 1-indexed
//         return JSON.stringify({ success: true, message: "Link deleted" });
//       }
//     }
    
//     return JSON.stringify({ error: "Link not found in sheet" });
//   } catch (error) {
//     return JSON.stringify({ error: error.toString() });
//   }
// }




// Code.gs
const SPREADSHEET_ID = "1Ay3yrlqXmec31ZHS7J_XiZwSjrNVn9ENh6cm10XTHE0";

function doGet(e) {
  if (e && e.parameter.action === 'getLinksFromSheet') {
    return getLinksFromSheet(e);
  }
  
  // Allow JSONP callbacks
  if (e && e.parameter.callback) {
    return handleJsonp(e);
  }
  
  return ContentService
    .createTextOutput("Essential Links API")
    .setMimeType(ContentService.MimeType.TEXT);
}

function handleJsonp(e) {
  const callback = e.parameter.callback;
  const result = getLinksData();
  
  return ContentService
    .createTextOutput(`${callback}(${JSON.stringify(result)})`)
    .setMimeType(ContentService.MimeType.JAVASCRIPT)
    .setHeaders({
      'Access-Control-Allow-Origin': '*'
    });
}

function getLinksFromSheet(e) {
  const result = getLinksData();
  
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders({
      'Access-Control-Allow-Origin': '*'
    });
}

function getLinksData() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName("Links");
    
    if (!sheet) {
      return { error: "Sheet 'Links' not found", success: false };
    }
    
    const data = sheet.getDataRange().getValues();
    const links = [];
    
    // Skip header row
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      if (row[0] && row[0].toString().trim() !== "") {
        const url = row[0].toString().trim();
        const group = (row[1] && row[1].toString().trim()) || "General";
        let tags = [];
        
        if (row[2] && row[2].toString().trim() !== "") {
          tags = row[2].toString().split(',').map(tag => tag.trim()).filter(tag => tag !== "");
        }
        
        links.push({
          url: url,
          group: group,
          tags: tags
        });
      }
    }
    
    return { 
      success: true, 
      data: links,
      count: links.length,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    return { 
      success: false,
      error: error.toString(),
      message: "Failed to load data"
    };
  }
}