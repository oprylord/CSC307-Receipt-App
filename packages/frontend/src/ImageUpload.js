import React, {useRef, useState} from 'react';
import axios from 'axios';
import './CSS Files/ImageUpload.css';

const ImageUpload = () => {
        const [file, setFile] = useState(null);
        const fileInputRef = useRef(null);

        const handleFileChange = (e) => {
            setFile(e.target.files[0]);
        };

        const handleFileUpload = async () => {
            const formData = new FormData();
            formData.append('file', file);

            try {
                await axios.post('http://localhost:8000/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                const userConfirmed = window.confirm('File uploaded successfully. Do you want to process this data?');

                if (userConfirmed) {
                    fetch(`http://localhost:8000/process`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! Status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then(data => {
                            console.log('JSON data saved to main.json');
                        })
                        .catch(error => {
                            console.error('Error calling /process:', error.message);
                        });
                }
            } catch (error) {
                console.error('Error uploading file:', error);
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