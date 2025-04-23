import { getAuth } from "@firebase/auth";
import useFirebaseClientApp from "./useFirebaseClientApp";

export default function useFirebaseClientAuth(overrideConfig = null) {
  const app = useFirebaseClientApp(overrideConfig);

  return getAuth(app);
}
