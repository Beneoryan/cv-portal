"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function AdminCandidatesPage() {
  const { user, userData, loading: authLoading } = useAuth();
  const router = useRouter();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBidang, setFilterBidang] = useState("");

  useEffect(() => {
    if (!authLoading && (!user || userData?.role !== "admin")) {
      router.push("/");
      return;
    }
    if (user && userData?.role === "admin") {
      loadCandidates();
    }
  }, [user, userData, authLoading]);

  const loadCandidates = async () => {
    try {
      const q = query(collection(db, "candidates"), orderBy("submittedAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCandidates(data);
    } catch (err) {
      console.error("Error loading candidates:", err);
    }
    setLoading(false);
  };

  const filtered = candidates.filter((c) => {
    const matchSearch = !searchTerm ||
      c.namaLengkap?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.kodeJob?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchBidang = !filterBidang || c.bidangKerja === filterBidang;
    return matchSearch && matchBidang;
  });

  const uniqueBidang = [...new Set(candidates.map((c) => c.bidangKerja).filter(Boolean))];

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Data Kandidat</h1>
            <p className="text-gray-500 text-sm">{candidates.length} kandidat terdaftar</p>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="form-label">Cari Nama/Kode Job</label>
              <input
                className="input-field"
                placeholder="Ketik nama atau kode..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <label className="form-label">Filter Bidang</label>
              <select className="input-field" value={filterBidang} onChange={(e) => setFilterBidang(e.target.value)}>
                <option value="">Semua Bidang</option>
                {uniqueBidang.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <span className="text-sm text-gray-500">{filtered.length} hasil ditemukan</span>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-medium text-gray-600">No</th>
                <th className="text-left py-3 px-2 font-medium text-gray-600">Nama Lengkap</th>
                <th className="text-left py-3 px-2 font-medium text-gray-600">Bidang</th>
                <th className="text-left py-3 px-2 font-medium text-gray-600">Kategori</th>
                <th className="text-left py-3 px-2 font-medium text-gray-600">Kode Job</th>
                <th className="text-left py-3 px-2 font-medium text-gray-600">No HP</th>
                <th className="text-left py-3 px-2 font-medium text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c, idx) => (
                <tr key={c.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2 text-gray-500">{idx + 1}</td>
                  <td className="py-3 px-2 font-medium text-gray-800">{c.namaLengkap}</td>
                  <td className="py-3 px-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">{c.bidangKerja}</span>
                  </td>
                  <td className="py-3 px-2 text-gray-600">{c.kategoriKandidat}</td>
                  <td className="py-3 px-2 text-gray-600">{c.kodeJob}</td>
                  <td className="py-3 px-2 text-gray-600">{c.noHp}</td>
                  <td className="py-3 px-2">
                    <Link
                      href={`/admin/cv/${c.id}`}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                    >
                      Lihat CV
                    </Link>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="7" className="py-8 text-center text-gray-400">
                    Tidak ada data kandidat
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
