import { createContext, useContext } from "react";

export const ProfileContext = createContext({
  profile: null,
  complete: false,
  loading: true,
  fbReady: false,
});

export const useProfileContext = () => useContext(ProfileContext);