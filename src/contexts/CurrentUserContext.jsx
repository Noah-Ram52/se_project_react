import { createContext } from "react";

// Holds the current user object (or null when not signed in)
const CurrentUserContext = createContext(null);

export default CurrentUserContext;
