import React from 'react';
import { createRoot } from 'react-dom/client';
//import AppTestIan from "./AppTestIan";

import { AppMain } from './AppMain';

const rootElement = document.getElementById('root');
createRoot(rootElement).render(<AppMain />);
