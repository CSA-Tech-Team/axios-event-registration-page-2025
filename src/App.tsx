import FloatingWhatsAppButton from "./components/common/FloatingWhatsAppButton";
import { Toaster } from "./components/ui/toaster";
import AxiosRoutes from "./router/Routes";

function App() {
  return (
    <>
      <AxiosRoutes />
      <Toaster />
      <FloatingWhatsAppButton inviteLink="https://chat.whatsapp.com/K6ZurxzU7siAY1ZRxeiL4K" />
    </>
  );
}

export default App;
