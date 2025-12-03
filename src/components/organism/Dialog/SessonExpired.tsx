// components/SessionExpiredPopup.tsx
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../../slice/authSlice";
import { hideSessionExpired } from "../../../slice/sessionSlice";
import type { RootState } from "../../../store/store";

const SessionExpiredPopup = () => {
    const dispatch = useDispatch();
    const { showSessionExpiredPopup, message } = useSelector(
        (state: RootState) => state.session
    );

    const handleYesItsMe = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user");

        dispatch(logout());

        // Hide the popup
        dispatch(hideSessionExpired());

        // Redirect to login page
        window.location.href = "/login";
    };

    const handleClose = () => {
        dispatch(hideSessionExpired());
    };

    if (!showSessionExpiredPopup) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 z-9998 transition-opacity"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 pointer-events-none">
                <div
                    className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 pointer-events-auto transform transition-all"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header with Icon */}
                    <div className="flex flex-col items-center mb-5">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <svg
                                className="w-8 h-8 text-red-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 15v2m-6 0h12a2 2 0 002-2V7a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2"
                                />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 text-center">
                            Session Expired
                        </h2>
                    </div>

                    {/* Message */}
                    <div className="mb-5">
                        <p className="text-gray-700 text-center leading-relaxed">
                            {message}
                        </p>
                    </div>

                    {/* Warning Note */}
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-5 w-5 text-yellow-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-800">
                                    <span className="font-semibold">Important:</span> If this wasn't you,
                                    please contact our support team immediately to secure your account.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleYesItsMe}
                            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
                        >
                            Yes, It's Me - Login Again
                        </button>

                        <button
                            onClick={handleClose}
                            className="w-full bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
                        >
                            Close
                        </button>
                    </div>

                    {/* Support Link */}
                    <div className="mt-5 pt-4 border-t border-gray-200">
                        <p className="text-center text-sm text-gray-600">
                            Need help?{" "}
                            <a
                                href="/support"
                                className="text-blue-600 hover:text-blue-800 font-medium underline"
                            >
                                Contact Support
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SessionExpiredPopup;