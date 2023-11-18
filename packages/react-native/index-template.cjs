const path = require('path')
const fs = require("fs");
const readSvgDirectory = (directory, fileExtension = '.svg') =>
    fs.readdirSync(directory).filter((file) => path.extname(file) === fileExtension);

const currentDir = process.cwd()


const ICONS_DIR = path.resolve(currentDir, '../../icons');

function defaultIndexTemplate(filePaths) {

    const exportEntries = filePaths.map(({ path: filePath }) => {
        const basename = path.basename(filePath, path.extname(filePath))
        const exportName = /^\d/.test(basename) ? `Svg${basename}` : basename
        return `export { default as ${exportName} } from './${basename}'`
    })

    const svgFiles = readSvgDirectory(ICONS_DIR);

    const iconNames =svgFiles.map((svgFile) => {
        const _name= path.basename(svgFile, '.svg');
        return `"${_name}"`
    });


    exportEntries.push(`export type IconNames =  ${iconNames.join(" | ")} ;`)
    return exportEntries.join('\n')
}

module.exports = defaultIndexTemplate