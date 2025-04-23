import { getStorage } from "@firebase/storage";

import useFirebaseApp from "./useFirebaseClientApp";

export default function useFirebaseClientStorage(overrideConfig = null) {
  const app = useFirebaseApp(overrideConfig);

  return getStorage(app);
}
