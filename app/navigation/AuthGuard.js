import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "expo-router";
import { auth } from "../firebase/firebaseConfig";
import Loading from "@/components/loading";

const AuthGuard = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        if (router.isReady) {
          router.push("/auth/login");
        }
      }
    });

    return () => unsubscribe();
  }, [router.isReady]);

  if (isAuthenticated === null) {
    return <Loading />;
  }

  return <View style={{ flex: 1 }}>{children}</View>;
};

export default AuthGuard;
