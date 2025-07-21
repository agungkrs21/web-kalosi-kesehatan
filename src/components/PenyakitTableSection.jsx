import { FaHeartbeat, FaNotesMedical } from "react-icons/fa";
import { MdOutlineInfo } from "react-icons/md";
import { AiOutlineBulb } from "react-icons/ai";

export default function PenyakitTableSection() {
  const data = [
    { no: 1, nama: "Hipertensi", jumlah: 1322 },
    { no: 2, nama: "Diabetes Mellitus", jumlah: 526 },
    { no: 3, nama: "Gastritis", jumlah: 333 },
    { no: 4, nama: "Rintis Akut", jumlah: 384 },
    { no: 5, nama: "Osteo Artritis", jumlah: 136 },
    { no: 6, nama: "Cough", jumlah: 212 },
    { no: 7, nama: "Febris", jumlah: 216 },
    { no: 8, nama: "Vulnus", jumlah: 192 },
    { no: 9, nama: "ISPA", jumlah: 78 },
    { no: 10, nama: "Diare dan Gastroenteritis", jumlah: 204 },
  ];

  const total = data.reduce((sum, item) => sum + item.jumlah, 0);

  return (
    <section className="max-w-4xl mx-auto mt-8 px-4">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2 text-blue-800">
        <FaHeartbeat className="text-red-500" />
        10 Penyakit Tertinggi Rawat Jalan PKM Kalosi - 2023
      </h2>

      <div className="overflow-x-auto bg-white rounded-xl shadow-md">
        <table className="w-full table-auto border-collapse text-sm sm:text-base">
          <thead className="bg-blue-100 text-blue-800">
            <tr>
              <th className="py-2 px-3 border">No</th>
              <th className="py-2 px-3 border text-left">Jenis Penyakit</th>
              <th className="py-2 px-3 border text-right">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.no} className="hover:bg-blue-50">
                <td className="py-2 px-3 border text-center">{item.no}</td>
                <td className="py-2 px-3 border capitalize">{item.nama}</td>
                <td className="py-2 px-3 border text-right">{item.jumlah.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="font-semibold bg-gray-100">
              <td colSpan={2} className="py-2 px-3 border text-right">
                Jumlah
              </td>
              <td className="py-2 px-3 border text-right">{total.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Sumber dan Analisis */}
      <div className="mt-4 space-y-3 text-gray-700">
        <div className="flex items-start gap-2">
          <MdOutlineInfo className="text-blue-500 mt-1" />
          <p>
            <strong>Sumber:</strong> SP2TP PKM Kalosi
          </p>
        </div>
        <div className="flex items-start gap-2">
          <FaNotesMedical className="text-green-500 mt-1" />
          <p>
            Dari tabel di atas tergambar bahwa <strong>Hipertensi</strong> merupakan penyakit tertinggi dalam kunjungan rawat jalan sebanyak <strong>1.322</strong> kunjungan. Sementara penyakit dengan
            jumlah kunjungan terendah adalah <strong>ISPA</strong> dengan <strong>78 kasus</strong>.
          </p>
        </div>
        <div className="flex items-start gap-2">
          <AiOutlineBulb className="text-yellow-500 mt-1" />
          <p>
            <strong>Saran:</strong> Diperlukan program edukasi dan intervensi berkelanjutan untuk mencegah dan mengelola hipertensi melalui: pemeriksaan tekanan darah rutin, promosi gaya hidup sehat,
            dan pengawasan konsumsi garam. Perhatian juga perlu diberikan terhadap penyakit menular seperti ISPA agar tidak meningkat.
          </p>
        </div>
      </div>
    </section>
  );
}
