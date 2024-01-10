import React from 'react'
import './Staffdashboard.css'
import background from '../images/Desktop.png';
import gr from '../images/gr.png';
import mc from '../images/mc.png';
import mu from '../images/mu.png';
import mv from '../images/mv.png';
import mi from '../images/mi.png';
import ms from '../images/ms.png';
import ad from '../images/ad.png';
import vs from '../images/vs.png';
import { useStaffAuth } from './StaffAuth';
import { useNavigate } from 'react-router-dom';

function Staffdashboard() {
  const auth = useStaffAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.stafflogout();
}
  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
     <div className='admin-dashboard'>
     <div className='admin-logout'>
        <div className='admin-logout-box'>
          <div className='admin-logout-container'>
            <div className='admin-logout-button'>
              <button className='admin-logout-button-value'  onClick={handleLogout}>
                LOGOUT
              <img className='admin-logout-icon' src={mu} alt='icon'/>
              </button>
            </div>
          </div>
        </div>
      </div>
        <h1 className='admin-dashboard-title'>MAIN MENU</h1>
          <div className='admin-dashboard-buttons'>
            <div className='admin-dashboard-buttons-row'>
              <button className='admin-dashboard-button' onClick={() => navigate('/staffgenrep')}>
                <div className='admin-card-box'>
                  <img src={gr} alt='gr' className='admin-dashboard-button-icon' />
                  <span>GENERATE REPORTS</span>
                </div>
              </button>
              <button className='admin-dashboard-button' onClick={() => navigate('/staffinvdash')}>
                <div className='admin-card-box'>
                  <img src={mi} alt='ms' className='admin-dashboard-button-icon' />
                  <span>MANAGE INVOICE</span>
                </div>
              </button> 
              <button className='admin-dashboard-button'  onClick={() => navigate('/staffvecman')}>
                <div className='admin-card-box'>
                  <img src={vs} alt='' className='admin-dashboard-button-icon' />
                  <span>MANAGE LOADING</span>
                </div>
              </button>
              <button className='admin-dashboard-button'  onClick={() => navigate('/staffcomman')}>
                <div className='admin-card-box'>
                  <img src={mc} alt='mc' className='admin-dashboard-button-icon' />
                  <span>MANAGE COMPANY</span>
                </div>
              </button>
              <button className='admin-dashboard-button'  onClick={() => navigate('/staffsellman')}>
                <div className='admin-card-box'>
                  <img src={mv} alt='mv' className='admin-dashboard-button-icon' />
                  <span>MANAGE AGENTS</span>
                </div>
              </button>
              <button className='admin-dashboard-button'  onClick={() => navigate('/staffbuyman')}>
                <div className='admin-card-box'>
                  <img src={ms} alt='mi' className='admin-dashboard-button-icon' />
                  <span>MANAGE BUYERS</span>
                </div>
              </button>
              <button className='admin-dashboard-button'  onClick={() => navigate('/staffconman')}>
                <div className='admin-card-box'>
                  <img src={ad} alt='mc' className='admin-dashboard-button-icon' />
                  <span>MANAGE CONSIGNMENT</span>
                </div>
              </button>
            </div>
          </div>
        </div>
    </div>
  )
}

export default Staffdashboard
