"use client";
import {
  formatDateJP,
  formatDateShortJP,
  calculateAge,
  genderToJP,
  maritalStatusToJP,
  religionToJP,
  relationToJP,
  boolToJP,
  livingToJP,
  jobStatusToJP,
} from "@/lib/cvHelpers";

export default function CVTemplate({ data }) {
  if (!data) return null;

  const age = calculateAge(data.tanggalLahir);

  return (
    <div className="cv-container bg-white p-6 max-w-[210mm] mx-auto" id="cv-print-area">
      {/* Header */}
      <h2 className="text-center text-lg font-bold mb-4 border-b-2 border-black pb-2">
        履歴書 (CV)
      </h2>

      {/* Basic Info Table */}
      <table className="cv-table mb-4">
        <tbody>
          <tr>
            <td className="font-bold bg-gray-100 w-[150px]">氏名 (nama lengkap)</td>
            <td colSpan="3" className="text-lg font-bold">{data.namaLengkap}</td>
            <td className="font-bold bg-gray-100 w-[100px]">読み方</td>
            <td>{data.namaPanggilan}</td>
          </tr>
          <tr>
            <td className="font-bold bg-gray-100">出身地 (tempat lahir)</td>
            <td>{data.tempatLahir}</td>
            <td className="font-bold bg-gray-100">生年月日</td>
            <td>{formatDateJP(data.tanggalLahir)}</td>
            <td className="font-bold bg-gray-100">年齢</td>
            <td>{age} 歳</td>
          </tr>
          <tr>
            <td className="font-bold bg-gray-100">性別</td>
            <td>{genderToJP(data.jenisKelamin)}</td>
            <td className="font-bold bg-gray-100">婚姻</td>
            <td>{maritalStatusToJP(data.statusPernikahan)}</td>
            <td className="font-bold bg-gray-100">血液型</td>
            <td>{data.golonganDarah}</td>
          </tr>
          <tr>
            <td className="font-bold bg-gray-100">宗教 (agama)</td>
            <td>{religionToJP(data.agama)}</td>
            <td className="font-bold bg-gray-100">身長</td>
            <td>{data.tinggiBadan} cm</td>
            <td className="font-bold bg-gray-100">体重</td>
            <td>{data.beratBadan} kg</td>
          </tr>
          <tr>
            <td className="font-bold bg-gray-100">電話番号 (NO HP)</td>
            <td colSpan="2">{data.noHp}</td>
            <td className="font-bold bg-gray-100">メールアドレス</td>
            <td colSpan="2">{data.email}</td>
          </tr>
          <tr>
            <td className="font-bold bg-gray-100">住所 (alamat)</td>
            <td colSpan="5">{data.alamatLengkap}</td>
          </tr>
          <tr>
            <td className="font-bold bg-gray-100">パスポート</td>
            <td>{data.memilikiPaspor === "YA" ? `有 (${data.nomorPaspor})` : "無"}</td>
            <td className="font-bold bg-gray-100">有効期限</td>
            <td>{data.masaBerlakuPaspor ? formatDateJP(data.masaBerlakuPaspor) : "-"}</td>
            <td className="font-bold bg-gray-100">利き手</td>
            <td>{data.dominanTangan === "KANAN" ? "右" : "左"}</td>
          </tr>
        </tbody>
      </table>

      {/* Health Info */}
      <table className="cv-table mb-4">
        <tbody>
          <tr>
            <td className="font-bold bg-gray-100 w-[100px]">喫煙</td>
            <td className="w-[80px]">{boolToJP(data.merokok)}{data.merokok === "YA" && data.jumlahRokok ? ` (${data.jumlahRokok}本)` : ""}</td>
            <td className="font-bold bg-gray-100 w-[100px]">飲酒</td>
            <td className="w-[80px]">{boolToJP(data.minumAlkohol)}</td>
            <td className="font-bold bg-gray-100 w-[100px]">タトゥー</td>
            <td className="w-[80px]">{boolToJP(data.tato)}</td>
            <td className="font-bold bg-gray-100 w-[100px]">重病</td>
            <td>{boolToJP(data.penyakitBerat)}{data.penyakitBerat === "YA" ? ` (${data.namaPenyakit})` : ""}</td>
          </tr>
          <tr>
            <td className="font-bold bg-gray-100">アレルギー</td>
            <td colSpan="3">{boolToJP(data.alergi)}{data.alergi === "YA" ? ` (${data.namaAlergi})` : ""}</td>
            <td className="font-bold bg-gray-100">色覚</td>
            <td colSpan="3">{data.butaWarna === "TIDAK" ? "正常" : "色弱"}</td>
          </tr>
        </tbody>
      </table>

      {/* Education */}
      <h3 className="font-bold text-sm mb-2 mt-4">学歴 (Riwayat Pendidikan)</h3>
      <table className="cv-table mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="w-[40px]">No</th>
            <th>学校名</th>
            <th className="w-[100px]">入学</th>
            <th className="w-[100px]">卒業</th>
            <th className="w-[120px]">専攻</th>
          </tr>
        </thead>
        <tbody>
          {data.sdNama && (
            <tr>
              <td>1</td>
              <td>{data.sdNama}</td>
              <td>{formatDateShortJP(data.sdMasuk)}</td>
              <td>{formatDateShortJP(data.sdLulus)}</td>
              <td>-</td>
            </tr>
          )}
          {data.smpNama && (
            <tr>
              <td>2</td>
              <td>{data.smpNama}</td>
              <td>{formatDateShortJP(data.smpMasuk)}</td>
              <td>{formatDateShortJP(data.smpLulus)}</td>
              <td>-</td>
            </tr>
          )}
          {data.smaNama && (
            <tr>
              <td>3</td>
              <td>{data.smaNama}</td>
              <td>{formatDateShortJP(data.smaMasuk)}</td>
              <td>{formatDateShortJP(data.smaLulus)}</td>
              <td>{data.smaJurusan || "-"}</td>
            </tr>
          )}
          {data.univNama && (
            <tr>
              <td>4</td>
              <td>{data.univNama}</td>
              <td>{formatDateShortJP(data.univMasuk)}</td>
              <td>{formatDateShortJP(data.univLulus)}</td>
              <td>{data.univJurusan || "-"}</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Work History */}
      <h3 className="font-bold text-sm mb-2">職歴 (Riwayat Pekerjaan)</h3>
      <table className="cv-table mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="w-[40px]">No</th>
            <th>会社名</th>
            <th className="w-[90px]">入社</th>
            <th className="w-[90px]">退社</th>
            <th className="w-[80px]">雇用形態</th>
            <th>業務内容</th>
          </tr>
        </thead>
        <tbody>
          {data.pekerjaan?.filter((p) => p.perusahaan).map((p, idx) => (
            <tr key={idx}>
              <td>{idx + 1}</td>
              <td>{p.perusahaan}</td>
              <td>{formatDateShortJP(p.masuk)}</td>
              <td>{formatDateShortJP(p.keluar)}</td>
              <td className="text-xs">{jobStatusToJP(p.status)}</td>
              <td className="text-xs">{p.uraian}</td>
            </tr>
          ))}
          {(!data.pekerjaan || data.pekerjaan.filter((p) => p.perusahaan).length === 0) && (
            <tr><td colSpan="6" className="text-center text-gray-400">なし</td></tr>
          )}
        </tbody>
      </table>

      {/* Family */}
      <h3 className="font-bold text-sm mb-2">家族構成 (Data Keluarga)</h3>
      <table className="cv-table mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th>続柄</th>
            <th>氏名</th>
            <th className="w-[50px]">年齢</th>
            <th>職業</th>
            <th className="w-[90px]">月収</th>
            <th className="w-[50px]">同居</th>
          </tr>
        </thead>
        <tbody>
          {data.keluarga?.filter((k) => k.nama).map((k, idx) => (
            <tr key={idx}>
              <td>{relationToJP(k.hubungan)}</td>
              <td>{k.nama}</td>
              <td>{k.usia}</td>
              <td>{k.pekerjaan}</td>
              <td>{k.gaji}</td>
              <td className="text-center">{livingToJP(k.tinggalBersama)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Motivation Section */}
      <h3 className="font-bold text-sm mb-2">志望理由・自己PR</h3>
      <table className="cv-table mb-4">
        <tbody>
          <tr>
            <td className="font-bold bg-gray-100 w-[180px] align-top">長所 (kelebihan)</td>
            <td className="whitespace-pre-wrap text-xs">{data.kelebihan}</td>
          </tr>
          <tr>
            <td className="font-bold bg-gray-100 align-top">短所 (kekurangan)</td>
            <td className="whitespace-pre-wrap text-xs">{data.kekurangan}</td>
          </tr>
          <tr>
            <td className="font-bold bg-gray-100 align-top">来日理由 (alasan ke Jepang)</td>
            <td className="whitespace-pre-wrap text-xs">{data.alasanKeJepang}</td>
          </tr>
          <tr>
            <td className="font-bold bg-gray-100 align-top">職業希望理由</td>
            <td className="whitespace-pre-wrap text-xs">{data.alasanMelamarBidang}</td>
          </tr>
          {data.alasanKaigofukushishi && (
            <tr>
              <td className="font-bold bg-gray-100 align-top">介護福祉士志望理由</td>
              <td className="whitespace-pre-wrap text-xs">{data.alasanKaigofukushishi}</td>
            </tr>
          )}
          <tr>
            <td className="font-bold bg-gray-100 align-top">将来の夢 (impian)</td>
            <td className="whitespace-pre-wrap text-xs">{data.impianMasaDepan}</td>
          </tr>
        </tbody>
      </table>

      {/* Additional Info */}
      <table className="cv-table mb-4">
        <tbody>
          <tr>
            <td className="font-bold bg-gray-100 w-[180px]">希望滞在期間</td>
            <td>{data.lamaInginTinggal}</td>
            <td className="font-bold bg-gray-100 w-[180px]">日本語学習期間</td>
            <td>{data.lamaBelajarBahasaJepang}</td>
          </tr>
          <tr>
            <td className="font-bold bg-gray-100">趣味 (hobi)</td>
            <td>{data.hobi}</td>
            <td className="font-bold bg-gray-100">渡航歴</td>
            <td>{data.pernahKeJepang === "YA" ? `有 (${data.keperluanApa})` : "無"}</td>
          </tr>
        </tbody>
      </table>

      {/* Emergency Contact */}
      <table className="cv-table">
        <tbody>
          <tr>
            <td className="font-bold bg-gray-100 w-[180px]">緊急連絡先</td>
            <td>{data.nomorDarurat}</td>
            <td className="font-bold bg-gray-100">氏名</td>
            <td>{data.namaPemilikDarurat}</td>
            <td className="font-bold bg-gray-100">続柄</td>
            <td>{data.hubunganDarurat}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
