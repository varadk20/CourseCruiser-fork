// src/components/Recommendations.js
import React, { useState } from 'react';
import '../components/Recommendations.css'; // Import the CSS file

const Recommendations = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);

    const searchCourses = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({ searchTerm }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            displayResults(data);
        } catch (error) {
            console.error('Error fetching courses:', error);
        }
    };

    const displayResults = (results) => {
        setResults(results);
    };

    return (
        <div className="container">
            <h1>Search Udemy Courses</h1>
            <form onSubmit={searchCourses}>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Enter search terms (comma-separated)"
                    required
                />
                <button type="submit">Search</button>
            </form>
            <div id="results">
                {results.length === 0 ? (
                    <p>No results found.</p>
                ) : (
                    <div className="card-grid">
                        {results.map((course, index) => (
                            <div key={index} className="card">
                                <h3>{course.course_title}</h3>
                                <p><strong>Description:</strong> {course.subject}</p>
                                <p><strong>Paid or Not:</strong> {course.is_paid ? 'Paid' : 'Free'}</p>
                                <p><strong>Level:</strong> {course.level}</p>
                                <a href={course.url} target="_blank" rel="noopener noreferrer">
                                    View Course
                                </a>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Recommendations;
