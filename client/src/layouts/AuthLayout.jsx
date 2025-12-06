import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

const AuthLayout = ({ children, title, subtitle }) => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [darkMode]);

    return (
        <div className="flex min-h-screen w-full bg-gray-50 dark:bg-dark-bg transition-colors duration-300">
            {/* Left Side - Artistic/Abstract */}
            <div className="hidden lg:flex w-1/2 bg-primary relative overflow-hidden items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-light to-primary-dark opacity-90"></div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 text-white p-12 max-w-lg"
                >
                    <h1 className="text-5xl font-bold mb-6">Manage your files with confidence.</h1>
                    <p className="text-xl text-blue-100">Secure, fast, and easy file sharing for professionals.</p>
                </motion.div>

                {/* Decorative Circles */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-20 -left-20 w-80 h-80 bg-white opacity-10 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 opacity-10 rounded-full blur-3xl"
                />
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 relative">
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="absolute top-6 right-6 p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
                >
                    {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-md bg-white dark:bg-dark-card p-8 rounded-2xl shadow-xl dark:shadow-none border border-gray-100 dark:border-gray-800"
                >
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{title}</h2>
                        <p className="text-gray-500 dark:text-gray-400">{subtitle}</p>
                    </div>

                    {children}
                </motion.div>
            </div>
        </div>
    );
};

export default AuthLayout;
