import { copySync } from 'fs-extra'

// Define the source and destination paths
const sourceFolder = 'F:\\dev\\UShell\\UShell.CommonComponents.JS\\dist'
const destinationFolder =
  'F:\\dev\\UShell\\UShell.DemoApp\\ushell-standalone-demo\\node_modules\\ushell-common-components\\dist'

// Use the fs-extra library to copy the folder
copySync(sourceFolder, destinationFolder)

console.log('Folder copied successfully!')
