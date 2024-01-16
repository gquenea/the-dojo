import { useEffect, useState } from "react";
import useAuthContext from "./useAuthContext";
import { projectAuth, projectFirestore } from "../firebase/config";

const useLogin = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const login = async (email: string, password: string) => {
    setError(null);
    setIsPending(true);

    try {
      const res = await projectAuth.signInWithEmailAndPassword(email, password);
      await projectFirestore
        .collection("users")
        .doc(res.user?.uid)
        .update({ online: true });
      dispatch({ type: "LOGIN", payload: res.user });
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch (err: any) {
      if (!isCancelled) {
        console.log(err.message);
        setError(err.message);
        setIsPending(false);
      }
    }
    setIsPending(false);
  };
  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);
  return { login, error, isPending };
};
export default useLogin;
