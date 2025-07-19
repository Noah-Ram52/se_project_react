import { createContext } from "react";

// Need a context provider for createContext to work
// Context provider is in App.jsx line 57
// It is called currentTemperatureUnitContext.Provider
const currentTemperatureUnitContext = createContext();

export default currentTemperatureUnitContext;
