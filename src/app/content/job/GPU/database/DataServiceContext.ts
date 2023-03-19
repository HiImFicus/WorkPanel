import { createContext } from "react";

import { DatabaseServie } from "./DatabaseService";

export const dataServiceContext = createContext<DatabaseServie | null>(null);
