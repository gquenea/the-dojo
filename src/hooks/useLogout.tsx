import { useEffect, useState } from "react";
import useAuthContext from "./useAuthContext";
import { projectAuth, projectFirestore } from "../firebase/config";

const useLogout = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch, user } = useAuthContext();

  const logout = async () => {
    setError(null);
    setIsPending(true);

    try {
      // update online status
      if (user === null) return;
      const { uid } = user;
      await projectFirestore
        .collection("users")
        .doc(uid)
        .update({ online: false });

      await projectAuth.signOut();
      dispatch({ type: "LOGOUT" });

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
  return { logout, error, isPending };
};
export default useLogout;
