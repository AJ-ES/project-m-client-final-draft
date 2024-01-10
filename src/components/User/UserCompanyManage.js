import React, { useState, useEffect } from 'react';
import './UserCompanyManage.css';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import background from '../images/Desktop.png';
// import ReactPaginate from 'react-paginate';
import UserNavbar from './UserNavbar';
import E from '../images/E.png';
import D from '../images/D.png';
import CompanyImage from '../images/addComapny.png';

const validationSchema = Yup.object().shape({
	companyname: Yup.string().required('Company Name is required'),
	companygstno: Yup.string()
		.required('GST No is required')
		.matches(
			/^[A-Z0-9]{15}$/,
			'GST No must be 15 characters long and contain only uppercase letters and numerics'
		),
	//companycontact: Yup.string().required('Contact is required'),
	companyofficeaddress: Yup.string().required('Office Address is required'),
	companystate: Yup.string().required('State is required'),
});

function UserCompanyManage() {
	const [companies, setCompanies] = useState([]);
	// const [pageNumber, setPageNumber] = useState(0);
	const [showTable, setShowTable] = useState(false);
	const [showButton, setShowButton] = useState(true);
	const [selectedCompanyId, setSelectedCompanyId] = useState(null);
	const [states, setStates] = useState([]);
	const API = process.env.REACT_APP_API;

	const formik = useFormik({
		initialValues: {
			companyname: '',
			companyregistrationtype: '',
			companypartytype: '',
			companygstno: '',
			//companycontact: '',
			companystate: '',
			companyofficeaddress: '',
			companypincode: '',
		},
		validationSchema,
		onSubmit: (values) => handleFormSubmit(values),
	});

	const stateOptions = [
		{ _id: 'default', statename: 'Select State', statecode: '----', __v: 0 },
		...states,
	];

	// const itemsPerPage = 10;
	const [searchInput, setSearchInput] = useState('');

	// Sort the companies array in reverse order (newest first)
	const sortedCompanies = [...companies].reverse();
	const displayedCompaniesSearch = sortedCompanies.filter((item) =>
		item.companyname.toLowerCase().includes(searchInput.toLowerCase())
	);
	// 	.slice(pageNumber * itemsPerPage, (pageNumber + 1) * itemsPerPage);

	// const pageCount = Math.ceil(sortedCompanies.length / itemsPerPage);

	// const changePage = ({ selected }) => {
	// 	setPageNumber(selected);
	// };

	useEffect(() => {
		axios
			.get(`${API}company`)
			.then((response) => {
				setCompanies(response.data);
			})
			.catch((error) => {
				console.error('Error fetching company data:', error);
			});
	}, [API]);

	useEffect(() => {
		axios
			.get(`${API}state`)
			.then((response) => {
				setStates(response.data);
			})
			.catch((error) => {
				console.error('Error fetching state data:', error);
			});
	}, [API]);

	const handleCompanyUpdate = (companyUpdateId) => {
		setSelectedCompanyId(companyUpdateId);
		setShowTable(!showTable); // Toggle the visibility of the table
		setShowButton(true);
		const selectedCompany = companies.find(
			(company) => company._id === companyUpdateId
		);
		formik.setValues({ ...selectedCompany });
	};

	const handleFormSubmit = (values) => {
		const selectedState = stateOptions.find(
			(option) => option.statename === values.companystate
		);

		if (selectedCompanyId) {
			// Update an existing company
			axios
				.put(`${API}company/${selectedCompanyId}`, values)
				.then((response) => {
					setCompanies((prevCompanies) =>
						prevCompanies.map((company) =>
							company._id === selectedCompanyId ? response.data : company
						)
					);
					toast.success('Company Details are Updated Successfully');
				})
				.catch((error) => {
					console.error('Error updating company:', error);
				});
		} else {
			// Create a new company
			axios
				.post(`${API}company`, values)
				.then((response) => {
					setCompanies((prevCompanies) => [...prevCompanies, response.data]);
					toast.success('Company Details are Saved Successfully');
				})
				.catch((error) => {
					console.error('Error creating company:', error);
				});
		}

		formik.setValues({
			...values,
			companypincode: selectedState ? selectedState.statecode : '',
		});

		formik.resetForm();
		setSelectedCompanyId(null);
	};

	// Delete an existing company
	// const handleDeleteCompany = (companyId) => {
	// 	const confirmDelete = window.confirm(
	// 		'Are you sure you want to delete this company?'
	// 	);
	// 	if (confirmDelete)
	// 		axios
	// 			.delete(`${API}company/${companyId}`)
	// 			.then((response) => {
	// 				setCompanies((prevCompanies) =>
	// 					prevCompanies.filter((company) => company._id !== companyId)
	// 				);
	// 				toast.success('Company deleted successfully');
	// 			})
	// 			.catch((error) => {
	// 				console.error('Error deleting company:', error);
	// 			});
	// };
	const handleDeleteCompany = (companyId) => {
		// Fetch invoices data
		axios
			.get(`${API}invoice`)
			.then((invoicesResponse) => {
				const invoicesData = invoicesResponse.data;
				// console.log('invoicesData', invoicesData);

				// Get the company name associated with the company ID
				const companyToDelete = companies.find(
					(company) => company._id === companyId
				);
				// console.log('companyToDelete', companyToDelete);

				if (!companyToDelete) {
					console.error('Company not found for deletion');
					return;
				}

				const companyNameToDelete = companyToDelete.companyname;
				// console.log('companyNameToDelete', companyNameToDelete);

				// Check if the company name exists in any of the invoices
				const isCompanyReferencedInInvoices = invoicesData.some(
					(invoice) =>
						invoice.companydetails.companyname === companyNameToDelete
				);
				// console.log(
				// 	'isCompanyReferencedInInvoices',
				// 	isCompanyReferencedInInvoices
				// );

				if (isCompanyReferencedInInvoices) {
					// If the company is referenced in invoices, show a message and don't delete
					// alert('Cannot delete company because it is referenced in invoices');
					toast.info(
						'Cannot delete company because it is referenced in invoices'
					);
				} else {
					// If the company is not referenced, proceed with deletion
					const confirmDelete = window.confirm(
						'Are you sure you want to delete this company?'
					);
					if (confirmDelete) {
						axios
							.delete(`${API}company/${companyId}`)
							.then((response) => {
								setCompanies((prevCompanies) =>
									prevCompanies.filter((company) => company._id !== companyId)
								);
								toast.success('Company deleted successfully');
							})
							.catch((error) => {
								console.error('Error deleting company:', error);
							});
						// console.log('deleted');
					}
				}
			})
			.catch((error) => {
				console.error('Error fetching invoices data:', error);
			});
	};

	const handleStateChange = (event) => {
		const selectedStateCode = stateOptions.find(
			(option) => option.statename === event.target.value
		)?.statecode;

		formik.setFieldValue('companystate', event.target.value);
		formik.setFieldValue('companypincode', selectedStateCode || '');

		formik.handleChange(event);
	};
	// dont remove this comment

	return (
		<div
			style={{
				backgroundImage: `url(${background})`,
				backgroundSize: 'cover',
				backgroundRepeat: 'no-repeat',
				minHeight: '100vh',
			}}
		>
			<UserNavbar />
			<div className='admin-company-manager'>
				<div className='admin-company-manager-data'>
					{showButton && (
						<button
							style={{ cursor: 'pointer' }}
							onClick={() => {
								setShowTable(!showTable);
								setShowButton(false);
							}}
							className='toggle-button'
						>
							{showTable ? 'Show Image' : 'Show Table'}
						</button>
					)}
					{showTable ? (
						<div>
							<input
								type='text'
								placeholder='Search Company...'
								className='admin-user-manage-form-input'
								value={searchInput}
								onChange={(e) => setSearchInput(e.target.value)}
							/>
							<h1 className='admin-company-manager-data-title'>
								ALL COMPANIES
							</h1>
							<div className='table-scroll-company'>
								<table className='admin-company-manager-data-table'>
									<thead className='admin-company-manager-data-table-head'>
										<tr className='admin-company-manager-data-table-row-head'>
											<th className='admin-company-manager-data-table-header'>
												Sl
											</th>
											<th className='admin-company-manager-data-table-header'>
												Company Name
											</th>
											<th className='admin-company-manager-data-table-header'>
												GST No
											</th>
											{/*
											<th className='admin-company-manager-data-table-header'>
												Contact
											</th>
                      
                      <th className='admin-company-manager-data-table-header'>
												Action
											</th>
*/}
											<th className='admin-company-manager-data-table-header'>
												Office Address
											</th>

											
										</tr>
									</thead>
									<tbody className='admin-company-manager-data-table-body'>
										{displayedCompaniesSearch.map((company, idx) => (
											<tr
												key={company._id}
												className='admin-company-manager-data-table-row-body'
											>
												<td className='admin-company-manager-data-table-data highlight'>
													{idx + 1}
												</td>
												<td className='admin-company-manager-data-table-data highlight'>
													{company.companyname.substring(0, 12)}
												</td>
												<td className='admin-company-manager-data-table-data'>
													{company.companygstno.substring(0, 12)}
												</td>
												{/*
												<td className='admin-company-manager-data-table-data'>
													{company.companycontact}
												</td>
                        <td className='admin-company-manager-data-table-data'>
													<button
														style={{
															background: 'none',
															border: 'none',
														}}
														onClick={() => handleCompanyUpdate(company._id)}
													>
														<img
															src={E}
															alt='Update'
															style={{
																height: '15px',
																width: '15px',
																cursor: 'pointer',
															}}
														/>
													</button>
													<button
														style={{
															background: 'none',
															border: 'none',
														}}
														onClick={() => {
															handleDeleteCompany(company._id);
														}}
													>
														<img
															src={D}
															alt='delete'
															style={{
																height: '15px',
																width: '15px',
																cursor: 'pointer',
															}}
														/>
													</button>
												</td>
*/}
												<td className='admin-company-manager-data-table-data'>
													{company.companyofficeaddress.substring(0, 12)}
												</td>
												
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					) : (
						<div className='admin-company-manager-image'>
							<img src={CompanyImage} alt='add company img' className='imge' />
						</div>
					)}
					<br />
					{/* <ReactPaginate
						className='pagination-container'
						previousLabel='Previous'
						nextLabel='Next'
						pageCount={pageCount}
						onPageChange={changePage}
						containerClassName='pagination'
						previousLinkClassName='previous-page'
						nextLinkClassName='next-page'
						disabledClassName='pagination-button disabled'
						activeClassName='pagination-button active'
						pageClassName='pagination-button'
						breakClassName='pagination-space'
					/> */}
				</div>
				<div className='admin-company-manager-form'>
					<h1 className='admin-company-manager-form-title'>
						{selectedCompanyId ? 'UPDATE COMPANY' : 'ADD COMPANY'}
					</h1>
					<form
						className='admin-company-manager-form-form'
						onSubmit={formik.handleSubmit}
					>
						<input
							type='text'
							required
							className='admin-company-manager-form-input-high'
							placeholder='Company Name'
							{...formik.getFieldProps('companyname')}
						/>
						{formik.touched.companyname && formik.errors.companyname ? (
							<div className='error-message'>{formik.errors.companyname}</div>
						) : null}

						<input
							type='text'
							required
							className='admin-company-manager-form-input-high'
							placeholder='GST No'
							{...formik.getFieldProps('companygstno')}
						/>
						{formik.touched.companygstno && formik.errors.companygstno ? (
							<div className='error-message'>{formik.errors.companygstno}</div>
						) : null}
						{/*
						<input
							type='tel'
							// required
							maxLength='10'
							className='admin-company-manager-form-input-high'
							placeholder='Contact'
							{...formik.getFieldProps('companycontact')}
						/>
						{formik.touched.companycontact && formik.errors.companycontact ? (
							<div className='error-message'>
								{formik.errors.companycontact}
							</div>
						) : null}
*/}

						<input
							type='text'
							required
							className='admin-company-manager-form-input-high'
							placeholder='Office Address'
							{...formik.getFieldProps('companyofficeaddress')}
						/>
						{formik.touched.companyofficeaddress &&
						formik.errors.companyofficeaddress ? (
							<div className='error-message'>
								{formik.errors.companyofficeaddress}
							</div>
						) : null}

						<select
							required
							className='admin-company-manager-form-input-high'
							value={formik.values.companystate}
							onChange={handleStateChange}
							onBlur={formik.handleBlur}
							name='companystate'
						>
							{stateOptions.map((option) => (
								<option key={option._id} value={option.statename}>
									{option.statename}
								</option>
							))}
						</select>
						{formik.touched.companystate && formik.errors.companystate ? (
							<div className='error-message'>{formik.errors.companystate}</div>
						) : null}

						<input
							type='number'
							pattern='[0-9]*'
							// required
							maxLength='6'
							disabled
							className='admin-company-manager-form-input-high'
							placeholder={`---State Code${formik.values.companypincode}---`}
							{...formik.getFieldProps('companypincode')}
						/>
						{/* {formik.touched.companypincode && formik.errors.companypincode ? (
							<div className='error-message'>
								{formik.errors.companypincode}
							</div>
						) : null} */}

						<br />
						<button type='submit' className='admin-company-manager-form-button'>
							{selectedCompanyId ? 'Update Company' : 'Add Company'}
						</button>
					</form>
				</div>
			</div>
			<ToastContainer />
		</div>
	);
}

export default UserCompanyManage;
