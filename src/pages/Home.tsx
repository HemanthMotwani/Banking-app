import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Your Financial Future Starts Here
          </h1>
          <p className="hero-subtitle">
            Get the loan you need with competitive rates, flexible terms, and a simple application process. 
            Trusted by thousands of customers nationwide.
          </p>
          <div className="hero-buttons">
            <Link to="/loans" className="btn btn-primary">Explore Loans</Link>
            <Link to="/contact" className="btn btn-secondary">Get Started</Link>
          </div>
        </div>
        <div className="hero-decoration">
          <div className="decoration-circle decoration-circle-1"></div>
          <div className="decoration-circle decoration-circle-2"></div>
          <div className="decoration-circle decoration-circle-3"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card card">
            <div className="feature-icon">⚡</div>
            <h3>Fast Approval</h3>
            <p>Get approved in minutes with our streamlined application process. No lengthy paperwork required.</p>
          </div>
          <div className="feature-card card">
            <div className="feature-icon">💰</div>
            <h3>Competitive Rates</h3>
            <p>Enjoy some of the best interest rates in the market. We work hard to save you money.</p>
          </div>
          <div className="feature-card card">
            <div className="feature-icon">🔒</div>
            <h3>Secure & Safe</h3>
            <p>Your data is protected with bank-level encryption. Your privacy is our priority.</p>
          </div>
          <div className="feature-card card">
            <div className="feature-icon">👥</div>
            <h3>Expert Support</h3>
            <p>Our dedicated team is here to help you every step of the way. 24/7 customer support available.</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <div className="stat-number">50K+</div>
            <div className="stat-label">Happy Customers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">$2B+</div>
            <div className="stat-label">Loans Disbursed</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">98%</div>
            <div className="stat-label">Satisfaction Rate</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">24/7</div>
            <div className="stat-label">Support Available</div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;

// import React from "react";

// const Home: React.FC = () => {
//   return (
//     <div>
//       <h1>Home Page</h1>
//       <p>Welcome to our application.</p>
//     </div>
//   );
// };

// export default Home;
