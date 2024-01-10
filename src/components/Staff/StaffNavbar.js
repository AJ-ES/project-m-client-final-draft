import React from "react";
import './StaffNavbar.css';
import { useNavigate } from 'react-router-dom';
import { useStaffAuth } from './StaffAuth';

function StaffNavbar() {
    const navigate = useNavigate();
    const auth = useStaffAuth();
    const handleLogout = () => {
      auth.stafflogout();
  }
    const dashboard = () => {
        switch (auth.access) {
            case 'Super-Staff':
          navigate('/staffsuperdash');
          break;
        case 'HO-Staff':
          navigate('/staffhodash');
          break;
        case 'Staff':
          navigate('/staffgendash');
          break;
        default:
          break;
        }
    }

    return (
        <div className='staff-logout-box-nav'>
          <div className='staff-logout-container-nav'>
            <div className='staff-logout-button-nav'>
            { (auth.access === 'Super-Staff') ?
              <button className='staff-logout-button-value-no-img'  onClick={() => navigate('/staffgenrep')}>
                REPORTS
              </button>: <button className="disabled" disabled></button>}
             {(auth.access === 'Super-Staff' || auth.access === 'HO-Staff') ?
             <button className='staff-logout-button-value-no-img'  onClick={() => navigate('/staffcomman')}>
                COMPANY
              </button> : <button className="disabled" disabled></button> }
              <button className='staff-logout-button-value-no-img'  onClick={() => navigate('/staffsellman')}>
                AGENT
              </button>
              <button className='staff-logout-button-value-no-img'  onClick={() => navigate('/staffbuyman')}>
                BUYER
              </button>
              <button className='staff-logout-button-value-no-img'  onClick={() => navigate('/staffconman')}>
                CONSIGNMENT
              </button>
              <button className='staff-logout-button-value-no-img'  onClick={() => navigate('/staffvecman')}>
                LOADING
              </button>
              <button className='staff-logout-button-value-no-img'  onClick={() => navigate('/staffinvdash')}>
                INOVICE
              </button>
              <button className='staff-logout-button-value-no-img'  onClick={dashboard}>
                DASHBOARD
              </button>
              <button className='staff-logout-button-value-no-img'  onClick={handleLogout}>
                LOGOUT
              </button>
            </div>
          </div>
        </div>
    )
    }

export default StaffNavbar;