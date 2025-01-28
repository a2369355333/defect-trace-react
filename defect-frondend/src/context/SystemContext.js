import React, {
    createContext,
    useReducer,
  } from "react";
  
  const ACTION_TYPE = {
    addMonitorMap: "ADD_MONITOR_MAP",
    addMonitorMapWithoutCompare: "ADD_MONITOR_MAP_WITHOUT_COMPARE",
    removeMonitorMap: "REMOVE_MONITOR_MAP",
    cacheTargetDateLineForChart: "CACHE_TARGET_DATE_LINE_FOR_CHART",
    clearAddMonitorMapWithoutCompare: "CLEAR_MONITOR_MAP_WITHOUT_COMPARE",
    clearAddMonitorMap: "CLEAR_MONITOR_MAP",
  };
  
  const initState = {
    monitorMapList: [],
    targetDateLineForChartData: {},
  };
  
  const systemReducer = (state = initState, action) => {
    let newMapList = [];
    switch (action.type) {
      case ACTION_TYPE.addMonitorMap:
        const mapList = new Map(state.monitorMapList.map((v) => [v.MapId, v]));
        action.data.forEach((v) => mapList.set(v.MapId, v));
        newMapList = [...mapList.values()];
        return { ...state, monitorMapList: newMapList };
      case ACTION_TYPE.removeMonitorMap:
        newMapList = state.monitorMapList.filter(
          (v) => !(action?.data ?? []).includes(v.MapId)
        );
        return {};
      case ACTION_TYPE.cacheTargetDateLineForChart:
        return {};
      case ACTION_TYPE.clearAddMonitorMap:
        return {};
      default:
        return state;
    }
  };
  
  const SystemContext = createContext();
  
  const SystemProvider = ({ children }) => {
    const [state, dispatch] = useReducer(systemReducer, initState);
    return (
      <SystemContext.Provider value={{ state, dispatch }}>
        {children}
      </SystemContext.Provider>
    );
  };
  
  export { SystemProvider, SystemContext };