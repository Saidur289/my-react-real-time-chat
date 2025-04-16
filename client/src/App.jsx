import "./App.css";
import { Button } from "@/components/ui/button"
function App() {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-svh">
        <Button>Click me</Button>
        <p className="text-blue-700 text-4xl">hello world</p>
      </div>
    </>
  );
}

export default App;
