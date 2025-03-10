import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import SignupForm from "./pages/UserSignup";
import OTPVerification from "./pages/VerifyOTP";
import AuthoritySignup from "./pages/AuthoritySignup";
import MapWithMarkers from "./pages/Map";
import Issue from "./pages/Issue";
import IssueDetail from "./pages/IssueDetail";
import LoginForm from "./pages/Login";
import ResetPassword from "./pages/Reset-password";
import IssueForm from "./components/SendIssue";
import Dashboard from "./pages/Dashboard";
import AudioRecorder from "./components/AudioRecorder";
import AuthorityLoginForm from "./pages/AuthoritySignin";


import UserProfile from "./pages/CitizenDashboard";
import { useFetchUser } from "./api/query";
import Loader from "./components/Loader";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NotFoundPage from "./components/NotFound";

const PrivateRoute = ({ children }) => {
    const { data, isLoading } = useFetchUser();
    const location = useLocation();
    const type = data?.type || data?.role;

    if (isLoading) {
        return <Loader />; // Show a loader while checking auth status
    }

    if (!data) {
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    if (type && type !== "citizen" && location.pathname !== "/dashboard") {
        return <Navigate to="/dashboard" state={{ from: location }} replace />;
    }

    return children;
};

const RedirectAuthenticatedUser = ({ children }) => {
    const location = useLocation();
    const { data, isLoading } = useFetchUser();

    const authPages = ["/signin", "/signup", "/AuthoritySignup", "/authoritySignin"];

    if (isLoading) {
        return <Loader />; // Show a loader while checking auth status
    }

    if (data && authPages.includes(location.pathname)) {
        const intendedPath = location.state?.from?.pathname || "/issues";
        return <Navigate to={intendedPath} replace />;
    }

    return children;
};

function App() {
    const { data: user, error, isLoading } = useFetchUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user && !isLoading) {
            navigate("/signin");
        }
    }, [user, isLoading, navigate]);

    if (isLoading)
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader />
            </div>
        );

    return (
        <>
            <Routes>
                <Route
                    path="/"
                    element={
                        <RedirectAuthenticatedUser>
                            <Issue />
                        </RedirectAuthenticatedUser>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <RedirectAuthenticatedUser>
                            <SignupForm />
                        </RedirectAuthenticatedUser>
                    }
                />
                <Route path="/signin" element={<LoginForm />} />
                <Route
                    path="/verify-otp"
                    element={
                        <RedirectAuthenticatedUser>
                            <OTPVerification />
                        </RedirectAuthenticatedUser>
                    }
                />
                <Route
                    path="/reset-password"
                    element={
                        <RedirectAuthenticatedUser>
                            <ResetPassword />
                        </RedirectAuthenticatedUser>
                    }
                />
                <Route
                    path="/AuthoritySignup"
                    element={
                        <RedirectAuthenticatedUser>
                            <AuthoritySignup />
                        </RedirectAuthenticatedUser>
                    }
                />
                <Route
                    path="/authoritySignin"
                    element={
                        <RedirectAuthenticatedUser>
                            <AuthorityLoginForm />
                        </RedirectAuthenticatedUser>
                    }
                />
                <Route
                    path="/map"
                    element={
                        <PrivateRoute>
                            <MapWithMarkers />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/issue/:id"
                    element={
                        
                            <IssueDetail />
                        
                    }
                />
                <Route
                    path="/send-issue/"
                    element={
                        <PrivateRoute>
                            <IssueForm />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <PrivateRoute>
                            <Dashboard type={user?.type || user?.role} />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <UserProfile />
                        </PrivateRoute>
                    }
                />

                <Route path="/audio" element={<AudioRecorder />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </>
    );
}

export default App;