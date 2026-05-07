import { registerRootComponent } from 'expo';
import { ThemeProvider } from './src/context/ThemeContext';
import App from './App';

function AppWithTheme() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
}

registerRootComponent(AppWithTheme);
