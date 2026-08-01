export const exportLabReportToPDF = (batches = [], kpis = {}) => {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const batchesWithLab = batches.filter(b => b.labResult)
  
  const tableRows = batchesWithLab.map(batch => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px;">${batch.batchCode}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px;">${new Date(batch.createdAt).toLocaleDateString('id-ID')}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px;">${batch.collector?.companyName || '-'}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px; font-weight: 600;">${batch.labResult?.grade || '-'}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px;">${batch.labResult?.waterContentPercent?.toFixed(2) || '-'}%</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px;">${batch.labResult?.ffaPercent?.toFixed(2) || '-'}%</td>
      <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; font-size: 14px;">${batch.labResult?.impurityPercent?.toFixed(2) || '-'}%</td>
    </tr>
  `).join('')

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Lab Report - ${currentDate}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #1e293b;
          line-height: 1.6;
        }
        .container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px;
        }
        .header {
          border-bottom: 3px solid #004536;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #004536;
          font-size: 28px;
          margin-bottom: 5px;
        }
        .header .meta {
          color: #64748b;
          font-size: 13px;
        }
        .kpi-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        .kpi-card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
        }
        .kpi-card .label {
          color: #64748b;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }
        .kpi-card .value {
          color: #004536;
          font-size: 32px;
          font-weight: 700;
        }
        .table-section {
          margin-top: 30px;
        }
        .table-section h2 {
          color: #051c37;
          font-size: 18px;
          margin-bottom: 15px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 10px;
        }
        th {
          background: #f1f5f9;
          color: #475569;
          padding: 12px;
          text-align: left;
          font-weight: 600;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 2px solid #e2e8f0;
        }
        td {
          padding: 12px;
          border-bottom: 1px solid #e2e8f0;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e2e8f0;
          color: #64748b;
          font-size: 12px;
          text-align: right;
        }
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          .container {
            padding: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Laporan Analisis Uji Laboratorium</h1>
          <div class="meta">Dihasilkan pada: ${currentDate}</div>
        </div>

        <div class="kpi-section">
          <div class="kpi-card">
            <div class="label">Total Batch</div>
            <div class="value">${batches.length}</div>
          </div>
          <div class="kpi-card">
            <div class="label">Batch dengan Lab Result</div>
            <div class="value">${batchesWithLab.length}</div>
          </div>
          <div class="kpi-card">
            <div class="label">Grade A</div>
            <div class="value">${batches.filter(b => b.labResult?.grade === 'A').length}</div>
          </div>
          <div class="kpi-card">
            <div class="label">Grade B</div>
            <div class="value">${batches.filter(b => b.labResult?.grade === 'B').length}</div>
          </div>
          <div class="kpi-card">
            <div class="label">Reject</div>
            <div class="value">${batches.filter(b => b.labResult?.grade === 'REJECT').length}</div>
          </div>
        </div>

        <div class="table-section">
          <h2>Detail Batch Analisis</h2>
          <table>
            <thead>
              <tr>
                <th>ID Batch</th>
                <th>Tanggal Proses</th>
                <th>Sumber Collector</th>
                <th>Grade</th>
                <th>Moisture (%)</th>
                <th>FFA (%)</th>
                <th>Impurity (%)</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>

        <div class="footer">
          <p>© 2024 Sistem Manajemen Uji Laboratorium. Dokumen ini dibuat secara otomatis.</p>
        </div>
      </div>
    </body>
    </html>
  `

  const printWindow = window.open('', '', 'height=600,width=800')
  printWindow.document.write(htmlContent)
  printWindow.document.close()
  printWindow.print()
}
