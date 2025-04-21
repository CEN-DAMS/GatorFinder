import React, { useState } from 'react';
import OtpInput from 'react-otp-input';
import './OTP.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function OTPPage() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = async (otp) => {
     let response;
    setOtp(otp);    
    if (otp.length === 6) {
      try {
        const response = await axios.get(`http://localhost:8080/login/verifyOtp?otp=${otp}`);
        if (response.status === 200) {
          navigate('/home');
        }
      } catch (err) {
        console.error(err);
        setError('Wrong OTP code, try again!');
      }
    }
  };

  return (
    <div className="otp-container">
      <h2 className="otp-heading">Enter OTP</h2>
      <OtpInput
        numInputs={6}
        value={otp}
        onChange={handleChange}
        inputStyle="otp-input"
        renderSeparator={<span>-</span>}
        renderInput={(props, index) => (
          <input {...props} className="otp-box" />
        )}
        
      />
        {error && <p style={{ color: 'red', fontSize: 'large' }}>{error}</p>}    

    </div>
  );
}

export default OTPPage;
