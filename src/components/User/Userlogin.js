import React from 'react';
import './Userlogin.css';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from './UserAuth';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import background from '../images/background.png';

function UserLogin() {
	const auth = useUserAuth();
	const navigate = useNavigate();

	const validationSchema = Yup.object().shape({
		Email: Yup.string()
			.email('Please enter a valid email address')
			.required('Email is required'),
		password: Yup.string().required('Password is required'),
	});

	const formik = useFormik({
		initialValues: {
			Email: '',
			password: '',
		},
		validationSchema: validationSchema,
		onSubmit: (values) => {
			const { Email, password } = values;
		
			let matchFound = false;
			let access = '';
			let username = '';  // Declare username here
		
			auth.userlist.forEach((item) => {
				if (item.useremail === Email && item.userpassword === password) {
					matchFound = true;
					access = item.useraccess;
					username = item.username;  // Assign the value here
					return;
				}
			});
		
			if (matchFound) {
				auth.userlogin(username, Email, password, access);
				auth.setUserAccess(access);
				switch (access) {
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
			} else {
				formik.setFieldError('Email', 'Invalid username or password');
				formik.setFieldError('password', 'Invalid username or password');
			}
		},
		
	});

	return (
		<div
			style={{
				backgroundImage: `url(${background})`,
				backgroundSize: 'cover',
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'center',
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<div className='user-login-container'>
				<div className='user-login'>
					<h2 className='user-login-head'>LOGIN</h2>
					<div className='user-login-form'>
						<form onSubmit={formik.handleSubmit}>
							<div className='user-login-email'>
								<input
									type='email'
									placeholder='Email'
									value={formik.values.Email}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									className='user-login-input'
									name='Email'
								/>
								{formik.touched.Email && formik.errors.Email ? (
									<div className='error-message-email'>
										{formik.errors.Email}
									</div>
								) : null}
							</div>
							<div className='user-login-password'>
								<input
									type='password'
									placeholder='Password'
									value={formik.values.password}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									className='user-login-input'
									name='password'
								/>
								{formik.touched.password && formik.errors.password ? (
									<div className='error-message-password'>
										{formik.errors.password}
									</div>
								) : null}
							</div>
							<div className='user-login-button'>
								<button type='submit' className='user-login-button-value'>
									Login
								</button>
							</div>
						</form>
						<div className='staff-login-not-req'>
							<p className='staff-login-not'>
								Not User?
								<a className='user-a' href='/'>
									admin
								</a>
								<a className='user-a' href='/staff'>
									staff
								</a>
							</p>
						</div>
						{/* <div className='user-login-error'>
							{!formik.isValid && (
								<h3 id='invalid'>
									{formik.errors.Email || formik.errors.password}
								</h3>
							)}
						</div> */}
					</div>
				</div>
				<div className='user-login-content'>
					<div className='user-login-content-head'>
						<h2>Welcome</h2>
					</div>
					<div className='user-login-content-body'>
						<h3>User</h3>
					</div>
				</div>
			</div>
		</div>
	);
}

export default UserLogin;
