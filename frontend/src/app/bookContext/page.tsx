'use client';
import React, { createContext, useContext, useState } from 'react';

interface BookContextType {
    bookId: number | null;
    setBookId: (id: number | null) => void;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [bookId, setBookId] = useState<number | null>(null);
    return (
        <BookContext.Provider value={{ bookId, setBookId }}>
            {children}
        </BookContext.Provider>
    );
};

export const useBookContext = () => {
    const context = useContext(BookContext);
    if (!context) {
        throw new Error('useBookContext must be used within a BookProvider');
    }
    return context;
};
