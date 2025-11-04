// JWT 발급, 세션 쿠키 수신
import axios from "axios";

export const loginAPI = async (username, password) => {
    const res = await axios.post(
        "/api/auth/login",
        { username, password },
        { withCredentials: true }
    );
    return res.data;
};s