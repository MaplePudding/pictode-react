import { createContext, forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { App, EventArgs, Plugin, Tool } from '@pictode/core';

import { ChildrenComponent, PictodeContextType } from '../types';
import { getPanelConfigByShape, getPanelConfigByTool } from './panels';
import { PropertyPanel } from './propertyPanel';

export interface PictodeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  plugins?: Plugin[];
  children?: ChildrenComponent<PictodeContextType>;
}

export const PictodeContext = createContext<PictodeContextType | null>(null);

export const Pictode = forwardRef((props: PictodeProps, ref: React.ForwardedRef<PictodeContextType>) => {
  const { plugins = [], className, children } = props;
  const app = useMemo(() => new App(), []);
  const [tool, setTool] = useState<Tool | null>(null);

  const contextValue = useMemo(() => ({ app, plugins, tool }), [app, plugins, tool]);
  const panelFormConfig = useRef([])
  const panelFormModel = useRef({})
  const selected = useRef([]);
  console.error(selected)
  const [selectedNodes, setSelectedNodes] = useState([])

  const onToolChanged = useCallback(({ curTool }: EventArgs['tool:changed']) => {
    if (!curTool) {
      return;
    }
    const newPanelConfig = getPanelConfigByTool(curTool.name);
    if (!newPanelConfig) {
      return;
    }
    console.error(newPanelConfig)
    panelFormConfig.current = newPanelConfig.formConfig;
    panelFormModel.current = newPanelConfig.model;

    curTool.config = { ...curTool.config, ...panelFormModel.current };
    setTool(curTool);
  }, []);

  const onSelectedChanged = ({ selected: newSelected }) => {
  
    selected.current = newSelected;
    if (app.curTool?.name !== 'selectTool') {
      return;
    }
    const newPanelConfig = getPanelConfigByShape(newSelected[0]?.className ?? '');
    panelFormConfig.current = newPanelConfig?.formConfig ?? [];
    if (newPanelConfig?.model) {
      newPanelConfig.model = Object.keys(newPanelConfig.model).reduce(
        (model, key) => ({
          ...model,
          [key]: selected.current?.[0].attrs[key],
        }),
        {}
      );
    }
    panelFormModel.current = newPanelConfig?.model ?? {};
    setSelectedNodes(newSelected)
  }

  useEffect(() => {
    app.on('tool:changed', onToolChanged);
    app.on('selected:changed', onSelectedChanged);
    return () => {
      app.off('tool:changed', onToolChanged);
      app.off('selected:changed', onSelectedChanged);
    };
  }, [app, onToolChanged]);

  useEffect(() => {
    plugins?.forEach((plugin) => app.use(plugin));
  }, [plugins, app]);

  useImperativeHandle(ref, () => contextValue, [contextValue]);

  return (
    <PictodeContext.Provider value={contextValue}>
      <div className={`pe-w-full pe-h-full ${className}`}>
        {typeof children === 'function' ? children(contextValue) : children}
        <PropertyPanel />
      </div>
    </PictodeContext.Provider>
  );
});
