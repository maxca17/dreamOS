import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import '../css/components/decksandmemosmodal.css';

const InvestorUpdatesModal = ({ companyName, onClose }) => {
  const [updates, setUpdates] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);

  const fetchUpdates = useCallback(async () => {
    if (!companyName) return;
    const { data, error } = await supabase
      .from('companies')
      .select('investor_updates')
      .eq('company_name', companyName)
      .single();

    if (error) {
      console.error('Error fetching investor updates:', error);
      return;
    }

    setUpdates(Array.isArray(data?.investor_updates) ? data.investor_updates : []);
  }, [companyName]);

  useEffect(() => {
    fetchUpdates();
  }, [companyName, fetchUpdates]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileToUpload(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!fileToUpload || !companyName) return;
    setUploading(true);

    // Replace spaces in companyName with underscores to prevent invalid keys
    const safeCompanyName = companyName.replace(/\s+/g, '_');

    // Sanitize the file name to remove invalid characters
    const originalName = fileToUpload.name;
    const sanitizedFileName = originalName.replace(/[^A-Za-z0-9._-]/g, '_');

    const fileName = `${Date.now()}_${sanitizedFileName}`;
    const filePath = `${safeCompanyName}/updates/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('companies')
      .upload(filePath, fileToUpload);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      setUploading(false);
      return;
    }

    const { data: { publicUrl }, error: publicUrlError } = supabase.storage
      .from('companies')
      .getPublicUrl(filePath);

    if (publicUrlError) {
      console.error('Error retrieving public URL:', publicUrlError);
      setUploading(false);
      return;
    }

    const newUpdate = {
      id: fileName,
      update_name: originalName,
      update_url: publicUrl,
      update_type: fileToUpload.type,
      upload_date: new Date().toISOString()
    };

    const updatedUpdates = [...updates, newUpdate];

    const { error: updateError } = await supabase
      .from('companies')
      .update({ investor_updates: updatedUpdates })
      .eq('company_name', companyName);

    if (updateError) {
      console.error('Error updating investor updates:', updateError);
      setUploading(false);
      return;
    }

    setUpdates(updatedUpdates);
    setFileToUpload(null);
    setUploading(false);
  };

  const handleDelete = async (updateId, updateUrl) => {
    if (typeof updateUrl !== 'string') {
      console.error('Invalid update URL:', updateUrl);
      return;
    }

    const parts = updateUrl.split('/companies/');
    if (parts.length < 2) {
      console.error('Invalid update URL structure:', updateUrl);
      return;
    }

    const updatePath = parts[1];

    const { error: deleteStorageError } = await supabase.storage
      .from('companies')
      .remove([updatePath]);

    if (deleteStorageError) {
      console.error('Error deleting file from storage:', deleteStorageError);
      return;
    }

    const updatedUpdates = updates.filter((u) => u.id !== updateId);

    const { error: updateError } = await supabase
      .from('companies')
      .update({ investor_updates: updatedUpdates })
      .eq('company_name', companyName);

    if (updateError) {
      console.error('Error updating investor updates:', updateError);
      return;
    }

    setUpdates(updatedUpdates);
  };

  return (
    <div className="decks-memos-modal-overlay">
      <div className="decks-memos-modal-content">
        <button className="decks-memos-modal-close" onClick={onClose}>×</button>
        <h2>Investor Updates for {companyName}</h2>

        <div className="upload-section">
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload} disabled={!fileToUpload || uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>

        <div className="files-list">
          <h3>Uploaded Updates</h3>
          {updates.length === 0 && <p>No updates uploaded yet.</p>}
          {updates.map((update) => (
            <div key={update.id} className="file-item">
              <a href={update.update_url} target="_blank" rel="noopener noreferrer">{update.update_name}</a>
              <span className="file-date">
                {new Date(update.upload_date).toLocaleDateString()}
              </span>
              <button
                className="delete-button"
                onClick={() => handleDelete(update.id, update.update_url)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InvestorUpdatesModal;
