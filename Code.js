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
function doGet(e) {
  if (e && e.parameter.action) {
    return handleApiRequest(e);
  }
  
  // For direct access to the GAS URL
  return HtmlService.createTemplateFromFile("Index")
    .evaluate()
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setTitle("Essential Links – Glass Edition");
}

function handleApiRequest(e) {
  const action = e.parameter.action;
  let result = {};
  
  try {
    switch(action) {
      case 'getLinksFromSheet':
        result = getLinksFromSheet();
        break;
      case 'verifyCredentials':
        result = verifyCredentials(e.parameter.id, e.parameter.password);
        break;
      case 'saveLinkToSheet':
        result = saveLinkToSheet(
          e.parameter.url, 
          e.parameter.group, 
          e.parameter.tags
        );
        break;
      case 'updateLinkInSheet':
        result = updateLinkInSheet(
          e.parameter.oldUrl,
          e.parameter.newUrl,
          e.parameter.group,
          e.parameter.tags
        );
        break;
      case 'deleteLinkFromSheet':
        result = deleteLinkFromSheet(e.parameter.url);
        break;
      default:
        result = { error: 'Invalid action' };
    }
  } catch (error) {
    console.error('API Error:', error);
    result = { error: error.toString() };
  }
  
  // Return JSON with CORS headers
  const output = ContentService.createTextOutput(JSON.stringify(result));
  output.setMimeType(ContentService.MimeType.JSON);
  output.setHeaders({
    'Access-Control-Allow-Origin': '*'
  });
  
  return output;
}

// ===== GOOGLE SHEETS FUNCTIONS =====
const SPREADSHEET_ID = "1Ay3yrlqXmec31ZHS7J_XiZwSjrNVn9ENh6cm10XTHE0";

function getLinksFromSheet() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName("Links");
    
    if (!sheet) {
      return { error: "Sheet 'Links' not found" };
    }
    
    const data = sheet.getDataRange().getValues();
    const links = [];
    const credentials = [];
    
    // Start from row 2 (skip header row)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Check if URL exists in column A
      if (row[0] && row[0].toString().trim() !== "") {
        const url = row[0].toString().trim();
        const group = (row[1] && row[1].toString().trim()) || "General";
        let tags = [];
        
        // Get tags from column C
        if (row[2] && row[2].toString().trim() !== "") {
          tags = row[2].toString().split(',').map(tag => tag.trim());
        }
        
        links.push({
          url: url,
          group: group,
          tags: tags
        });
        
        // Store credentials from columns E and F
        if (row[4] && row[5]) {
          const id = row[4].toString().trim();
          const password = row[5].toString().trim();
          if (id !== "" && password !== "") {
            credentials.push({
              id: id,
              password: password
            });
          }
        }
      }
    }
    
    return { 
      success: true, 
      data: links,
      credentials: credentials 
    };
    
  } catch (error) {
    return { 
      error: error.toString(),
      message: "Failed to read data from sheet"
    };
  }
}

function verifyCredentials(id, password) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName("Links");
    
    if (!sheet) {
      return { error: "Sheet 'Links' not found" };
    }
    
    const data = sheet.getDataRange().getValues();
    
    // Check credentials against columns E and F
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const sheetId = row[4] ? row[4].toString().trim() : "";
      const sheetPassword = row[5] ? row[5].toString().trim() : "";
      
      if (sheetId === id && sheetPassword === password) {
        return { 
          success: true, 
          message: "Credentials verified"
        };
      }
    }
    
    return { 
      success: false, 
      message: "Invalid credentials" 
    };
    
  } catch (error) {
    return { 
      error: error.toString(),
      message: "Failed to verify credentials"
    };
  }
}

function saveLinkToSheet(url, group, tags) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName("Links");
    
    if (!sheet) {
      // Create sheet if it doesn't exist
      sheet = ss.insertSheet("Links");
      // Add headers
      sheet.getRange("A1:F1").setValues([["URL", "GROUP", "TAGS", "", "ID", "Password"]]);
    }
    
    const lastRow = sheet.getLastRow();
    const newRow = lastRow + 1;
    
    sheet.getRange(newRow, 1).setValue(url);
    sheet.getRange(newRow, 2).setValue(group);
    sheet.getRange(newRow, 3).setValue(tags);
    
    return { success: true, message: "Link added to sheet" };
    
  } catch (error) {
    return { error: error.toString() };
  }
}

function updateLinkInSheet(oldUrl, newUrl, group, tags) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName("Links");
    
    if (!sheet) {
      return { error: "Sheet 'Links' not found" };
    }
    
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === oldUrl) {
        const row = i + 1; // +1 because array is 0-indexed
        
        sheet.getRange(row, 1).setValue(newUrl);
        sheet.getRange(row, 2).setValue(group);
        sheet.getRange(row, 3).setValue(tags);
        
        return { success: true, message: "Link updated" };
      }
    }
    
    return { error: "Link not found in sheet" };
    
  } catch (error) {
    return { error: error.toString() };
  }
}

function deleteLinkFromSheet(url) {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName("Links");
    
    if (!sheet) {
      return { error: "Sheet 'Links' not found" };
    }
    
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === url) {
        sheet.deleteRow(i + 1);
        return { success: true, message: "Link deleted" };
      }
    }
    
    return { error: "Link not found in sheet" };
    
  } catch (error) {
    return { error: error.toString() };
  }
}