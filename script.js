const bidangList = [
  "Umum",
  "Teknis Pendataan dan Manajemen Lapangan",
  "Administrasi Hubungan masyarakat dan Manajemen Resiko",
  "Pengolahan, Teknologi Informasi dan Diseminasi",
];

const tableBody = document.getElementById("tableBody");

// Generate 4 Baris Berdasarkan Daftar Bidang
bidangList.forEach((namaBidang, index) => {
  const rowId = index + 1;
  const row = document.createElement("tr");

  row.innerHTML = `
        <td align="center">${rowId}</td>
        <td>${namaBidang}</td>
        <td>
            <div id="cont-kegiatan-${rowId}" class="cell-wrapper">
                <textarea placeholder="Input poin ....."></textarea>
            </div>
            <button class="btn-add" onclick="addActivityGroup(${rowId})"><strong>+</strong> Tambah poin</button>
        </td>
        <td>
            <div id="cont-status-${rowId}" class="cell-wrapper">
                <div class="status-group">
                    <label><input type="checkbox"> Belum</label>
                    <label><input type="checkbox"> Proses</label>
                    <label><input type="checkbox"> Selesai</label>
                </div>
            </div>
        </td>
        <td>
            <div id="cont-rencana-${rowId}" class="cell-wrapper">
                <textarea placeholder="Input poin ....."></textarea>
            </div>
            <button class="btn-add" onclick="addPlan(${rowId})"><strong>+</strong> Tambah poin</button>
        </td>
    `;
  tableBody.appendChild(row);
});

// Fungsi Tambah Kegiatan & Status Secara Sinkron
function addActivityGroup(id) {
  // Tambah Textarea
  const kegCont = document.getElementById(`cont-kegiatan-${id}`);
  const txt = document.createElement("textarea");
  txt.placeholder = "Input poin .....";
  kegCont.appendChild(txt);

  // Tambah Status Group agar sejajar
  const statCont = document.getElementById(`cont-status-${id}`);
  const div = document.createElement("div");
  div.className = "status-group";
  div.innerHTML = `
        <label><input type="checkbox"> Belum</label>
        <label><input type="checkbox"> Proses</label>
        <label><input type="checkbox"> Selesai</label>
    `;
  statCont.appendChild(div);
}

// Fungsi Tambah Rencana (Tanpa Status)
function addPlan(id) {
  const renCont = document.getElementById(`cont-rencana-${id}`);
  const txt = document.createElement("textarea");
  txt.placeholder = "Input poin .....";
  renCont.appendChild(txt);
}

function saveAll() {
  alert("Data berhasil disimpan ke sistem!");
}

// ... kode bidang sebelumnya ...

let attachmentCount = 1;

// Fungsi untuk menambah poin lampiran baru
function addAttachmentPoint() {
  attachmentCount++;
  const container = document.getElementById("attachment-container");
  const div = document.createElement("div");
  div.className = "attachment-item";
  div.id = `attach-${attachmentCount}`;

  div.innerHTML = `
        <input type="text" class="input-poin" placeholder="Nama Poin/Keterangan Lampiran">
        <div class="image-upload-wrapper">
            <input type="file" accept="image/*" multiple onchange="previewImages(event, 'preview-${attachmentCount}')">
            <div class="image-preview" id="preview-${attachmentCount}"></div>
        </div>
    `;
  container.appendChild(div);
}

// Fungsi untuk preview gambar (mendukung multiple files)
function previewImages(event, previewId) {
  const previewContainer = document.getElementById(previewId);
  previewContainer.innerHTML = ""; // Bersihkan preview lama

  const files = event.target.files;

  if (files) {
    [...files].forEach((file) => {
      const reader = new FileReader();
      reader.onload = function (e) {
        const img = document.createElement("img");
        img.src = e.target.result;
        previewContainer.appendChild(img);
      };
      reader.readAsDataURL(file);
    });
  }
}

