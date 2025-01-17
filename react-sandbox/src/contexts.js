import { createContext } from 'react';
import { THEMES } from './CONSTANTS';

export const ThemeContext = createContext(THEMES.DARK);