import React from 'react';
import './UserNavbar.css';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from './UserAuth';

function UserNavbar() {
	const navigate = useNavigate();
	const auth = useUserAuth();
	const handleLogout = () => {
		auth.userlogout();
	}
	const dashboard = () => {
		switch (auth.access) {
			case 'Super-User':
				navigate('/usersuperdash');
				break;
			case 'HO-User':
				navigate('/userhodash');
				break;
			case 'User':
				navigate('/usergendash');
				break;
			default:
				break;
		}
	};

	return (
		<div className='user-logout-box-nav'>
			<div className='user-logout-container-nav'>
				<div className='user-logout-button-nav'>
					{auth.access === 'Super-User' ? (
						<button
							className='user-logout-button-value-no-img'
							onClick={() => navigate('/usercomman')}
						>
							COMPANY
						</button>
					) : (
						<button className='disabled' disabled></button>
					)}
					{auth.access === 'Super-User' || auth.access === 'HO-User' ? (
						<button
							className='user-logout-button-value-no-img'
							onClick={() => navigate('/usersellman')}
						>
							AGENT
						</button>
					) : (
						<button className='disabled' disabled></button>
					)}
					{auth.access === 'Super-User' || auth.access === 'HO-User' ? (
						<button
							className='user-logout-button-value-no-img'
							onClick={() => navigate('/userbuyman')}
						>
							BUYER
						</button>
					) : (
						<button className='disabled' disabled></button>
					)}
					{auth.access === 'Super-User' || auth.access === 'HO-User' ? (
						<button
							className='user-logout-button-value-no-img'
							onClick={() => navigate('/userconman')}
						>
							CONSIGNMENT
						</button>
					) : (
						<button className='disabled' disabled></button>
					)}

					{auth.access === 'Super-User' || auth.access === 'HO-User' ? (
						<button
							className='user-logout-button-value-no-img'
							onClick={() => navigate('/uservecman')}
						>
							LOADING
						</button>
					) : (
						<button className='disabled' disabled></button>
					)}
					
						<button
							className='user-logout-button-value-no-img'
							onClick={() => navigate('/userinvdash')}
						>
							INOVICE
						</button>
					<button
						className='user-logout-button-value-no-img'
						onClick={dashboard}
					>
						DASHBOARD
					</button>
					<button className='user-logout-button-value-no-img'  onClick={handleLogout}>
                LOGOUT
              </button>
				</div>
			</div>
		</div>
	);
}

export default UserNavbar;
