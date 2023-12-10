import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../Pages/Home";
import Protfolio from "../Pages/Portfolio";
import Wallet from "../Pages/Wallet";
import Profile from "../Pages/Profile";
import TradingScreen from "../Component/Chart";
import Login from "../Pages/Auth";

const HomeAuthRoutes = () => {
    return (
        <Routes>
            <Route path={"*" } element={<Navigate to="/market" replace />} />
            <Route path="/market" element={<Home />} />
            <Route path="/portfolio" element={<Protfolio />} />
            <Route path="/wallet" element={<Wallet />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/trading-chart/:id" element={<TradingScreen />} />
        </Routes>
    )
}

export default HomeAuthRoutes