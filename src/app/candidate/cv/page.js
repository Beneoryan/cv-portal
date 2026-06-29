"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import CVTemplate from "@/components/CVTemplate";

export default function CandidateCVPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
      return;
    }
    if (user) {
      loadData();
    }
  }, [user, authLoading]);

  const loadData = async () => {
    try {
      const docRef = doc(db, "candidates", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData(docSnap.data());
      }
    } catch (err) {
      console.error("Error:", err);
    }
    setLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-8 text-center">
          <div className="card">
            <p className="text-gray-500 mb-4">Anda belum mengisi form data. Silakan isi form terlebih dahulu.</p>
            <button onClick={() => router.push("/candidate/form")} className="btn-primary">
              Isi Form
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6 no-print">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">履歴書 (CV)</h1>
            <p className="text-gray-500 text-sm">CV dalam format bahasa Jepang</p>
          </div>
          <button onClick={handlePrint} className="btn-primary">
            Print / Cetak PDF
          </button>
        </div>
        <CVTemplate data={data} />
      </div>
    </>
  );
}
