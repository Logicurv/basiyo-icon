import fs from 'fs';
import path from 'path'
import { fileURLToPath } from 'url';
/**
 * writes content to a file
 *
 * @param {string} content
 * @param {string} fileName
 * @param {string} outputDirectory
 */
export const getCurrentDirPath = (currentPath) => path.dirname(fileURLToPath(currentPath));


export const writeFile = (content, fileName, outputDirectory) =>
    fs.writeFileSync(path.join(outputDirectory, fileName), content, 'utf-8');


/**
 * reads the icon directory
 *
 * @param {string} directory
 * @returns {array} An array of file paths containig svgs
 */
export const readSvgDirectory = (directory, fileExtension = '.svg') =>
    fs.readdirSync(directory).filter((file) => path.extname(file) === fileExtension);


/**
 * Converts string to CamelCase
 *
 * @param {string} string
 * @returns {string} A camelized string
 */
export const toCamelCase = (string) =>
    string.replace(/^([A-Z])|[\s-_]+(\w)/g, (match, p1, p2) =>
        p2 ? p2.toUpperCase() : p1.toLowerCase(),
    );

/**
 * Converts string to PascalCase
 *
 * @param {string} string
 * @returns {string} A pascalized string
 */
export const toPascalCase = (string) => {
    const camelCase = toCamelCase(string);

    return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
};


const currentDir = getCurrentDirPath(import.meta.url);
const ICONS_DIR = path.resolve(currentDir, '../../../icons');
const distDirectory = path.join(currentDir, '../dist');

let declarationFileContent = `\
/// <reference types="react" />
import type { SvgProps } from "react-native-svg";

// Generated icon
type BasiyoReactNativeIconType= (props: SVGProps<SVGSVGElement>) => JSX.Element;
`;
function writeDeclarationFile(){
    const svgFiles = readSvgDirectory(ICONS_DIR);
    svgFiles.forEach((svgFile) => {
        const iconName = path.basename(svgFile, '.svg');
        const componentName = toPascalCase(iconName);

        declarationFileContent += `export declare const Svg${componentName}: BasiyoReactNativeIconType;\n`;
    });

    const iconNames =svgFiles.map((svgFile) => {
        const _name= path.basename(svgFile, '.svg');
        return `"${_name}"`
    });


    declarationFileContent +=`\n//alias\nexport type IconNames =  ${iconNames.join(" | ")} ;`


    const aliasArray=[];

    svgFiles.forEach((svgFile)=>{
        const iconName = path.basename(svgFile, '.svg');
        const componentName = toPascalCase(iconName);
        aliasArray.push(`Svg${componentName} as ${componentName}`)
    })

    declarationFileContent +=`\n
type INameProps = Omit<SVGProps<SVGSVGElement>, "name"> & {
    name: IconNames;
};\n
declare function Icon({ name, ...otherProps }: INameProps): JSX.Element;\n
//alias
\nexport { ${aliasArray.join(",")},Icon as default };`
    writeFile(declarationFileContent,"index.d.ts",distDirectory)
}
writeDeclarationFile()

