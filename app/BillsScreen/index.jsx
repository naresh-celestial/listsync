import React, { useState } from 'react';

const BillsScreen = () => {
    const [image, setImage] = useState(null);

    const handleCameraAccess = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
            const video = document.createElement('video');
            video.srcObject = mediaStream;
            video.play();
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/png');
            setImage(dataUrl);
            mediaStream.getTracks().forEach(track => track.stop());
        } catch (error) {
            console.error('Error accessing camera:', error);
        }
    };

    return (
        <div>
            <h1>Bills Screen</h1>
            <button onClick={handleCameraAccess}>Access Camera</button>
            {image && <img src={image} alt="Captured Image" />}
        </div>
    );
};

export default BillsScreen;