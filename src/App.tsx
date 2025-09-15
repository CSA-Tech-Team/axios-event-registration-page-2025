import { Toaster } from "./components/ui/toaster";
import AxiosRoutes from "./router/Routes";

function App() {
  return (
    <>
      <AxiosRoutes />
      <Toaster />
    </>
  );
}

export default App;
