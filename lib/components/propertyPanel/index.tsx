import { useContext } from "react"
import { PictodeContext } from "../Pictode"


export const PropertyPanel = () => {
    const {tool} = useContext(PictodeContext)
    

    return (
        <div style={{inlineSize: '100px', blockSize: '100px', background: 'black'}}>

        </div>
    )
}
