/*
Common Functions and Classes for Scriptable
*/

/*
 * ApiLib
 * 
 * Base Class for API Library implementations.
 * 
 * Example:
```
const c = importUrl("Lib Common", "https://raw.githubusercontent.com/3n3a/scriptable/master/libs/common.js")

class SearchCHApi extends c.ApiLib {
  constructor() {
    super("https://search.ch/timetable/api")
  }
  
  async getStationboard(stop) {
    let path = `/stationboard.json`
    path = this._addQueryParam(path, "stop", stop)
    return await this._requestJson(path)
  }
}
```
 */
class ApiLib {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
    this._upMethods = ['POST', 'PUT', 'PATCH', 'DELETE']
  }
  
  _constructUrl(path) {
    return `${this.baseUrl}${path}`
  }
  
  _isUpMethod(method) {
    return this._upMethods.includes(method)
  }
  
  async _reqJson(method, path, headers={}, body=null) {
    let url = this._constructUrl(path)
    let r = new Request(url)
    if (this._isUpMethod(method) && body) {
      r.body = JSON.stringify(body)
    }
    r.method = method
    r.headers = headers
    return await r.loadJSON()
  }
  
  async _postJson(path, body, headers={}) {
    return await this._reqJson('POST', path, headers, body)
  }
  
  async _getJson(path, headers={}) {
    return await this._reqJson('GET', path, headers)
  }
  
  _addQueryParam(path, key, value=null) {
    if (value) {
      let kv = `${key}=${value}`
      if (!path.includes("&")) {
        // first query param
        kv = "?" + kv
      } else {
        kv = "&" + kv
      }
      path += kv
    }
    return path
  }
}

/*
TableComponent

Easy "table" construction for a widget.
*/
class TableComponent {
  constructor(widget) {
    this._widget = widget
    this._stack = null
    this._cols = []
  }
  
  addHeaders(headers=[]) {
    this.addRow(headers)
  }
  
  addRow(content=[]) {
    let colCount = content.length
    
    for (let c = 0; c < colCount; c++) {
      if (this._cols[c] === undefined) {
        //console.log(`re init col [${c}]`)
        this._cols[c] = []
      }
      this._cols[c].push(content[c])
    }
  }
  
  render() {
    this._stack = this._widget.addStack()
    
    for (let [i, rows] of this._cols.entries()) {
      const colStack = this._stack.addStack()
      colStack.layoutVertically()
      for (let [i, row] of rows.entries()) {
        let rowText = colStack.addText(`${row}`)
        
        if (i === 0) rowText.font = Font.boldMonospacedSystemFont(16)
      }
      
      if (i !== this._cols.length) {
        this._stack.addSpacer()
      }
    }
    
    //console.log(this._cols)
  }
}

/////////// EXPORTS //////////
module.exports = {
  ApiLib,
  TableComponent
}