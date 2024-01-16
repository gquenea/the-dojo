import { useEffect, useReducer, useState } from "react";
import { projectFirestore, timestamp } from "../firebase/config";

interface IFirestoreReducer {
  document: any;
  isPending: boolean;
  error: string | null;
  success: boolean | null;
}

const initialState: IFirestoreReducer = {
  document: null,
  isPending: false,
  error: null,
  success: null,
};

interface Action {
  type: string;
  payload?: any;
}

const firestoreReducer = (state: IFirestoreReducer, action: Action) => {
  switch (action.type) {
    case "IS_PENDING":
      return { isPending: true, document: null, success: false, error: null };
    case "ADDED_DOCUMENT":
      return {
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case "DELETED_DOCUMENT":
      return {
        isPending: false,
        document: null,
        success: true,
        error: null,
      };
    case "UPDATED_DOCUEMENT":
      return {
        isPending: false,
        document: action.payload,
        success: true,
        error: null,
      };
    case "ERROR":
      return {
        isPending: false,
        document: null,
        success: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

const useFirestore = (colletion: any) => {
  const [response, dispatch] = useReducer(firestoreReducer, initialState);
  const [isCancelled, setIsCancelled] = useState(false);
  const ref = projectFirestore.collection(colletion);

  const dispatchIfNotCancelled = (action: Action) => {
    dispatch(action);
  };

  const addDocument = async (doc: any) => {
    dispatch({ type: "IS_PENDING" });
    try {
      const createdAt = timestamp.fromDate(new Date());
      const addedDocument = await ref.add({ ...doc, createdAt });
      dispatchIfNotCancelled({
        type: "ADDED_DOCUMENT",
        payload: addedDocument,
      });
    } catch (err: any) {
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message });
    }
  };

  const deleteDocument = async (id: any) => {
    dispatch({ type: "IS_PENDING" });
    try {
      await ref.doc(id).delete();
      dispatchIfNotCancelled({
        type: "DELETED_DOCUMENT",
      });
    } catch (err: any) {
      dispatchIfNotCancelled({ type: "ERROR", payload: "Could not delete" });
    }
  };
  const updateDocument = async (id: string, updates: any) => {
    dispatch({ type: "IS_PENDING" });
    try {
      const updatedDocument = await ref.doc(id).update(updates);
      dispatchIfNotCancelled({
        type: "UPDATED_DOCUMENT",
        payload: updatedDocument,
      });
      return updatedDocument;
    } catch (err: any) {
      dispatchIfNotCancelled({ type: "ERROR", payload: err.message });
    }
  };

  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { addDocument, deleteDocument, updateDocument, response };
};
export default useFirestore;
