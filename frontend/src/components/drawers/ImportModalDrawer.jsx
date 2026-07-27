import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { parseCSVText } from '../../utils/dataExportImport';

export const ImportModalDrawer = ({ targetType = 'clients' }) => {
  const { 
    setActiveDrawer, 
    importClientsData, 
    importPetsData, 
    importProductsData, 
    importFullBackup,
    clients,
    pets,
    visits,
    products,
    invoices,
    settings 
  } = useApp();

  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('csv');

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const isJson = file.name.endsWith('.json');
    setFileType(isJson ? 'json' : 'csv');

    const reader = new FileReader();
    reader.onload = (event) => {
      setFileContent(event.target.result);
    };
    reader.readAsText(file);
  };

  const handleExecuteImport = () => {
    if (!fileContent) return alert('Please select a file to import.');

    try {
      if (fileType === 'json') {
        const jsonData = JSON.parse(fileContent);
        importFullBackup(jsonData);
        setActiveDrawer(null);
        return;
      }

      const rows = parseCSVText(fileContent);
      if (!rows.length) return alert('CSV file is empty or could not be parsed.');

      if (targetType === 'clients') {
        importClientsData(rows);
      } else if (targetType === 'pets') {
        importPetsData(rows);
      } else if (targetType === 'products') {
        importProductsData(rows);
      } else {
        importClientsData(rows);
      }

      setActiveDrawer(null);
    } catch (err) {
      alert(`Import error: ${err.message}`);
    }
  };

  return (
    <div className="drawer-backdrop" onClick={() => setActiveDrawer(null)}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <div>
            <h3>Import Data ({targetType.toUpperCase()})</h3>
            <p>Upload CSV or JSON files from another clinic system to import data.</p>
          </div>
          <button className="icon-btn" onClick={() => setActiveDrawer(null)}>
            <X size={18} />
          </button>
        </div>

        <div className="drawer-body">
          <div className="upload-dropzone">
            <Upload size={32} className="text-teal" />
            <p className="font-semibold margin-top-xs">Click to browse or drop CSV / JSON file</p>
            <span className="text-xs text-muted">Supports CSV rows or Full Petution JSON backups</span>
            <input type="file" accept=".csv,.json" onChange={handleFileUpload} className="file-input-hidden" />
          </div>

          {fileName && (
            <div className="file-preview-card card margin-top-md flex align-center gap-md">
              <FileText size={24} className="text-teal" />
              <div className="flex-1">
                <div className="font-semibold text-sm">{fileName}</div>
                <div className="text-xs text-muted">Format: {fileType.toUpperCase()}</div>
              </div>
              <CheckCircle2 size={18} className="text-green" />
            </div>
          )}

          <div className="margin-top-md card info-card">
            <h5 className="font-semibold">Sample CSV Column Headers</h5>
            <p className="text-xs text-muted margin-top-xs">
              {targetType === 'clients' && 'name, phone, governorate, district, street, tags'}
              {targetType === 'pets' && 'name, species, breed, ageValue, ageUnit, vaccinated'}
              {targetType === 'products' && 'name, type, pricePerUnit, costPerUnit, quantity'}
            </p>
          </div>

          <div className="drawer-footer margin-top-auto">
            <button className="btn-secondary" onClick={() => setActiveDrawer(null)}>
              Cancel
            </button>
            <button className="btn-primary" onClick={handleExecuteImport} disabled={!fileContent}>
              Import Records
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .upload-dropzone {
          border: 2px dashed var(--border-card);
          border-radius: var(--radius-md);
          padding: 32px;
          text-align: center;
          background: #f8fafc;
          position: relative;
          cursor: pointer;
          transition: border 0.15s ease;
        }

        .upload-dropzone:hover {
          border-color: var(--primary-teal);
        }

        .file-input-hidden {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
        }

        .file-preview-card {
          padding: 12px 16px;
        }

        .info-card {
          background: #f1f5f9;
          padding: 12px 16px;
        }
      `}</style>
    </div>
  );
};
