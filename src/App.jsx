import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/overview" element={<Dashboard view="overview" />} />
      <Route path="/kanban" element={<Dashboard view="kanban" />} />
      <Route path="/favorites" element={<Dashboard view="favorites" />} />
      <Route path="/analytics" element={<Dashboard view="analytics" />} />
      <Route path="/settings" element={<Dashboard view="settings" />} />
      <Route path="/help" element={<Dashboard view="help" />} />
      <Route path="/privacy" element={<Dashboard view="privacy" />} />
      <Route path="/terms" element={<Dashboard view="terms" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
