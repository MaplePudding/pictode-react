import { useCallback, useContext } from "react"
import { PictodeContext } from "../Pictode"


export const PropertyPanel = () => {
    const {tool, selectedNodes, panelFormConfig, app} = useContext(PictodeContext)
    console.error(panelFormConfig.current)

    const handleFormChange = useCallback((value: any) => {
        app.update(
          ...selectedNodes.value.map((node) => {
            const newNode = node.toObject();
            newNode.attrs = {
              ...newNode.attrs,
              ...value,
            };
            return newNode;
          })
        );
      }, [app, selectedNodes])
    

    return (
        <div style={{inlineSize: '200px', blockSize: '100px', background: 'black', position: 'fixed', top: '20px', right: '20px'}}>

        </div>
    )
}
