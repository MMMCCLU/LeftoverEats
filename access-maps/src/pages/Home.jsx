import React from 'react';
import './homestyle.css'; // Assuming homestyle.css is in the same directory

const Home = () => {
    return (
        <html>
            <head>
                <link rel="stylesheet" type="text/css" href="homestyle.css" />
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" />
                <title>Home</title>
                <style>
                    {`
                        body, html {
                            height: 100%;
                            color: #080808;
                            background-color: #cccccc;
                            line-height: 1.8;
                        }

                        .topBanner {
                            background-image: url(https://www.morgan-mcclure-cs-work.com/images/citystreet.jpeg);
                        }

                        .bottomBanner {
                            background-image: url(https://www.morgan-mcclure-cs-work.com/images/citystreet.jpeg);
                        }
                    `}
                </style>
            </head>
            <body>
                <div id="nav"></div>

                <header>
                    <div className="banner topBanner" id="home">
                        <div className="displayMiddle" style={{ whiteSpace: 'nowrap' }}>
                            <span className="headerDisplay newRomanFont">WELCOME!</span>
                        </div>
                    </div>
                </header>

                <div className="content">
                    <h2 style={{ marginTop: '20px', marginLeft: '16px', important: true }}>Our Goal</h2>
                    <p style={{ marginTop: '20px', marginLeft: '16px', important: true }}>Our goal is to allow for easier access to interactive accessibility maps.</p>
                </div>

                <footer>
                    <div className="banner bottomBanner"></div>
                </footer>
            </body>
        </html>
    );
};

export default Home;