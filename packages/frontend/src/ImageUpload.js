import React, {useRef, useState} from 'react';
import './CSS Files/ImageUpload.css';

const ImageUpload = ({ loading, setLoading }) => {
        const [file, setFile] = useState(null);
        const fileInputRef = useRef(null);

        //setLoading(true);

        const handleFileChange = (e) => {
            setFile(e.target.files[0]);
        };

        const handleFileUpload = async () => {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const token = localStorage.getItem('token');
                console.log(token);
                await fetch('http://localhost:8000/upload', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const userConfirmed = window.confirm('File uploaded successfully. Do you want to process this data?');

                if (userConfirmed) {
                    const token = localStorage.getItem('token');

                    const requestOptions = {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                        },
                    };
                    setLoading(true);
                    fetch('http://localhost:8000/process', requestOptions)
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! Status: ${response.status}`);
                            }
                            setLoading(false);
                            return response.json();
                        })
                        .then((data) => {
                            console.log('File uploaded successfully:', data);

                        })
                        .catch((error) => {
                            console.error('Error uploading file:', error.message);
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