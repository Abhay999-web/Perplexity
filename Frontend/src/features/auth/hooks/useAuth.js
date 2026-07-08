import { useDispatch } from "react-redux";
import { register, login, getMe, logout } from "../service/auth.api.js";
import { setUser, setLoading, setError } from "../auth.slice.js";

export function useAuth() {
    const dispatch = useDispatch();

    async function handleRegister({ email, username, password }) {
        try {
            dispatch(setLoading(true));
            const data = await register({ email, username, password });
            if (data?.user) dispatch(setUser(data.user)); 
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Registration failed"));
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleLogin({ email, password }) {
        try {
            dispatch(setLoading(true));
            const data = await login({ email, password });
            dispatch(setUser(data.user));
            return data;
        } catch (err) {
            const message = err.response?.data?.message || "Login failed";
            dispatch(setError(message));
            // rethrow so callers (components) can react to the error directly
            throw err;
        } finally {
            dispatch(setLoading(false));
        }
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true));
            const data = await getMe();
            dispatch(setUser(data.user));
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Failed to fetch user data"));
        } finally {
            dispatch(setLoading(false));
        }
    }
    
    async function handleLogout(){
        try{
            dispatch(setLoading(true));
            await logout() 
        }
        catch(err){
            dispatch(setError(err.response?.data?.message || "Logout failed"));
        } finally{
            dispatch(setLoading(false)); 
            dispatch(setUser(null)); // Clear user state on logout
        }
    }

    return {
        handleRegister,
        handleLogin,
        handleGetMe,
        handleLogout
    };
}