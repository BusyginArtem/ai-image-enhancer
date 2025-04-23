import { getFirestore } from "@firebase/firestore";

import useFirebaseApp from "./useFirebaseClientApp";

export default function useFirebaseClientFirestore(overrideConfig = null) {
  const app = useFirebaseApp(overrideConfig);

  return getFirestore(app);
}
