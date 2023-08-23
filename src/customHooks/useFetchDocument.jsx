import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { toast } from "react-toastify";

export const useFetchDocument = (collectionName , documentID) => {
    const [document , setDocument ] = useState(null);

    const getDocument =  async() => {
        const docRef = doc(db,collectionName , documentID);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const obj = {
            id : documentID,
            ...docSnap.data(),
          };
          setDocument(obj);
  
        } else {
          toast.error("Document Not Found!")
        }
      };

      useEffect(()=>{
        getDocument()
      },[])

      return{ document }
}
