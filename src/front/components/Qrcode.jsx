import React from "react";
import QRCode from "react-qr-code";

const Qrcode = ({ restaurantId }) => {
    const uploadUrl = `${window.location.origin}/restaurant/${restaurantId}/upload`;

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h3>Your Table QR Code</h3>
            <QRCode
                value={uploadUrl}
                size={256}
                bgColor="#ffffff"
                fgColor="#000000"
            />
            <p style={{ fontSize: "12px", marginTop: "8px", color: "gray" }}>
                Customers scan this to upload photos
            </p>
        </div>
    );
}; 

export default Qrcode;