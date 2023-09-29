import "./styles/app.css";
import NavigationPanel from "./components/NavigationPanel";
import Container from "./components/Container";
import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/dashboard";
import Header from "./components/Header";
import Settings from "./pages/settings";
import Users from "./pages/users";

function App() {
  return (
    <div>
      <NavigationPanel />
      <Container>
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to={"/dashboard"} replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />

          <Route path="/settings" element={<Settings />} />
          
        </Routes>
      </Container>
    </div>
  );
}

export default App;
