import { createContext, useContext } from "react";

export const ProfileContext = createContext({
  profile: null,
  complete: false,
  loading: true,
});

export const useProfileContext = () => useContext(ProfileContext);