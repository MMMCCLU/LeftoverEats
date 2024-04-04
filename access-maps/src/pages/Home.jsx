import React from 'react';
import './homestyle.css'; // Assuming homestyle.css is in the same directory
import { useQuery } from '@tanstack/react-query';
import { fetchHome } from '../util/home';

const Home = () => {
    // fetchHome will return an array, therefore the variable: data is expecting an array
    const { data = [], error, isLoading } = useQuery({
        queryKey: ['home'],
        queryFn: fetchHome,
      });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
  
    return(
        <div style={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            backgroundColor: '#f0f0f0',
            borderRadius: '8px'
        }}>
            {/* I map the data array that is returned and extract "entryId", "teamName", "teamLetter", and "description" from each object in the array */}
            {data.map(item => (
                <div 
                    key={item.entryId} 
                    style={{ 
                        backgroundColor: '#fff',
                        padding: '20px',
                        marginBottom: '10px',
                        borderRadius: '8px',
                        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    <h2 style={{ marginBottom: '10px' }}>{item.teamName}</h2>
                    <p><strong>Team Letter:</strong> {item.teamLetter}</p>
                    <p><strong>Description:</strong> {item.description}</p>
                </div>
            ))}
        </div>
    );
};

export default Home;