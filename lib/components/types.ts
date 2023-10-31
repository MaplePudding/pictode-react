import type { FC, ReactNode } from 'react';
import type { App, Plugin, Tool, ToolHooks } from '@pictode/core';

export interface PictodeContextType {
  app: App;
  plugins: Plugin[];
}

export interface ToolProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>, ToolHooks {
  children?:
    | ReactNode
    | FC<{
        app: App;
        tool: Tool;
        active: boolean;
      }>;
}