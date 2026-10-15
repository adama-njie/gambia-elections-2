import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white dark:bg-secondary shadow-md">
      <div className="h-1.5 bg-primary w-full"></div>
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          <div>
            <h1 className="text-2xl font-bold text-text-charcoal dark:text-background">
              Gambia Election Analytics
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Visualizing History, Predicting the Future
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;