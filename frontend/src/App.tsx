import CDA from "./pages/Cda";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <div className="bg-slate-50 flex flex-col">
      <Dashboard className="p-5" />
      <CDA />
    </div>
  );
}

export default App;
