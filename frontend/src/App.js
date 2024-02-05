import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CustomerChat from "./CustomerChat";
import EmployeeDashPage from "./employeedaspage";
import EmployeeChat from "./employeechat";
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/customer/chat/:tid/:cid" element={<CustomerChat />} />
          <Route path="/employee/chat/:tid/:cid" element={<EmployeeChat />} />
          <Route path="/employeedash" element={<EmployeeDashPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
