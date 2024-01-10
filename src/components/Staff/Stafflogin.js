import React from 'react';
import './Stafflogin.css';
import { useNavigate } from 'react-router-dom';
import { useStaffAuth } from './StaffAuth';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import background from '../images/background.png';

function StaffLogin() {
	const auth = useStaffAuth();
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
			let staffname = '';  // Declare staffname here
		
			auth.stafflist.forEach((item) => {
				if (item.staffemail === Email && item.staffpassword === password) {
					matchFound = true;
					access = item.staffaccess;
					staffname = item.staffname;  // Assign the value here
					return;
				}
			});
		
			if (matchFound) {
				auth.stafflogin(staffname,Email, password, access);
				auth.setStaffAccess(access);
				switch (access) {
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
			<div className='staff-login-container'>
				<div className='staff-login'>
					<h2 className='staff-login-head'>LOGIN</h2>
					<div className='staff-login-form'>
						<form onSubmit={formik.handleSubmit}>
							<div className='staff-login-email'>
								<input
									type='email'
									placeholder='Email'
									value={formik.values.Email}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									className='staff-login-input'
									name='Email'
								/>
								{formik.touched.Email && formik.errors.Email ? (
									<div className='error-message-email'>
										{formik.errors.Email}
									</div>
								) : null}
							</div>
							<div className='staff-login-password'>
								<input
									type='password'
									placeholder='Password'
									value={formik.values.password}
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									className='staff-login-input'
									name='password'
								/>
								{formik.touched.password && formik.errors.password ? (
									<div className='error-message-password'>
										{formik.errors.password}
									</div>
								) : null}
							</div>
							<div className='staff-login-button'>
								<button type='submit' className='staff-login-button-value'>
									Login
								</button>
							</div>
						</form>
						<div className='staff-login-not-req'>
							<p className='staff-login-not'>
								Not Staff?
								<a className='staff-a' href='/'>
									admin
								</a>
								<a className='staff-a' href='/user'>
									user
								</a>
							</p>
						</div>
						{/* <div className='staff-login-error'>
							{!formik.isValid && (
								<h3 id='invalid'>
									{formik.errors.Email || formik.errors.password}
								</h3>
							)}
						</div> */}
					</div>
				</div>
				<div className='staff-login-content'>
					<div className='staff-login-content-head'>
						<h2>Welcome</h2>
					</div>
					<div className='staff-login-content-body'>
						<h3>Staff</h3>
					</div>
				</div>
			</div>
		</div>
	);
}

export default StaffLogin;
