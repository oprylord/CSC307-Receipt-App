import React, {useRef, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './CSS Files/ImageUpload.css';

const ImageUpload = () => {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false); // New loading state
    const fileInputRef = useRef(null);

    const navigate = useNavigate();

    const handleFileChange = (e) => {
            setFile(e.target.files[0]);
        };

    const handleFileUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            await fetch('https://quicksplit.azurewebsites.net/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            const userConfirmed = window.confirm('File uploaded successfully. Do you want to process this data?');
            if (userConfirmed) {
                setLoading(true);
                const token = localStorage.getItem('token');
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                    },
                };
                fetch('https://quicksplit.azurewebsites.net/process', requestOptions)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then((data) => {
                        console.log('File processed successfully:', data);
                    })
                    .catch((error) => {
                        console.error('Error uploading file:', error.message);
                    })
                    .finally(() => {
                        setLoading(false);
                        navigate("/home");
                    });
            } else {
                setLoading(false);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            setLoading(false);
        }
        console.log('File uploaded successfully');
    };

        const handleDragOver = (e) => {
            e.preventDefault();
        };

        const handleDrop = (e) => {
            e.preventDefault();

            const droppedFile = e.dataTransfer.files[0];
            setFile(droppedFile);
        };

        const handleDropZoneClick = () => {
            fileInputRef.current.click();
        };

        return (
            <div className="file-upload-container">
                {loading && (
                    <div className="loading-overlay">
                        <div className="loading-spinner"></div>
                        <p>Loading...</p>
                    </div>
                )}
                <div
                    className="drop-zone"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onClick={handleDropZoneClick}
                >
                    <p>Drag & Drop a file here or click to select a file</p>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        style={{display: 'none'}}
                        ref={fileInputRef}
                    />
                </div>
                {file && (
                    <div>
                        <p>Selected File: {file.name}</p>
                        <button className={'upload'} onClick={handleFileUpload}>Upload</button>
                    </div>
                )}
            </div>
        );
}

export default ImageUpload;
