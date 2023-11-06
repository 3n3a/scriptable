/*
Code Import

- Import code from URL (needs to be already in script...)
*/


// Import Code from Url (only one-time download / no update)
// Usage: const code = await importUrl("name", "https://code.js")
async function importUrl(codeFilename, githubUrl) {
// Determine if the user is using iCloud.
let files = FileManager.local()
const iCloudInUse = files.isFileStoredIniCloud(module.filename)

// If so, use an iCloud file manager.
files = iCloudInUse ? FileManager.iCloud() : files

// Determine if the Weather Cal code exists and download if needed.
const pathToCode = files.joinPath(files.documentsDirectory(), codeFilename + ".js")
if (!files.fileExists(pathToCode)) {
  let req = new Request(gitHubUrl)
  const codeString = await req.loadString()
  files.writeString(pathToCode, codeString)
}

// Import the code.
if (iCloudInUse) { 
  await files.downloadFileFromiCloud(pathToCode) }
return importModule(codeFilename)
}

/*
Minified Version:

async function importUrl(i,t){let l=FileManager.local(),e=l.isFileStoredIniCloud(module.filename);l=e?FileManager.iCloud():l;let o=l.joinPath(l.documentsDirectory(),i+".js");if(!l.fileExists(o)){let n=new Request(t),r=await n.loadString();l.writeString(o,r)}return e&&await l.downloadFileFromiCloud(o),importModule(i)}
*/
