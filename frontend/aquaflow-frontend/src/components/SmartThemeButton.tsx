import { useThemeToggle } from "@asafarim/react-themes";

function SmartThemeButton() {
  const { mode, toggleMode, isDark, effectiveMode } = useThemeToggle();
  
  const getIcon = () => {
    if (mode === 'auto') return '🌓';
    return isDark ? '🌙' : '☀️';
  };
  
  const getLabel = () => {
    if (mode === 'auto') return `Auto (${effectiveMode})`;
    return mode === 'dark' ? 'Dark Mode' : 'Light Mode';
  };
  
  return (
    <button onClick={toggleMode} title={getLabel()}>
      {getIcon()} {getLabel()}
    </button>
  );
}
export default SmartThemeButton;