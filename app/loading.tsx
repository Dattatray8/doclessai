import React from 'react';

const LoadingSpinner: React.FC = () => {
    return (
        <div className="flex items-center justify-center mt-40">
            <div className="text-center space-y-4">
                <span className="loading loading-ring loading-lg text-primary"></span>
                <p className="text-base-content/70">Please wait...</p>
            </div>
        </div>
    );
};

export default LoadingSpinner;