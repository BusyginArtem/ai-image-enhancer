import FirebaseClientApp from "../services/firebase/client";

export default function useFirebaseClientApp(overrideConfig = null) {
  return FirebaseClientApp(overrideConfig);
}
