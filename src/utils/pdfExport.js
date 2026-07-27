export const exportBatchesToPDF = (batches) => {
  try {
    const dateStr = new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const metrics = [
      { label: 'Total Pengajuan', value: batches.length },
      {
        label: 'Menunggu Review',
        value: batches.filter((b) => b.status === 'SUBMITTED_TO_STAKEHOLDER').length,
      },
      {
        label: 'Diterima',
        value: batches.filter((b) => b.status === 'ACCEPTED_BY_STAKEHOLDER').length,
      },
      {
        label: 'Ditolak',
        value: batches.filter((b) => b.status === 'REJECTED_BY_STAKEHOLDER').length,
      },
    ]

    const tableRows = batches
      .map(
        (batch) => `
      <tr>
        <td>${new Date(batch.createdAt).toLocaleDateString('id-ID')}</td>
        <td>${batch.batchCode}</td>
        <td>${batch.collector?.companyName || '-'}</td>
        <td>${batch.collector?.address || '-'}</td>
        <td>${getStatusLabel(batch.status)}</td>
      </tr>
    `
      )
      .join('')

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Pengajuan-Kemitraan-Pengepul</title>
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            padding: 20mm;
            color: #3F4945;
            line-height: 1.6;
          }
          h1 {
            color: #004536;
            font-size: 20px;
            margin-bottom: 5px;
          }
          .date {
            color: #6F7975;
            font-size: 12px;
            margin-bottom: 15px;
          }
          hr {
            border: none;
            border-top: 1px solid #BEC9C3;
            margin: 15px 0;
          }
          h2 {
            color: #004536;
            font-size: 14px;
            margin: 15px 0 10px 0;
          }
          .metrics {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
            margin-bottom: 15px;
          }
          .metric {
            padding: 10px;
            border: 1px solid #E2E8F0;
            border-radius: 4px;
            background: #F9F9FF;
          }
          .metric-label {
            font-size: 11px;
            color: #6F7975;
            font-weight: 600;
          }
          .metric-value {
            font-size: 18px;
            color: #004536;
            font-weight: bold;
            margin-top: 5px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
          }
          thead {
            background-color: #F9F9FF;
          }
          th {
            padding: 10px;
            text-align: left;
            font-size: 12px;
            font-weight: 600;
            color: #3F4945;
            border-bottom: 2px solid #BEC9C3;
          }
          td {
            padding: 10px;
            font-size: 11px;
            border-bottom: 1px solid #E2E8F0;
          }
          tr:hover {
            background-color: #F9F9FF;
          }
          .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #BEC9C3;
            font-size: 10px;
            color: #999;
            text-align: center;
          }
          @media print {
            body {
              padding: 0;
            }
            tr {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <h1>LAPORAN PENGAJUAN KEMITRAAN PENGEPUL</h1>
        <div class="date">Tanggal: ${dateStr}</div>
        <hr>

        <h2>RINGKASAN METRIK</h2>
        <div class="metrics">
          ${metrics.map((m) => `<div class="metric"><div class="metric-label">${m.label}</div><div class="metric-value">${m.value}</div></div>`).join('')}
        </div>
        <hr>

        <h2>DAFTAR PENGAJUAN</h2>
        <table>
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Batch Code</th>
              <th>Pengepul</th>
              <th>Wilayah</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>

        <div class="footer">
          © 2026 Veridian Energy. Sustainable Luxury in Waste Management.
        </div>
      </body>
      </html>
    `

    const printWindow = window.open('', '', 'height=600,width=800')
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.print()
  } catch (error) {
    console.error('Failed to export PDF:', error)
    throw error
  }
}

const getStatusLabel = (status) => {
  const statusMap = {
    SUBMITTED_TO_STAKEHOLDER: 'Menunggu Review',
    LAB_REVIEW: 'Lab Review',
    ACCEPTED_BY_STAKEHOLDER: 'Diterima',
    REJECTED_BY_STAKEHOLDER: 'Ditolak',
  }
  return statusMap[status] || status
}
