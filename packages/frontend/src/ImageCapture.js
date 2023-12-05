import React, { useRef, useState } from 'react';
import axios from 'axios';
import './CSS Files/ImageCapture.css';


const ImageCapture = () => {
    const [image, setImage] = useState(null);
    const [isWebcamActive, setIsWebcamActive] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [file, setFile] = useState(null);



    const captureImage = () => {
        const context = canvasRef.current.getContext('2d');
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, videoRef.current.videoWidth, videoRef.current.videoHeight);
        const imageDataUrl = canvasRef.current.toDataURL('image/png');
        setImage(imageDataUrl);
        setIsWebcamActive(false);
    };


    const handleFileUpload = async () => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem('token');
            console.log(token);
            await fetch('https://quicksplit.azurewebsites.net/upload', {
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

                fetch('https://quicksplit.azurewebsites.net/process', requestOptions)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! Status: ${response.status}`);
                        }
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


    const startVideo = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                videoRef.current.srcObject = stream;
                setIsWebcamActive(true);
            })
            .catch(err => {
                console.error('Error accessing webcam:', err);
                setIsWebcamActive(false);
            });
    };


    const retakeImage = () => {
        setImage(null);
        startVideo();
    };


    return (
        <div className="file-upload-container">
            {!image && <video ref={videoRef} autoPlay playsInline width="640" height="480" />}
            {isWebcamActive && <button className="button" onClick={captureImage}>Capture</button>}
            <canvas ref={canvasRef} width="640" height="480" style={{ display: 'none' }}></canvas>
            {image && (
                <div>
                    <img src={image} alt="Captured" width="640" height="480" />
                    <button className="button" onClick={retakeImage}>Retake</button>
                    <button className={'upload'} onClick={handleFileUpload}>Upload</button>
                </div>
            )}
            {!isWebcamActive && !image && <button className="button" onClick={startVideo}>Start Webcam</button>}
        </div>
    );
};


export default ImageCapture;
