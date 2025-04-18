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
import AuthorityLoginForm from "./pages/AuthoritySignin";
import UserProfile from "./pages/CitizenDashboard";
import { useFetchUser } from "./api/query";
import Loader from "./components/Loader";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NotFoundPage from "./components/NotFound";
import Logout from "./components/Logout";

// Public routes that should be accessible without authentication
const PUBLIC_ROUTES = [
  "/signin", 
  "/signup", 
  "/AuthoritySignup", 
  "/authoritySignin",
  "/reset-password",
  "/verify-otp"
];

// Route component for authenticated users only
const PrivateRoute = ({ children }) => {
    const { data, isLoading, isError } = useFetchUser();
    const location = useLocation();

    if (isLoading && !isError) {
        return <Loader />;
    }

    // If no user data or error, redirect to signin
    if (!data || isError) {
        return <Navigate to="/signin" state={{ from: location }} replace />;
    }

    // Check user type and redirect if necessary
    const type = data?.type || data?.role;
    if (type && type !== "citizen" && location.pathname !== "/dashboard") {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};


function App() {
    const navigate = useNavigate();
    const location = useLocation();
    const [authChecked, setAuthChecked] = useState(false);
    
    // Use query options to prevent infinite loops on auth errors
    const { 
        data: user, 
        isLoading, 
        isError,
        error
    } = useFetchUser({
        retry: PUBLIC_ROUTES.includes(location.pathname) ? 0 : 1,
        onError: () => {
            setAuthChecked(true);
        },
        onSuccess: () => {
            setAuthChecked(true);
        }
    });

    useEffect(() => {
        // Only redirect to sign in if:
        // 1. User isn't authenticated AND auth check is complete
        // 2. Not already on a public route
        // 3. Not in a loading state
        if (!user && authChecked && !isLoading && !PUBLIC_ROUTES.includes(location.pathname)) {
            navigate("/signin", { replace: true });
        }
    }, [user, isLoading, navigate, location.pathname, authChecked]);

    // If still loading initial auth state and not on a public route, show loader
    if (isLoading && !PUBLIC_ROUTES.includes(location.pathname)) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader />
            </div>
        );
    }

    return (
        <>
            <Routes>
                {/* Public routes - accessible to anyone */}
                <Route
                    path="/signup"
                    element={<SignupForm />}
                />
                <Route
                    path="/signin"
                    element={<LoginForm />}
                />
                <Route
                    path="/verify-otp"
                    element={<OTPVerification />}
                />
                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />
                <Route
                    path="/AuthoritySignup"
                    element={<AuthoritySignup />}
                />
                <Route
                    path="/authoritySignin"
                    element={<AuthorityLoginForm />}
                />

                {/* Routes that can be viewed by anyone, but have special behavior when logged in */}
                <Route
                    path="/"
                    element={user ? <Issue /> : <Navigate to="/signin" />}
                />
                
                {/* Route for issue details - visible to all but with different permissions */}
                <Route path="/issue/:id" element={<IssueDetail />} />

                {/* Private routes - need authentication */}
                <Route
                    path="/map"
                    element={
                        <PrivateRoute>
                            <MapWithMarkers />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/issues"
                    element={
                        <PrivateRoute>
                            <Issue />
                        </PrivateRoute>
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
                
                <Route path="/logout" element={<Logout />} />
                {/* Catch-all route */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </>
    );
}

export default App;