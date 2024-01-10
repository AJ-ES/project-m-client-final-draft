import React, { useState, useEffect } from 'react';
import './UserBuyerManage.css';
import axios from 'axios';
// import ReactPaginate from 'react-paginate';
import background from '../images/Desktop.png';
import UserNavbar from './UserNavbar';
import E from '../images/E.png';
import D from '../images/D.png';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UserBuyerManage() {
	const [buyers, setBuyers] = useState([]);
	// const [pageNumber, setPageNumber] = useState(0);
	const [selectedBuyerId, setSelectedBuyerId] = useState(null);

	// const [selectedBuyerData, setSelectedBuyerData] = useState({
	// 	buyerid: '',
	// 	buyercompanyname: '',
	// 	buyercompanygstno: '',
	// 	buyercompanyaddress: '',
	// 	buyercompanystatename: '',
	// 	buyercompanystatecode: '',
	// });

	const [file, setFile] = useState(null);
	const [states, setStates] = useState([]);
	const [selectedBuyers, setSelectedBuyers] = useState([]);
	const [isGroupDeleteClicked, setIsGroupDeleteClicked] = useState(false);

	const API = process.env.REACT_APP_API;

	// const itemsPerPage = 12;
	const stateOptions = [
		{ _id: 'default', statename: 'Select State', statecode: '----', __v: 0 },
		...states,
	];
	const [searchInput, setSearchInput] = useState('');

	const sortedBuyers = [...buyers].reverse();
	const displayedBuyerSearch = sortedBuyers.filter((item) => {
		const buyerCompanyName = item.buyercompanyname || '';

		if (buyerCompanyName.toLowerCase().includes(searchInput?.toLowerCase())) {
			return true;
		}

		return false;
	});
	// 	.slice(pageNumber * itemsPerPage, (pageNumber + 1) * itemsPerPage);

	// const pageCount = Math.ceil(sortedBuyers.length / itemsPerPage);

	// const changePage = ({ selected }) => {
	// 	setPageNumber(selected);
	// };

	useEffect(() => {
		axios
			.get(`${API}buyer`)
			.then((response) => {
				setBuyers(response.data);
			})
			.catch((error) => {
				console.error('Error fetching buyer data:', error);
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

	// Formik and Yup Validation
	const formik = useFormik({
		initialValues: {
			buyerid: '',
			buyercompanyname: '',
			buyercompanygstno: '',
			buyercompanyaddress: '',
			buyercompanystatename: '',
			buyercompanystatecode: '',
		},
		validationSchema: Yup.object({
			buyerid: Yup.string().required('Buyer ID is required'),
			buyercompanyname: Yup.string().required('Company Name is required'),
			buyercompanygstno: Yup.string()
				.required('GST No is required')
				.matches(
					/^[A-Z0-9]{15}$/,
					'GST No must be 15 characters long and contain only uppercase letters and numerics'
				),
			buyercompanyaddress: Yup.string().required('Company Address is required'),
			buyercompanystatename: Yup.string().required(
				'Company State Name is required'
			),
			buyercompanystatecode: Yup.string().required(
				'Company State Code is required'
			),
		}),
		onSubmit: (values) => {
			handleFormSubmit(values);
		},
	});

	const handleBuyerUpdate = (buyerUpdateId) => {
		setSelectedBuyerId(buyerUpdateId);
		const selectedBuyer = buyers.find((buyer) => buyer._id === buyerUpdateId);
		formik.setValues({ ...selectedBuyer });
	};

	const handleFormSubmit = (values) => {
		const selectedState = stateOptions.find(
			(option) => option.statename === values.companystate
		);
		if (selectedBuyerId) {
			axios
				.put(`${API}buyer/${selectedBuyerId}`, values)
				.then((response) => {
					setBuyers((prevBuyers) =>
						prevBuyers.map((buyer) =>
							buyer._id === selectedBuyerId ? response.data : buyer
						)
					);
					toast.success('Buyer Details are Updated Successfully');
				})
				.catch((error) => {
					console.error('Error updating buyer:', error);
					toast.error('Error In Updating the Buyer');
				});
		} else {
			axios
				.post(`${API}buyer`, values)
				.then((response) => {
					setBuyers((prevBuyers) => [...prevBuyers, response.data]);
					toast.success('Buyer Details are Saved Successfully');
				})
				.catch((error) => {
					console.error('Error creating buyer:', error);
					toast.error('Error creating buyer. Please try again.');
				});
		}

		formik.setValues({
			...values,
			companypincode: selectedState ? selectedState.statecode : '',
		});

		formik.resetForm();
		setSelectedBuyerId(null);
	};

	const handleFileChange = (event) => {
		const selectedFile = event.target.files[0];

		if (selectedFile) {
			toast.info(`Selected file: ${selectedFile.name}`);
		}

		setFile(selectedFile);
	};

	const handleFileUpload = async () => {
		try {
			if (!file) {
				toast.error('Please select a file before uploading.');
				return;
			}

			const formData = new FormData();
			formData.append('file', file);

			const response = await axios.post(`${API}buyer/upload`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});

			console.log('File uploaded successfully:', response.data);
			toast.success('File is Uploaded Successfully');
			window.location.reload();
		} catch (error) {
			console.error('Error uploading file:', error);
			toast.error('Error uploading file. Please try again.');
		}
	};

	// const handleBuyerDelete = (buyerId) => {
	// 	const confirmDelete = window.confirm(
	// 		'Are you sure you want to delete this Buyer?'
	// 	);

	// 	if (confirmDelete) {
	// 		axios
	// 			.delete(`${API}buyer/${buyerId}`)
	// 			.then((response) => {
	// 				setBuyers((prevBuyers) =>
	// 					prevBuyers.filter((buyer) => buyer._id !== buyerId)
	// 				);
	// 				toast.success('Buyer deleted successfully');
	// 			})
	// 			.catch((error) => {
	// 				console.error('Error deleting buyer:', error);
	// 				toast.error('Error deleting buyer. Please try again.');
	// 			});
	// 	}
	// };
	const handleBuyerDelete = (buyerId) => {
		// Fetch invoices data
		axios
			.get(`${API}invoice`)
			.then((invoicesResponse) => {
				const invoicesData = invoicesResponse.data;
				// console.log('invoicesData', invoicesData);

				// Get the buyer name associated with the buyer ID
				const buyerToDelete = buyers.find((buyer) => buyer._id === buyerId);
				// console.log('buyerToDelete', buyerToDelete);

				if (!buyerToDelete) {
					console.error('Company not found for deletion');
					return;
				}

				const buyerNameToDelete = buyerToDelete.buyercompanyname;
				// console.log('buyerNameToDelete', buyerNameToDelete);

				// Check if the buyer name exists in any of the invoices
				const isBuyerReferencedInInvoices = invoicesData.some(
					(invoice) =>
						invoice.buyerdetails.buyercompanyname === buyerNameToDelete
				);
				// console.log('isBuyerReferencedInInvoices', isBuyerReferencedInInvoices);

				if (isBuyerReferencedInInvoices) {
					// If the buyer is referenced in invoices, show a message and don't delete
					// alert('Cannot delete buyer because it is referenced in invoices');
					toast.info(
						'Cannot delete buyer because it is referenced in invoices'
					);
				} else {
					// If the buyer is not referenced, proceed with deletion
					const confirmDelete = window.confirm(
						'Are you sure you want to delete this Buyer?'
					);

					if (confirmDelete) {
						axios
							.delete(`${API}buyer/${buyerId}`)
							.then((response) => {
								setBuyers((prevBuyers) =>
									prevBuyers.filter((buyer) => buyer._id !== buyerId)
								);
								toast.success('Buyer deleted successfully');
							})
							.catch((error) => {
								console.error('Error deleting buyer:', error);
								toast.error('Error deleting buyer. Please try again.');
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

		formik.setFieldValue('buyercompanystatename', event.target.value);
		formik.setFieldValue('buyercompanystatecode', selectedStateCode || '');

		formik.handleChange(event);
	};

	// don
	const handleBuyerSelection = (buyerId) => {
		const updatedSelectedBuyers = selectedBuyers.includes(buyerId)
			? selectedBuyers.filter((id) => id !== buyerId)
			: [...selectedBuyers, buyerId];

		setSelectedBuyers(updatedSelectedBuyers);
	};

	const handleSelectAll = () => {
		if (selectedBuyers.length === displayedBuyerSearch.length) {
			setSelectedBuyers([]);
		} else {
			const allBuyerIds = displayedBuyerSearch.map((buyer) => buyer._id);
			setSelectedBuyers(allBuyerIds);
		}
	};

	const handleGroupDeleteClick = () => {
		setIsGroupDeleteClicked(true);
	};

	// const handleGroupDelete = () => {
	// 	const confirmDelete = window.confirm(
	// 		'Are you sure you want to delete selected buyers?'
	// 	);

	// 	if (confirmDelete) {
	// 		// console.log('Confirm delete');

	// 		// Create an array of promises for each buyer deletion
	// 		const deletePromises = selectedBuyers.map(async (buyerId) => {
	// 			try {
	// 				await axios.delete(`${API}buyer/${buyerId}`);
	// 				return buyerId;
	// 			} catch (error) {
	// 				console.error(`Error deleting buyer ${buyerId}:`, error);
	// 				return null;
	// 			}
	// 		});

	// 		// Wait for all promises to resolve
	// 		Promise.all(deletePromises)
	// 			.then((deletedBuyers) => {
	// 				// Filter out null values (failed deletions) and update the state
	// 				const updatedBuyers = buyers.filter(
	// 					(buyer) => !deletedBuyers.includes(buyer._id)
	// 				);
	// 				setBuyers(updatedBuyers);
	// 				toast.success('Selected buyers deleted successfully');
	// 			})
	// 			.catch((error) => {
	// 				console.error('Error deleting selected buyers:', error);
	// 				toast.error('Error deleting selected buyers. Please try again.');
	// 			});
	// 	}

	// 	setIsGroupDeleteClicked(false);
	// };

	const handleGroupDelete = () => {
		// Fetch invoices data
		axios
			.get(`${API}invoice`)
			.then((invoicesResponse) => {
				const invoicesData = invoicesResponse.data;

				// Filter out buyers that are referenced in invoices
				const buyersToDeleteNotReferenced = selectedBuyers.filter((buyerId) => {
					const buyerToDelete = buyers.find((buyer) => buyer._id === buyerId);

					if (!buyerToDelete) {
						console.error('Company not found for deletion');
						return false;
					}

					const buyerNameToDelete = buyerToDelete.buyercompanyname;

					// Check if the buyer name exists in any of the invoices
					const isBuyerReferencedInInvoices = invoicesData.some(
						(invoice) =>
							invoice.buyerdetails.buyercompanyname === buyerNameToDelete
					);

					return !isBuyerReferencedInInvoices;
				});

				if (buyersToDeleteNotReferenced.length === 0) {
					// All selected buyers are referenced in invoices, show a message
					toast.info(
						'None of the selected buyers can be deleted as they are referenced in invoices'
					);
				} else {
					// Confirm deletion for the buyers that are not referenced
					const confirmDelete = window.confirm(
						`Are you sure you want to delete the selected buyers?`
					);

					if (confirmDelete) {
						// Delete buyers that are not referenced
						Promise.all(
							buyersToDeleteNotReferenced.map((buyerId) =>
								axios.delete(`${API}buyer/${buyerId}`)
							)
						)
							.then(() => {
								// Update the state after successful deletion
								setBuyers((prevBuyers) =>
									prevBuyers.filter(
										(buyer) => !buyersToDeleteNotReferenced.includes(buyer._id)
									)
								);
								toast.success('Selected buyers deleted successfully');
							})
							.catch((error) => {
								console.error('Error deleting buyers:', error);
								toast.error('Error deleting buyers. Please try again.');
							});
					}
				}
				// Display info about companies not deleted due to reference
				const referencedBuyersNames = selectedBuyers
					.filter((buyerId) => !buyersToDeleteNotReferenced.includes(buyerId))
					.map((buyerId) => {
						const buyerToDelete = buyers.find((buyer) => buyer._id === buyerId);
						return buyerToDelete ? buyerToDelete.buyercompanyname : '';
					})
					.filter(Boolean);

				if (referencedBuyersNames.length > 0) {
					toast.info(
						`The following companies were not deleted due to being referenced in invoices: ${referencedBuyersNames.join(
							', '
						)}`
					);
				}
			})
			.catch((error) => {
				console.error('Error fetching invoices data:', error);
			});
	};

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

			<div className='admin-buyer-manage'>
				<div className='admin-buyer-manage-data'>
					<div className='admin-buyer-manage-data-header'>
						<h1 className='admin-buyer-manage-data-title'>ALL BUYERS</h1>
						                {/*
						<div className='admin-buyer-manage-file-upload'>
							<input
								className='admin-buyer-manage-file-upload-input'
								type='file'
								accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
								onChange={handleFileChange}
							/>
							<div className='upload-delete-btn-div'>
								<button
									className='admin-buyer-manage-file-upload-button'
									onClick={handleFileUpload}
								>
									Upload File
								</button>

								<div className='delete-btn-div'>
									<button
										style={{
											display: isGroupDeleteClicked ? 'none' : 'inline-block',
										}}
										className='admin-buyer-manage-file-upload-button'
										onClick={handleGroupDeleteClick}
									>
										Group Delete
									</button>
									{isGroupDeleteClicked && (
										<button
											// style={{ marginLeft: '15px' }}
											className='admin-buyer-manage-file-upload-button'
											onClick={handleGroupDelete}
										>
											Delete Selected
										</button>
									)}
								</div>
               
							</div>
						</div>
						<div>Total Buyers: {buyers.length}</div> */}
					</div>
					<input
						type='text'
						placeholder='Search Buyer...'
						className='admin-user-manage-form-input'
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
					/>
					<div className='table-scroll-buyer'>
						<table className='admin-buyer-manage-data-table'>
							<thead className='admin-buyer-manage-data-table-head'>
								<tr className='admin-buyer-manage-data-table-row-head'>
									<th className='admin-buyer-manage-data-table-header'>Sl</th>
									<th className='admin-buyer-manage-data-table-header'>
										Company Name
									</th>
									<th className='admin-buyer-manage-data-table-header'>
										GST NO
									</th>
									<th className='admin-buyer-manage-data-table-header'>
										State Name
									</th>
									<th className='admin-buyer-manage-data-table-header'>
										State Code
									</th>
                  {/*
									<th className='admin-buyer-manage-data-table-header'>
										Action
									</th>
                  */}
									{isGroupDeleteClicked && (
										<th className='admin-buyer-manage-data-table-header'>
											<input
												type='checkbox'
												checked={
													selectedBuyers.length === displayedBuyerSearch.length
												}
												onChange={() => handleSelectAll()}
											/>
										</th>
									)}
								</tr>
							</thead>
							<tbody className='admin-buyer-manage-data-table-body'>
								{displayedBuyerSearch.map((buyer, idx) => (
									<tr
										key={buyer._id}
										className='admin-buyer-manage-data-table-row-body'
									>
										<td className='admin-buyer-manage-data-table-data highlight'>
											{idx + 1}
										</td>
										<td className='admin-buyer-manage-data-table-data highlight'>
											{buyer.buyercompanyname?.substring(0, 12) ?? 'N/A'}
										</td>
										<td className='admin-buyer-manage-data-table-data'>
											{buyer.buyercompanygstno?.substring(0, 12) ?? 'N/A'}
										</td>
										<td className='admin-buyer-manage-data-table-data'>
											{buyer.buyercompanystatename?.substring(0, 12) ?? 'N/A'}
										</td>
										<td className='admin-buyer-manage-data-table-data'>
											{buyer.buyercompanystatecode?.substring(0, 12) ?? 'N/A'}
										</td>
                    {/*
										<td className='admin-buyer-manage-data-table-data'>
											
                      <button
												style={{
													background: 'none',
													border: 'none',
												}}
												onClick={() => handleBuyerUpdate(buyer._id)}
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
												onClick={() => handleBuyerDelete(buyer._id)}
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
                      
										</td>*/}
										{isGroupDeleteClicked && (
											<td className='admin-buyer-manage-data-table-data'>
												<input
													type='checkbox'
													checked={selectedBuyers.includes(buyer._id)}
													onChange={() => handleBuyerSelection(buyer._id)}
												/>
											</td>
										)}
									</tr>
								))}
							</tbody>
						</table>
					</div>

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
					<br />
				</div>
				<div className='admin-buyer-manage-form'>
					<h1 className='admin-buyer-manage-form-title'>
						{selectedBuyerId ? 'UPDATE BUYER' : 'ADD BUYER'}
					</h1>
					<form
						className='admin-buyer-manage-form-form'
						onSubmit={formik.handleSubmit}
					>
						<input
							type='text'
							required
							className='admin-buyer-manage-form-input'
							placeholder='Buyer ID'
							{...formik.getFieldProps('buyerid')}
						/>
						{formik.touched.buyerid && formik.errors.buyerid ? (
							<div className='error-message'>{formik.errors.buyerid}</div>
						) : null}

						<input
							type='text'
							required
							className='admin-buyer-manage-form-input'
							placeholder='Company Name'
							{...formik.getFieldProps('buyercompanyname')}
						/>
						{formik.touched.buyercompanyname &&
						formik.errors.buyercompanyname ? (
							<div className='error-message'>
								{formik.errors.buyercompanyname}
							</div>
						) : null}

						<input
							type='text'
							required
							className='admin-buyer-manage-form-input'
							placeholder='Company GST Number'
							pattern='[A-Z]'
							{...formik.getFieldProps('buyercompanygstno')}
						/>
						{formik.touched.buyercompanygstno &&
						formik.errors.buyercompanygstno ? (
							<div className='error-message'>
								{formik.errors.buyercompanygstno}
							</div>
						) : null}

						<input
							type='text'
							required
							className='admin-buyer-manage-form-input'
							placeholder='Company Address'
							{...formik.getFieldProps('buyercompanyaddress')}
						/>
						{formik.touched.buyercompanyaddress &&
						formik.errors.buyercompanyaddress ? (
							<div className='error-message'>
								{formik.errors.buyercompanyaddress}
							</div>
						) : null}

						<select
							required
							className='admin-buyer-manage-form-input'
							value={formik.values.buyercompanystatename}
							onChange={handleStateChange}
							onBlur={formik.handleBlur}
							name='buyercompanystatename'
						>
							{stateOptions.map((option) => (
								<option key={option._id} value={option.statename}>
									{option.statename}
								</option>
							))}
						</select>
						{formik.touched.buyercompanystatename &&
						formik.errors.buyercompanystatename ? (
							<div className='error-message'>
								{formik.errors.buyercompanystatename}
							</div>
						) : null}

						<input
							type='text'
							pattern='[0-9]*'
							// required
							disabled
							maxLength='6'
							className='admin-buyer-manage-form-input'
							placeholder={`---State Code${formik.values.buyercompanystatecode}---`}
							{...formik.getFieldProps('buyercompanystatecode')}
						/>
						{formik.touched.buyercompanystatecode &&
						formik.errors.buyercompanystatecode ? (
							<div className='error-message'>
								{formik.errors.buyercompanystatecode}
							</div>
						) : null}

						<br />
						<button type='submit' className='admin-buyer-manage-form-button'>
							{selectedBuyerId ? 'Update' : 'Add'}
						</button>
					</form>
				</div>
			</div>
			<ToastContainer position='top-right' autoClose={3000} />
		</div>
	);
}

export default UserBuyerManage;
