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
  // If it's an API request, handle it
  if (e.parameter.action) {
    return handleApiRequest(e);
  }
  
  // Otherwise serve the HTML (for direct access via the GAS URL)
  var html = HtmlService.createTemplateFromFile("index").evaluate();
  html.addMetaTag("viewport", "width=device-width, initial-scale=1");
  return html
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setTitle("Essential Links – Glass Edition");
}

function doPost(e) {
  return handleApiRequest(e);
}

function handleApiRequest(e) {
  const action = e.parameter.action;
  let result = {};
  
  try {
    switch(action) {
      case 'getLinksFromSheet':
        result = JSON.parse(getLinksFromSheet());
        break;
      case 'verifyCredentials':
        const id = e.parameter.id;
        const password = e.parameter.password;
        result = JSON.parse(verifyCredentials(id, password));
        break;
      case 'saveLinkToSheet':
        const url = e.parameter.url;
        const group = e.parameter.group;
        const tags = e.parameter.tags;
        result = JSON.parse(saveLinkToSheet(url, group, tags));
        break;
      case 'updateLinkInSheet':
        const oldUrl = e.parameter.oldUrl;
        const newUrl = e.parameter.newUrl;
        const newGroup = e.parameter.group;
        const newTags = e.parameter.tags;
        result = JSON.parse(updateLinkInSheet(oldUrl, newUrl, newGroup, newTags));
        break;
      case 'deleteLinkFromSheet':
        const delUrl = e.parameter.url;
        result = JSON.parse(deleteLinkFromSheet(delUrl));
        break;
      default:
        result = { error: 'Invalid action' };
    }
  } catch (error) {
    console.error('API Error:', error);
    result = { error: error.toString() };
  }
  
  // Set CORS headers for cross-origin requests (from GitHub Pages)
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON)
    .addHeader('Access-Control-Allow-Origin', '*')
    .addHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .addHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Add OPTIONS method for CORS preflight requests
function doOptions() {
  return ContentService
    .createTextOutput('')
    .setMimeType(ContentService.MimeType.JSON)
    .addHeader('Access-Control-Allow-Origin', '*')
    .addHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    .addHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// === Your Original Sheet Functions (Keep exactly as before) ===
function getLinksFromSheet() {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Links");
    if (!sheet) {
      return JSON.stringify({ error: "Sheet 'Links' not found" });
    }
    
    var data = sheet.getDataRange().getValues();
    var links = [];
    var credentials = [];
    
    // Start from row 2 (skip header row)
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      // Check if URL exists in column A
      if (row[0] && row[0].toString().trim() !== "") {
        var url = row[0].toString().trim();
        var group = (row[1] && row[1].toString().trim()) || "General";
        var tags = [];
        
        // Get tags from column C
        if (row[2] && row[2].toString().trim() !== "") {
          tags = row[2].toString().split(',').map(function(tag) {
            return tag.trim();
          });
        }
        
        links.push({
          url: url,
          group: group,
          tags: tags
        });
        
        // Store credentials from columns E and F (columns 4 and 5 in 0-index)
        if (row[4] && row[5]) {
          var id = row[4].toString().trim();
          var password = row[5].toString().trim();
          if (id !== "" && password !== "") {
            credentials.push({
              id: id,
              password: password
            });
          }
        }
      }
    }
    
    return JSON.stringify({ 
      success: true, 
      data: links,
      credentials: credentials 
    });
  } catch (error) {
    return JSON.stringify({ 
      error: error.toString(),
      message: "Failed to read data from sheet"
    });
  }
}

function verifyCredentials(id, password) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Links");
    if (!sheet) {
      return JSON.stringify({ error: "Sheet 'Links' not found" });
    }
    
    var data = sheet.getDataRange().getValues();
    
    // Check credentials against columns E and F (columns 4 and 5 in 0-index)
    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      var sheetId = row[4] ? row[4].toString().trim() : "";
      var sheetPassword = row[5] ? row[5].toString().trim() : "";
      
      if (sheetId === id && sheetPassword === password) {
        return JSON.stringify({ 
          success: true, 
          message: "Credentials verified"
        });
      }
    }
    
    return JSON.stringify({ 
      success: false, 
      message: "Invalid credentials" 
    });
  } catch (error) {
    return JSON.stringify({ 
      error: error.toString(),
      message: "Failed to verify credentials"
    });
  }
}

function saveLinkToSheet(url, group, tags) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Links");
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Links");
      // Add headers
      sheet.getRange("A1:F1").setValues([["URL", "GROUP", "TAGS", "", "ID", "Password"]]);
    }
    
    var lastRow = sheet.getLastRow();
    var newRow = lastRow + 1;
    
    sheet.getRange(newRow, 1).setValue(url);
    sheet.getRange(newRow, 2).setValue(group);
    sheet.getRange(newRow, 3).setValue(tags);
    
    return JSON.stringify({ success: true, message: "Link added to sheet" });
  } catch (error) {
    return JSON.stringify({ error: error.toString() });
  }
}

function updateLinkInSheet(oldUrl, newUrl, group, tags) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Links");
    if (!sheet) {
      return JSON.stringify({ error: "Sheet 'Links' not found" });
    }
    
    var data = sheet.getDataRange().getValues();
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === oldUrl) {
        var row = i + 1; // +1 because array is 0-indexed, sheet is 1-indexed
        
        sheet.getRange(row, 1).setValue(newUrl);
        sheet.getRange(row, 2).setValue(group);
        sheet.getRange(row, 3).setValue(tags);
        
        return JSON.stringify({ success: true, message: "Link updated" });
      }
    }
    
    return JSON.stringify({ error: "Link not found in sheet" });
  } catch (error) {
    return JSON.stringify({ error: error.toString() });
  }
}

function deleteLinkFromSheet(url) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Links");
    if (!sheet) {
      return JSON.stringify({ error: "Sheet 'Links' not found" });
    }
    
    var data = sheet.getDataRange().getValues();
    
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === url) {
        sheet.deleteRow(i + 1); // +1 because array is 0-indexed, sheet is 1-indexed
        return JSON.stringify({ success: true, message: "Link deleted" });
      }
    }
    
    return JSON.stringify({ error: "Link not found in sheet" });
  } catch (error) {
    return JSON.stringify({ error: error.toString() });
  }
}