// Update fungsi saveAll (opsional)
function saveAll() {
  const kota = document.getElementById("kota").value || "Data";
  alert(`Laporan ${kota} beserta lampiran foto telah siap disimpan!`);
}
// ... kode bidang & lampiran sebelumnya tetap ada ...
async function exportToPDF() {
  const { jsPDF } = window.jspdf;
  // 1. Inisialisasi DOC di awal
  const doc = new jsPDF("p", "mm", "a4");

  const tanggal = document.getElementById("tanggal").value || "-";
  const provinsi = document.getElementById("provinsi").value || "-";
  const kota = document.getElementById("kota").value || "-";

  const newTab = window.open("", "_blank");
  if (!newTab) {
    alert("Mohon izinkan pop-up agar PDF bisa ditampilkan.");
    return;
  }
  newTab.document.write(
    "<html><head><title>Sabar 1,5 jam doang kok...</title></head><body style='font-family:sans-serif; text-align:center; padding-top:50px;'><p>Sedang menyusun laporan resmi... Mohon tunggu.</p></body></html>",
  );

  const printArea = document.createElement("div");
  printArea.style.width = "185mm";
  printArea.style.padding = "12mm";
  printArea.style.backgroundColor = "white";
  printArea.style.fontFamily = "Times New Roman, Times, serif";
  printArea.style.position = "absolute";
  printArea.style.left = "-9999px";

  // Header Dokumen
  printArea.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
            <h2 style="margin: 0; font-size: 16pt;">LAPORAN KEGIATAN SENSUS EKONOMI 2026</h2>
        </div>
        <table style="margin-bottom: 20px; font-weight: bold; font-size: 11pt; border: none; width: auto;">
            <tr>
                <td style="padding: 2px 0; border: none; width: 100px;">TANGGAL</td>
                <td style="padding: 2px 5px; border: none;">:</td>
                <td style="padding: 2px 0; border: none;">${tanggal.toUpperCase()}</td>
            </tr>
            <tr>
                <td style="padding: 2px 0; border: none;">PROVINSI</td>
                <td style="padding: 2px 5px; border: none;">:</td>
                <td style="padding: 2px 0; border: none;">${provinsi.toUpperCase()}</td>
            </tr>
            <tr>
                <td style="padding: 2px 0; border: none;">KOTA</td>
                <td style="padding: 2px 5px; border: none;">:</td>
                <td style="padding: 2px 0; border: none;">${kota.toUpperCase()}</td>
            </tr>
        </table>
    `;

  // 2. Kloning Tabel & Perbaikan Status Box
  const tableOrigin = document
    .getElementById("monitoringTable")
    .cloneNode(true);
  tableOrigin.querySelectorAll("button").forEach((btn) => btn.remove());

  const toAlpha = (num) => String.fromCharCode(97 + num);
  const rows = tableOrigin.querySelectorAll("tbody tr");

  rows.forEach((row) => {
    // 1. Ambil semua textarea dari kolom KEGIATAN (cell index 2)
    const kegiatanTextareas = row.cells[2].querySelectorAll("textarea");
    // 2. Ambil semua grup status dari kolom STATUS (cell index 3)
    const statusGroups = row.cells[3].querySelectorAll(".status-group");

    const listKegiatan = document.createElement("div");
    const listStatus = document.createElement("div");

    // Kita gunakan jumlah textarea sebagai patokan baris
    kegiatanTextareas.forEach((txt, index) => {
      const val = txt.value.trim();

      // Wadah untuk baris Kegiatan
      const kegItem = document.createElement("div");
      kegItem.style.display = "flex";
      kegItem.style.marginBottom = "10px"; // Jarak antar poin
      kegItem.style.minHeight = "45px"; // KUNCI: Tinggi minimal agar sejajar dengan box status

      if (val === "") {
        kegItem.innerText = "-";
      } else {
        kegItem.innerHTML = `
        <span style="width: 20px;">${toAlpha(index)}.</span>
        <span style="flex: 1; word-break: break-word;">${val}</span>`;
      }
      listKegiatan.appendChild(kegItem);

      // Wadah untuk baris Status (Harus sejajar dengan baris kegiatan di atas)
      const statItem = document.createElement("div");
      statItem.style.marginBottom = "10px";
      statItem.style.minHeight = "45px"; // KUNCI: Harus sama dengan minHeight di kegItem
      statItem.style.fontSize = "9pt";

      const currentStatusGroup = statusGroups[index];
      if (currentStatusGroup) {
        const options = ["Belum", "Proses", "Selesai"];
        options.forEach((opt) => {
          const isChecked = Array.from(
            currentStatusGroup.querySelectorAll("label"),
          ).some(
            (l) =>
              l.innerText.trim() === opt && l.querySelector("input").checked,
          );
          const box = isChecked ? "■" : "□";
          const optDiv = document.createElement("div");
          optDiv.innerHTML = `<span style="font-family: DejaVu Sans, Arial;">${box}</span> ${opt}`;
          statItem.appendChild(optDiv);
        });
      } else {
        statItem.innerText = "-";
      }
      listStatus.appendChild(statItem);
    });

    // Terapkan ke sel tabel
    row.cells[2].innerHTML = "";
    row.cells[2].appendChild(listKegiatan);

    row.cells[3].innerHTML = "";
    row.cells[3].appendChild(listStatus);

    // 3. Proses Kolom RENCANA (cell index 4) secara terpisah
    const rencanaTextareas = row.cells[4].querySelectorAll("textarea");
    const listRencana = document.createElement("div");
    const filledRencana = Array.from(rencanaTextareas).filter(
      (t) => t.value.trim() !== "",
    );

    if (filledRencana.length === 0) {
      listRencana.innerText = "-";
    } else {
      rencanaTextareas.forEach((txt, index) => {
        const val = txt.value.trim();
        if (val !== "") {
          const renItem = document.createElement("div");
          renItem.style.display = "flex";
          renItem.style.marginBottom = "8px";
          renItem.innerHTML = `
          <span style="width: 20px;">${toAlpha(index)}.</span>
          <span style="flex: 1; word-break: break-word;">${val}</span>`;
          listRencana.appendChild(renItem);
        }
      });
    }
    row.cells[4].innerHTML = "";
    row.cells[4].appendChild(listRencana);
  });

  tableOrigin.style.width = "100%";
  tableOrigin.style.borderCollapse = "collapse";
  tableOrigin.querySelectorAll("th, td").forEach((cell) => {
    cell.style.border = "1px solid black";
    cell.style.padding = "6px";
    cell.style.fontSize = "10pt";
    cell.style.verticalAlign = "middle"; // RATA TENGAH VERTIKAL
    cell.style.textAlign = "center"; // RATA TENGAH HORIZONTAL
  });
  tableOrigin.querySelectorAll("td").forEach((td) => {
    td.style.textAlign = "left"; // Isi tabel tetap rata kiri
    td.style.verticalAlign = "top"; // Isi tabel mulai dari atas
  });
  const rowsBody = tableOrigin.querySelectorAll("tbody tr");
  rowsBody.forEach((row) => {
    const cellNomor = row.cells[0]; // Kolom index 0 (Nomor)
    if (cellNomor) {
      cellNomor.style.textAlign = "center"; // Horizontal Tengah
      cellNomor.style.verticalAlign = "middle"; // Vertikal Tengah
      cellNomor.style.width = "10mm"; // Opsional: batasi lebar kolom nomor
    }
  });
  printArea.appendChild(tableOrigin);
  document.body.appendChild(printArea);

  try {
    // Render Tabel Utama (Halaman 1)
    const canvas = await html2canvas(printArea, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    doc.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);

    // 3. LOGIKA NATIVE UNTUK FOTO (ANTI TERPOTONG)
    let currentY = imgHeight + 10; // Mulai di bawah tabel
    const margin = 15;
    const maxWidth = 85;
    const maxHeight = 60;
    const gap = 10;
    const pageWidth = doc.internal.pageSize.getWidth(); // Mendapatkan lebar halaman (210mm)
    const centerX = pageWidth / 2; // Titik tengah (105mm)
    // A. TULIS JUDUL BESAR "LAMPIRAN" (SELALU MUNCUL)
    if (currentY > 270) {
      doc.addPage();
      currentY = 20;
    }
    doc.setFont("times", "bold");
    doc.setFontSize(12);
    doc.text("LAMPIRAN", centerX, currentY, { align: "center" });
    currentY += 5;
    const attachmentItems = document.querySelectorAll(".attachment-item");

    for (const item of attachmentItems) {
      const desc = item.querySelector(".input-poin").value || "Dokumentasi";
      const imgs = item.querySelector(".image-preview").querySelectorAll("img");

      if (imgs.length === 0) continue;

      // Cek ruang untuk Judul Lampiran
      if (currentY + 20 > 280) {
        doc.addPage();
        currentY = 20;
      }

      doc.setFont("times", "bold");
      doc.setFontSize(12);

      doc.text(`${desc}`, margin, currentY);
      currentY += 10;

      let currentX = margin;

      for (let i = 0; i < imgs.length; i++) {
        const base64 = imgs[i].src;
        const imgProps = doc.getImageProperties(base64);

        // Hitung Rasio Asli
        let finalWidth = maxWidth;
        let finalHeight = (imgProps.height * maxWidth) / imgProps.width;

        if (finalHeight > maxHeight) {
          finalHeight = maxHeight;
          finalWidth = (imgProps.width * maxHeight) / imgProps.height;
        }

        // Cek ganti baris (setiap 2 foto)
        if (i > 0 && i % 2 === 0) {
          currentX = margin;
          currentY += maxHeight + gap;
        }

        // Cek ganti halaman
        if (currentY + maxHeight > 280) {
          doc.addPage();
          currentY = 20;
          currentX = margin;
          // Tulis ulang judul lampiran di halaman baru jika perlu
          doc.setFont("times", "bold");
          doc.text(`${desc} (Lanjutan)`, margin, currentY);
          currentY += 10;
        }

        // Gambar foto di tengah grid (center alignment)
        const offsetX = (maxWidth - finalWidth) / 2;
        const offsetY = (maxHeight - finalHeight) / 2;

        doc.addImage(
          base64,
          "JPEG",
          currentX + offsetX,
          currentY + offsetY,
          finalWidth,
          finalHeight,
        );

        currentX += maxWidth + gap;
      }
      currentY += maxHeight + gap + 10; // Jarak ke lampiran poin berikutnya
    }

    newTab.location.href = doc.output("bloburl");
  } catch (e) {
    console.error("PDF Error:", e);
    if (newTab) newTab.close();
    alert("Gagal ekspor PDF.");
  } finally {
    if (document.body.contains(printArea)) document.body.removeChild(printArea);
  }
}
