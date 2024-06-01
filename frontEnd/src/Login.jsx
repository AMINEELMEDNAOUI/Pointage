import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import {
    MDBBtn,
    MDBContainer,
    MDBCard,
    MDBCardBody,
    MDBCardImage,
    MDBRow,
    MDBCol,
    MDBIcon,
    MDBInput
} from 'mdb-react-ui-kit';
import {Link} from 'react-router-dom';

function Login() {
    const [values, setValues] = useState({
        email: '',
        password: ''
    });

    const handleInputChange = event => {
        setValues(prev => ({ ...prev, [event.target.name]: event.target.value }));
    }

    const navigate = useNavigate();
    const handleSubmit = event => {
        event.preventDefault();
        fetch('http://localhost:8081/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error('Network response was not ok');
                }
            })
            .then(data => {
                if (data.Status === "Success") {
                    navigate('/');
                } else {
                    alert("Error");
                }
            })
            .catch(error => {
                console.error('There was an error with the fetch operation:', error);
            });
    }

    return (
        <MDBContainer className="d-flex justify-content-center align-items-center bg-image full-page-container " style={{backgroundImage: 'url(https://img.freepik.com/free-photo/top-view-international-worker-s-day-still-life_23-2150337535.jpg?w=1060&t=st=1716799289~exp=1716799889~hmac=50a4d5df175b3fae79fb9c2d0aee21f538f45d7ea53fd0e586dee753422cb9d5)'}}>
            <MDBCard className="w-75">
                <MDBRow className="g-0">

                    <MDBCol md="6">
                        <MDBCardImage src="/PLANIFY3.png" alt="login form" className="rounded-start w-100 h-100" />
                    </MDBCol>

                    <MDBCol md="6">
                        <MDBCardBody className="d-flex flex-column">

                            <div className="d-flex flex-row mt-2 align-items-center">
                                <MDBIcon fas icon="cubes fa-3x me-3" style={{ color: '#ff6219' }} />
                                <div className="logo">
                                    <img src="/planify.ico" alt="Logo" className="logo-image mb-0 w-3" />
                                </div>
                            </div>

                            <h5 className="fw-normal my-4 pb-3" style={{ letterSpacing: '1px' }}>Sign into your account</h5>

                            <MDBInput
                                wrapperClass="mb-4"
                                label="Email address"
                                id="formControlLg"
                                type="email"
                                size="lg"
                                name="email"
                                value={values.email}
                                onChange={handleInputChange}
                            />
                            <MDBInput
                                wrapperClass="mb-4"
                                label="Password"
                                id="formControlLg"
                                type="password"
                                size="lg"
                                name="password"
                                value={values.password}
                                onChange={handleInputChange}
                            />

                            <MDBBtn onClick={handleSubmit} className="mb-4 px-5" color="dark" size="lg">Login</MDBBtn>
                            <a className="small text-muted" href="#!">Forgot password?</a>
                            <p className="mb-5 pb-lg-2" style={{ color: '#393f81' }}>Don't have an account? <Link to="/register" style={{ color: '#393f81' }}>Register here</Link></p>

                            <div className="d-flex flex-row justify-content-start">
                                <a href="#!" className="small text-muted me-1">Terms of use.</a>
                                <a href="#!" className="small text-muted">Privacy policy</a>
                            </div>

                        </MDBCardBody>
                    </MDBCol>

                </MDBRow>
            </MDBCard>
        </MDBContainer>
    );
}

export default Login;
