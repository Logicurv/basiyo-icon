import type { SvgProps } from "react-native-svg";
import * as React from "react";
import * as AllGeneratedIcons from "./generated-icons";
import type {IconNames} from './generated-icons'
function kebabToPascalCase(kebabString:string) {
    return kebabString
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}

type INameProps = Omit<SVGProps<SVGSVGElement>,"name"> & {name:IconNames}
export default function Icon({name,...otherProps}:INameProps){
    const d = kebabToPascalCase(name)
    const Component = AllGeneratedIcons[d] as (_props: SVGProps<SVGSVGElement>) => JSX.Element
    return <Component {...otherProps}/>
}


export * from "./generated-icons";