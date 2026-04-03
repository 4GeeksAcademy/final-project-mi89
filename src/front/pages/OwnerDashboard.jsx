import Qrcode from "../components/Qrcode";

const OwnerDashboard = () => {
    const restaurantId = 1;

    return (
        <div>
            <h1>Owner Dashboard</h1>
            <Qrcode restaurantId={restaurantId} />
        </div>
    );
};

export default OwnerDashboard;