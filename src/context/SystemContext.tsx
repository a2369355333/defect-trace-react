import React, { createContext, useReducer, ReactNode, Dispatch } from "react";

// -----------------------------
// Action Types
// -----------------------------
export enum ACTION_TYPE {
  ADD_MONITOR_MAP = "ADD_MONITOR_MAP",
  ADD_MONITOR_MAP_WITHOUT_COMPARE = "ADD_MONITOR_MAP_WITHOUT_COMPARE",
  REMOVE_MONITOR_MAP = "REMOVE_MONITOR_MAP",
  CACHE_TARGET_DATE_LINE_FOR_CHART = "CACHE_TARGET_DATE_LINE_FOR_CHART",
  CLEAR_MONITOR_MAP_WITHOUT_COMPARE = "CLEAR_MONITOR_MAP_WITHOUT_COMPARE",
  CLEAR_MONITOR_MAP = "CLEAR_MONITOR_MAP",
}

// -----------------------------
// State & Action Interfaces
// -----------------------------
export interface MonitorMapItem {
  MapId: string | number; 
  [key: string]: any;
}

export interface TargetDateLineForChartData {
  [key: string]: any;
}

export interface SystemState {
  monitorMapList: MonitorMapItem[];
  targetDateLineForChartData: TargetDateLineForChartData;
}

export type SystemAction =
  | { type: ACTION_TYPE.ADD_MONITOR_MAP; data: MonitorMapItem[] }
  | { type: ACTION_TYPE.ADD_MONITOR_MAP_WITHOUT_COMPARE; data: MonitorMapItem[] }
  | { type: ACTION_TYPE.REMOVE_MONITOR_MAP; data: (string | number)[] }
  | { type: ACTION_TYPE.CACHE_TARGET_DATE_LINE_FOR_CHART; data: any }
  | { type: ACTION_TYPE.CLEAR_MONITOR_MAP_WITHOUT_COMPARE }
  | { type: ACTION_TYPE.CLEAR_MONITOR_MAP };

// -----------------------------
// Initial State
// -----------------------------
const initState: SystemState = {
  monitorMapList: [],
  targetDateLineForChartData: {},
};

// -----------------------------
// Reducer
// -----------------------------
const systemReducer = (state: SystemState, action: SystemAction): SystemState => {
  let newMapList: MonitorMapItem[] = [];

  switch (action.type) {
    case ACTION_TYPE.ADD_MONITOR_MAP: {
      const mapList = new Map(state.monitorMapList.map((v) => [v.MapId, v]));
      action.data.forEach((v) => mapList.set(v.MapId, v));
      newMapList = Array.from(mapList.values());
      return { ...state, monitorMapList: newMapList };
    }

    case ACTION_TYPE.REMOVE_MONITOR_MAP: {
      newMapList = state.monitorMapList.filter(
        (v) => !(action.data ?? []).includes(v.MapId)
      );
      return { ...state, monitorMapList: newMapList };
    }

    case ACTION_TYPE.CACHE_TARGET_DATE_LINE_FOR_CHART: {
      return { ...state, targetDateLineForChartData: action.data };
    }

    case ACTION_TYPE.CLEAR_MONITOR_MAP: {
      return { ...state, monitorMapList: [] };
    }

    case ACTION_TYPE.CLEAR_MONITOR_MAP_WITHOUT_COMPARE: {
      return state;
    }

    default:
      return state;
  }
};

// -----------------------------
// Context
// -----------------------------
interface SystemContextProps {
  state: SystemState;
  dispatch: Dispatch<SystemAction>;
}

// Provide default value to avoid undefined issues
export const SystemContext = createContext<SystemContextProps>({
  state: initState,
  dispatch: () => undefined,
});

interface SystemProviderProps {
  children: ReactNode;
}

export const SystemProvider = ({ children }: SystemProviderProps) => {
  const [state, dispatch] = useReducer(systemReducer, initState);

  return (
    <SystemContext.Provider value={{ state, dispatch }}>
      {children}
    </SystemContext.Provider>
  );
};
