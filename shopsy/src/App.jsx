import { AuthProvider } from "./contexts/AuthContext";
import { QueryProvider } from "./contexts/QueryProvider";
import { CartProvider } from "./hooks/useCart.jsx";
import AppRouter from "./router/AppRouter";

const App = () => {
  return (
    <QueryProvider>
      <AuthProvider>
        <CartProvider>
          <AppRouter />
        </CartProvider>
      </AuthProvider>
    </QueryProvider>
  );
};

export default App;
