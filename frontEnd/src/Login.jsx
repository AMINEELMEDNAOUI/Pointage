import React, { useState } from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput
} from 'mdb-react-ui-kit';
import './Login.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function Login() {
  const [values, setValues] = useState({
    Name: '',
    Password: '',
    showPassword: false 
  });

  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted values:', values);
    axios.post('http://localhost:8081/login', values)
      .then(res => {
        console.log('Server response:', res.data);
        if (res.data.status === "Success") {
          localStorage.setItem('token', res.data.token);
          message.success(res.data.Message); 
          navigate('/home');
        } else {
          message.error(res.data.Message);
        }
      })
      .catch(err => console.log('Error:', err));
  };

  const togglePasswordVisibility = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };
  const handleCancel=()=>{
    setValues({ Name: '', Password: '' });
  }

  return (
    <MDBContainer fluid className='d-flex align-items-center justify-content-center bg-image h-100 '>
      <MDBCard className='m-5' style={{ maxWidth: '500px', width: '330px',height:'320px',backgroundColor:'#f1f1f1' , boxShadow: '0 10px 20px rgba(0, 0, 0, 1.2)'}}>
        <MDBCardBody className='p-5'>
          <h2 className="text-center mb-5" style={{marginTop:'-33px'}}>Profil Utilisateur</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4" style={{ marginTop:'-30px' }}>
              <label htmlFor="form1" className="form-label">Nom</label>
              <MDBInput
                wrapperClass='mb-4'
                size='lg'
                id='form1'
                type='text'
                name='Name'
                className='inp'
                value={values.Name}
                required
                onChange={e => setValues({ ...values, Name: e.target.value })}
              />
            </div>
            <div className="mb-4" style={{ marginTop:'-15px' }}>
              <label htmlFor="form3" className="form-label">Mot de Passe</label>
              <div className="password-input-wrapper">
                <MDBInput
                  wrapperClass='mb-4'
                  size='lg'
                  id='form3'
                  type={values.showPassword ? 'text' : 'password'} 
                  name='Password'
                  className='inp'
                  value={values.Password}
                  required
                  onChange={e => setValues({ ...values, Password: e.target.value })}
                />
                <FontAwesomeIcon
                  icon={values.showPassword ? faEyeSlash : faEye} 
                  className='toggle-password-icon'
                  onClick={togglePasswordVisibility}
                />
              </div>
            </div>
            <div className='divflex'>
            <button type='submit' className='mb-4 w-100 gradient-custom-4 mdb-btn btn submit ' size='lg' style={{ marginTop:'-15px',color:'white' ,fontSize:'larger',fontFamily:' Georgia, "Times New Roman", Times, serif'}}>Valider</button>
            <button type="button" className="mb-4 w-100 btn btn-danger mdb-btn cancel" size="lg" style={{ marginTop: '-15px' ,fontSize:'larger',fontFamily:' Georgia, "Times New Roman", Times, serif'}} onClick={handleCancel}> Annuler</button>
            </div>
          </form>
        </MDBCardBody>
      </MDBCard>
    </MDBContainer>
  );
}

export default Login;
