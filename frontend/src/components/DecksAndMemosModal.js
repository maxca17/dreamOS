import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import '../css/components/decksandmemosmodal.css';

const DecksAndMemosModal = ({ companyName, onClose }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [fileToUpload, setFileToUpload] = useState(null);

  // For renaming a file
  const [fileBeingEdited, setFileBeingEdited] = useState(null);
  const [newFileName, setNewFileName] = useState('');

  const fetchFiles = useCallback(async () => {
    if (!companyName) return;
    const { data, error } = await supabase
      .from('companies')
      .select('files')
      .eq('company_name', companyName)
      .single();

    if (error) {
      console.error('Error fetching company files:', error);
      return;
    }

    setFiles(Array.isArray(data?.files) ? data.files : []);
  }, [companyName]);

  useEffect(() => {
    fetchFiles();
  }, [companyName, fetchFiles]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileToUpload(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!fileToUpload || !companyName) return;
    setUploading(true);

    const fileName = `${Date.now()}_${fileToUpload.name}`;
    const filePath = `${companyName}/docs/${fileName}`;

    // Upload file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('companies')
      .upload(filePath, fileToUpload);

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      setUploading(false);
      return;
    }

    // Retrieve the public URL of the uploaded file
    const {
      data: { publicUrl },
      error: publicUrlError,
    } = supabase.storage.from('companies').getPublicUrl(filePath);

    if (publicUrlError) {
      console.error('Error retrieving public URL:', publicUrlError);
      setUploading(false);
      return;
    }

    const newFile = {
      id: fileName,
      file_name: fileToUpload.name,
      file_url: publicUrl,
      file_type: fileToUpload.type,
      upload_date: new Date().toISOString(),
    };

    const updatedFiles = [...files, newFile];

    // Update the database with the new file list
    const { error: updateError } = await supabase
      .from('companies')
      .update({ files: updatedFiles })
      .eq('company_name', companyName);

    if (updateError) {
      console.error('Error updating company files:', updateError);
      setUploading(false);
      return;
    }

    // Clear the file input
    setFiles(updatedFiles);
    setFileToUpload(null);
    setUploading(false);
  };

  const handleDelete = async (fileId, fileUrl) => {
    if (typeof fileUrl !== 'string') {
      console.error('Invalid file URL:', fileUrl);
      return;
    }

    // Ensure the URL structure is as expected
    const parts = fileUrl.split('/companies/');
    if (parts.length < 2) {
      console.error('Invalid file URL structure:', fileUrl);
      return;
    }

    const filePath = parts[1]; // everything after /companies/

    // Delete the file from storage
    const { error: deleteStorageError } = await supabase.storage
      .from('companies')
      .remove([filePath]);

    if (deleteStorageError) {
      console.error('Error deleting file from storage:', deleteStorageError);
      return;
    }

    // Remove the file from the array and update DB
    const updatedFiles = files.filter((f) => f.id !== fileId);

    const { error: updateError } = await supabase
      .from('companies')
      .update({ files: updatedFiles })
      .eq('company_name', companyName);

    if (updateError) {
      console.error('Error updating company files:', updateError);
      return;
    }

    setFiles(updatedFiles);
  };

  // ---- NEW METHODS FOR RENAMING FILES ----

  // Trigger rename mode for a specific file
  const handleEdit = (file) => {
    setFileBeingEdited(file.id);
    setNewFileName(file.file_name);
  };

  // Save the new file name
  const handleSave = async (file) => {
    if (!newFileName.trim()) return;

    // Update the file name in the local files array
    const updatedFiles = files.map((f) =>
      f.id === file.id ? { ...f, file_name: newFileName } : f
    );

    // Update in Supabase
    const { error: renameError } = await supabase
      .from('companies')
      .update({ files: updatedFiles })
      .eq('company_name', companyName);

    if (renameError) {
      console.error('Error updating file name:', renameError);
      return;
    }

    // Update local state
    setFiles(updatedFiles);
    setFileBeingEdited(null);
    setNewFileName('');
  };

  // Cancel rename
  const handleCancel = () => {
    setFileBeingEdited(null);
    setNewFileName('');
  };

  return (
    <div className="decks-memos-modal-overlay">
      <div className="decks-memos-modal-content">
        <button className="decks-memos-modal-close" onClick={onClose}>×</button>
        <h2>Decks and Memos for {companyName}</h2>

        <div className="upload-section">
          <input type="file" onChange={handleFileChange} />
          <button onClick={handleUpload} disabled={!fileToUpload || uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>

        <div className="files-list">
          <h3>Uploaded Files</h3>
          {files.length === 0 && <p>No files uploaded yet.</p>}
          {files.map((file) => (
            <div key={file.id} className="file-item">
              {/* If this file is being edited, show input. Otherwise, show the link. */}
              {fileBeingEdited === file.id ? (
                <div className="rename-section">
                  <input
                    type="text"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                  />
                  <button onClick={() => handleSave(file)}>Save</button>
                  <button onClick={handleCancel}>Cancel</button>
                </div>
              ) : (
                <>
                  <a
                    href={file.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {file.file_name}
                  </a>
                  <button className="edit-button" onClick={() => handleEdit(file)}>
                    Rename
                  </button>
                </>
              )}

              <span className="file-date">
                {new Date(file.upload_date).toLocaleDateString()}
              </span>

              <button
                className="delete-button"
                onClick={() => handleDelete(file.id, file.file_url)}
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

export default DecksAndMemosModal;
