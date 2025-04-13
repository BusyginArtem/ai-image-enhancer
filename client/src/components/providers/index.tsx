import { ToastContainer } from "react-toastify";
import ClientSessionProvider from "./client-session-provider";
import FirebaseAuthProvider from "./firebase-auth-provider";
import ThemeProvider from "./theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClientSessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <FirebaseAuthProvider>{children}</FirebaseAuthProvider>
        <ToastContainer position="bottom-right" hideProgressBar />
      </ThemeProvider>
    </ClientSessionProvider>
  );
}
