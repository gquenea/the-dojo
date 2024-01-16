import { useEffect, useState } from "react";
import {
  projectAuth,
  projectFirestore,
  projectStorage,
} from "../firebase/config";
import useAuthContext from "./useAuthContext";

const useSignup = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  const signup = async (
    email: string,
    password: string,
    displayName: string,
    thumbnail: File | null
  ) => {
    setError(null);
    setIsPending(true);

    try {
      // signup
      const res = await projectAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      if (!res) {
        throw new Error("Could not complete signup");
      }

      if (!thumbnail) return;

      // upload user thumbnail
      const uploadPath = `thumbnails/${res.user?.uid}/${thumbnail.name}`;
      const img = await projectStorage.ref(uploadPath).put(thumbnail);
      const imgUrl = await img.ref.getDownloadURL();

      // add display name to user (we have to update it after the creation, it's firebase rules)
      await res.user?.updateProfile({ displayName, photoURL: imgUrl });

      //create a user document
      await projectFirestore.collection("users").doc(res.user?.uid).set({
        online: true,
        displayName,
        photoURL: imgUrl,
      });

      // dispatch login action
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

  return { error, isPending, signup };
};

export default useSignup;
