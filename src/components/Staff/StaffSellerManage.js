import React, { useState, useEffect } from 'react';
import './StaffSellerManage.css';
import axios from 'axios';
// import ReactPaginate from 'react-paginate';
import StaffNavbar from './StaffNavbar';
import background from '../images/Desktop.png';
import E from '../images/E.png';
import D from '../images/D.png';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function StaffSellerManage() {
	const [sellers, setSellers] = useState([]);
	// const [pageNumber, setPageNumber] = useState(0);
	const [selectedSellerId, setSelectedSellerId] = useState(null);
	// const [selectedSellerData, setSelectedSellerData] = useState({
	// 	sellerid: '',
	// 	sellercompanyname: '',
	// 	sellercompanygstno: '',
	// 	sellercompanyaddress: '',
	// 	sellercompanystatename: '',
	// 	sellercompanystatecode: '',
	// });
	const [file, setFile] = useState(null);
	const [states, setStates] = useState([]);
	const [selectedSellers, setSelectedSellers] = useState([]);
	const [isGroupDeleteClicked, setIsGroupDeleteClicked] = useState(false);

	const API = process.env.REACT_APP_API;
	// const itemsPerPage = 12;

	const stateOptions = [
		{ _id: 'default', statename: 'Select State', statecode: '----', __v: 0 },
		...states,
	];
	const [searchInput, setSearchInput] = useState('');

	const sortedSellers = [...sellers].reverse();
	const displayedSellerSearch = sortedSellers.filter((item) => {
		const sellerCompanyName = item.sellercompanyname || '';

		if (sellerCompanyName.toLowerCase().includes(searchInput?.toLowerCase())) {
			return true;
		}

		return false;
	});
	// 	.slice(pageNumber * itemsPerPage, (pageNumber + 1) * itemsPerPage);

	// const pageCount = Math.ceil(sortedSellers.length / itemsPerPage);

	// const changePage = ({ selected }) => {
	// 	setPageNumber(selected);
	// };

	useEffect(() => {
		axios
			.get(`${API}seller`)
			.then((response) => {
				setSellers(response.data);
			})
			.catch((error) => {
				console.error('Error fetching seller data:', error);
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
			sellerid: '',
			sellercompanyname: '',
			//sellercompanygstno: '',
			sellercompanyaddress: '',
			sellercompanystatename: '',
			sellercompanystatecode: '',
		},
		validationSchema: Yup.object({
			sellerid: Yup.string().required('Agent ID is required'),
			sellercompanyname: Yup.string().required('Company Name is required'),
			//sellercompanygstno: Yup.string().required('GST Number is required'),
			sellercompanyaddress: Yup.string().required(
				'Company Address is required'
			),
			sellercompanystatename: Yup.string().required(
				'Company State Name is required'
			),
			sellercompanystatecode: Yup.string().required(
				'Company State Code is required'
			),
		}),
		onSubmit: (values) => {
			handleFormSubmit(values);
		},
	});

	const handleSellerUpdate = (sellerUpdateId) => {
		setSelectedSellerId(sellerUpdateId);
		const selectedSeller = sellers.find(
			(seller) => seller._id === sellerUpdateId
		);
		formik.setValues({ ...selectedSeller });
	};

	const handleFormSubmit = (values) => {
		const selectedState = stateOptions.find(
			(option) => option.statename === values.companystate
		);
		if (selectedSellerId) {
			axios
				.put(`${API}seller/${selectedSellerId}`, values)
				.then((response) => {
					setSellers((prevSellers) =>
						prevSellers.map((seller) =>
							seller._id === selectedSellerId ? response.data : seller
						)
					);
					toast.success('Agent Details are Updated Successfully');
				})
				.catch((error) => {
					console.error('Error updating seller:', error);
					toast.error('Error In Updating the Agent');
				});
		} else {
			axios
				.post(`${API}seller`, values)
				.then((response) => {
					setSellers((prevSellers) => [...prevSellers, response.data]);
					toast.success('Agent Details are Saved Successfully');
				})
				.catch((error) => {
					console.error('Error creating seller:', error);
					toast.error('Error creating seller. Please try again.');
				});
		}

		formik.setValues({
			...values,
			companypincode: selectedState ? selectedState.statecode : '',
		});

		formik.resetForm();
		setSelectedSellerId(null);
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

			const response = await axios.post(`${API}seller/upload`, formData, {
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

	// const handleSellerDelete = (sellerId) => {
	// 	const confirmDelete = window.confirm(
	// 		'Are you sure you want to delete this Seller?'
	// 	);

	// 	if (confirmDelete) {
	// 		axios
	// 			.delete(`${API}seller/${sellerId}`)
	// 			.then((response) => {
	// 				setSellers((prevSellers) =>
	// 					prevSellers.filter((seller) => seller._id !== sellerId)
	// 				);
	// 				toast.success('Seller deleted successfully');
	// 			})
	// 			.catch((error) => {
	// 				console.error('Error deleting seller:', error);
	// 				toast.error('Error deleting seller. Please try again.');
	// 			});
	// 	}
	// };
	const handleSellerDelete = (sellerId) => {
		// Fetch invoices data
		axios
			.get(`${API}invoice`)
			.then((invoicesResponse) => {
				const invoicesData = invoicesResponse.data;
				// console.log('invoicesData', invoicesData);

				// Get the seller name associated with the seller ID
				const sellerToDelete = sellers.find(
					(seller) => seller._id === sellerId
				);
				// console.log('sellerToDelete', sellerToDelete);

				if (!sellerToDelete) {
					console.error('Company not found for deletion');
					return;
				}

				const sellerNameToDelete = sellerToDelete.sellercompanyname;
				// console.log('sellerNameToDelete', sellerNameToDelete);

				// Check if the seller name exists in any of the invoices
				const isSellerReferencedInInvoices = invoicesData.some(
					(invoice) =>
						invoice.sellerdetails.sellercompanyname === sellerNameToDelete
				);
				// console.log(
				// 	'isSellerReferencedInInvoices',
				// 	isSellerReferencedInInvoices
				// );

				if (isSellerReferencedInInvoices) {
					// If the seller is referenced in invoices, show a message and don't delete
					// alert('Cannot delete seller because it is referenced in invoices');
					toast.info(
						'Cannot delete seller because it is referenced in invoices'
					);
				} else {
					// If the seller is not referenced, proceed with deletion
					const confirmDelete = window.confirm(
						'Are you sure you want to delete this Seller?'
					);

					if (confirmDelete) {
						axios
							.delete(`${API}seller/${sellerId}`)
							.then((response) => {
								setSellers((prevSellers) =>
									prevSellers.filter((seller) => seller._id !== sellerId)
								);
								toast.success('Seller deleted successfully');
							})
							.catch((error) => {
								console.error('Error deleting seller:', error);
								toast.error('Error deleting seller. Please try again.');
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

		formik.setFieldValue('sellercompanystatename', event.target.value);
		formik.setFieldValue('sellercompanystatecode', selectedStateCode || '');

		formik.handleChange(event);
	};

	// don
	const handleSellerSelection = (sellerId) => {
		const updatedSelectedSellers = selectedSellers.includes(sellerId)
			? selectedSellers.filter((id) => id !== sellerId)
			: [...selectedSellers, sellerId];

		setSelectedSellers(updatedSelectedSellers);
	};

	const handleSelectAll = () => {
		if (selectedSellers.length === displayedSellerSearch.length) {
			setSelectedSellers([]);
		} else {
			const allSellerIds = displayedSellerSearch.map((seller) => seller._id);
			setSelectedSellers(allSellerIds);
		}
	};

	const handleGroupDeleteClick = () => {
		setIsGroupDeleteClicked(true);
	};

	// const handleGroupDelete = () => {
	// 	const confirmDelete = window.confirm(
	// 		'Are you sure you want to delete selected sellers?'
	// 	);

	// 	if (confirmDelete) {
	// 		// console.log('Confirm delete');

	// 		// Create an array of promises for each seller deletion
	// 		const deletePromises = selectedSellers.map(async (sellerId) => {
	// 			try {
	// 				await axios.delete(`${API}seller/${sellerId}`);
	// 				return sellerId;
	// 			} catch (error) {
	// 				console.error(`Error deleting seller ${sellerId}:`, error);
	// 				return null;
	// 			}
	// 		});

	// 		// Wait for all promises to resolve
	// 		Promise.all(deletePromises)
	// 			.then((deletedSellers) => {
	// 				// Filter out null values (failed deletions) and update the state
	// 				const updatedSellers = sellers.filter(
	// 					(seller) => !deletedSellers.includes(seller._id)
	// 				);
	// 				setSellers(updatedSellers);
	// 				toast.success('Selected sellers deleted successfully');
	// 			})
	// 			.catch((error) => {
	// 				console.error('Error deleting selected sellers:', error);
	// 				toast.error('Error deleting selected sellers. Please try again.');
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

				// Filter out sellers that are referenced in invoices
				const sellersToDeleteNotReferenced = selectedSellers.filter(
					(sellerId) => {
						const sellerToDelete = sellers.find(
							(seller) => seller._id === sellerId
						);

						if (!sellerToDelete) {
							console.error('Seller not found for deletion');
							return false;
						}

						const sellerNameToDelete = sellerToDelete.sellercompanyname;

						// Check if the seller name exists in any of the invoices
						const isSellerReferencedInInvoices = invoicesData.some(
							(invoice) =>
								invoice.sellerdetails.sellercompanyname === sellerNameToDelete
						);

						return !isSellerReferencedInInvoices;
					}
				);

				if (sellersToDeleteNotReferenced.length === 0) {
					// All selected sellers are referenced in invoices, show a message
					toast.info(
						'None of the selected sellers can be deleted as they are referenced in invoices'
					);
				} else {
					// Confirm deletion for the sellers that are not referenced
					const confirmDelete = window.confirm(
						`Are you sure you want to delete the selected sellers?`
					);

					if (confirmDelete) {
						// Delete sellers that are not referenced
						Promise.all(
							sellersToDeleteNotReferenced.map((sellerId) =>
								axios.delete(`${API}seller/${sellerId}`)
							)
						)
							.then(() => {
								// Update the state after successful deletion
								setSellers((prevSellers) =>
									prevSellers.filter(
										(seller) =>
											!sellersToDeleteNotReferenced.includes(seller._id)
									)
								);
								toast.success('Selected sellers deleted successfully');
							})
							.catch((error) => {
								console.error('Error deleting sellers:', error);
								toast.error('Error deleting sellers. Please try again.');
							});
					}
				}
				// Display info about companies not deleted due to reference
				const referencedSellersNames = selectedSellers
					.filter(
						(sellerId) => !sellersToDeleteNotReferenced.includes(sellerId)
					)
					.map((sellerId) => {
						const sellerToDelete = sellers.find(
							(seller) => seller._id === sellerId
						);
						return sellerToDelete ? sellerToDelete.sellercompanyname : '';
					})
					.filter(Boolean);

				if (referencedSellersNames.length > 0) {
					toast.info(
						`The following companies were not deleted due to being referenced in invoices: ${referencedSellersNames.join(
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
			<StaffNavbar />

			<div className='admin-seller-manage'>
				<div className='admin-seller-manage-data'>
					<div className='admin-seller-manage-data-header'>
						<h1 className='admin-seller-manage-data-title'>ALL AGENTS</h1>
						{/*
            <div className='admin-seller-manage-file-upload'>
							<input
								className='admin-seller-manage-file-upload-input'
								type='file'
								accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
								onChange={handleFileChange}
							/>
							<div className='upload-delete-btn-div'>
								<button
									className='admin-seller-manage-file-upload-button'
									onClick={handleFileUpload}
								>
									Upload File
								</button>
    
                <div className='delete-btn-div'>
									<button
										style={{
											display: isGroupDeleteClicked ? 'none' : 'inline-block',
										}}
										className='admin-seller-manage-file-upload-button'
										onClick={handleGroupDeleteClick}
									>
										Group Delete
									</button>
									{isGroupDeleteClicked && (
										<button
											// style={{ marginLeft: '15px' }}
											className='admin-seller-manage-file-upload-button'
											onClick={handleGroupDelete}
										>
											Delete Selected
										</button>
									)}
								</div>
              
							</div>
						</div>
            <div>Total Agents: {sellers.length}</div> */}
					</div>
					<input
						type='text'
						placeholder='Search Agents...'
						className='admin-user-manage-form-input'
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
					/>
					<div className='table-scroll-agent'>
						<table className='admin-seller-manage-data-table'>
							<thead className='admin-seller-manage-data-table-head'>
								<tr className='admin-seller-manage-data-table-row-head'>
									<th className='admin-seller-manage-data-table-header'>Sl</th>
									<th className='admin-seller-manage-data-table-header'>
										Agents Id
									</th>
									<th className='admin-seller-manage-data-table-header'>
										Agent Name
									</th>
{/*
									<th className='admin-seller-manage-data-table-header'>
										GST NO
									</th>
*/}
									<th className='admin-seller-manage-data-table-header'>
										State Name
									</th>
									<th className='admin-seller-manage-data-table-header'>
										State Code
									</th>
									<th className='admin-seller-manage-data-table-header'>
										Action
									</th>
									{isGroupDeleteClicked && (
										<th className='admin-seller-manage-data-table-header'>
											<input
												type='checkbox'
												checked={
													selectedSellers.length ===
													displayedSellerSearch.length
												}
												onChange={() => handleSelectAll()}
											/>
										</th>
									)}
								</tr>
							</thead>
							<tbody className='admin-seller-manage-data-table-body'>
								{displayedSellerSearch.map((seller, idx) => (
									<tr
										key={seller._id}
										className='admin-seller-manage-data-table-row-body'
									>
										<td className='admin-seller-manage-data-table-data highlight'>
											{idx + 1}
										</td>
										<td className='admin-seller-manage-data-table-data highlight'>
											{seller.sellerid?.substring(0, 12) ?? 'N/A'}
										</td>
										<td className='admin-seller-manage-data-table-data'>
											{seller.sellercompanyname?.substring(0, 18) ?? 'N/A'}
										</td>
										<td className='admin-seller-manage-data-table-data'>
											{seller.sellercompanystatename?.substring(0, 12) ?? 'N/A'}
										</td>
										<td className='admin-seller-manage-data-table-data'>
											{seller.sellercompanystatename?.substring(0, 12) ?? 'N/A'}
										</td>
										<td className='admin-seller-manage-data-table-data'>
											<button
												style={{
													background: 'none',
													border: 'none',
												}}
												onClick={() => handleSellerUpdate(seller._id)}
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
                      {/*
											<button
												style={{
													background: 'none',
													border: 'none',
												}}
												onClick={() => handleSellerDelete(seller._id)}
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
                        */}
										</td>
										{isGroupDeleteClicked && (
											<td className='admin-seller-manage-data-table-data'>
												<input
													type='checkbox'
													checked={selectedSellers.includes(seller._id)}
													onChange={() => handleSellerSelection(seller._id)}
												/>
											</td>
										)}
									</tr>
								))}
							</tbody>
						</table>
					</div>
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
				<div className='admin-seller-manage-form'>
					<h1 className='admin-seller-manage-form-title'>
						{selectedSellerId ? 'UPDATE AGENT' : 'ADD AGENT'}
					</h1>
					<form
						className='admin-seller-manage-form-form'
						onSubmit={formik.handleSubmit}
					>
						<input
							type='text'
							required
							className='admin-seller-manage-form-input'
							placeholder='Agent ID'
							{...formik.getFieldProps('sellerid')}
						/>
						{formik.touched.sellerid && formik.errors.sellerid ? (
							<div className='error-message'>{formik.errors.sellerid}</div>
						) : null}

						<input
							type='text'
							required
							className='admin-seller-manage-form-input'
							placeholder='Company Name'
							{...formik.getFieldProps('sellercompanyname')}
						/>
						{formik.touched.sellercompanyname &&
						formik.errors.sellercompanyname ? (
							<div className='error-message'>
								{formik.errors.sellercompanyname}
							</div>
						) : null}
{/*
						<input
							type='text'
							required
							className='admin-seller-manage-form-input'
							placeholder='Company GST Number'
							{...formik.getFieldProps('sellercompanygstno')}
						/>
						{formik.touched.sellercompanygstno &&
						formik.errors.sellercompanygstno ? (
							<div className='error-message'>
								{formik.errors.sellercompanygstno}
							</div>
						) : null}
*/}
						<input
							type='text'
							required
							className='admin-seller-manage-form-input'
							placeholder='Company Address'
							{...formik.getFieldProps('sellercompanyaddress')}
						/>
						{formik.touched.sellercompanyaddress &&
						formik.errors.sellercompanyaddress ? (
							<div className='error-message'>
								{formik.errors.sellercompanyaddress}
							</div>
						) : null}

						<select
							required
							className='admin-seller-manage-form-input'
							value={formik.values.sellercompanystatename}
							onChange={handleStateChange}
							onBlur={formik.handleBlur}
							name='sellercompanystatename'
						>
							{stateOptions.map((option) => (
								<option key={option._id} value={option.statename}>
									{option.statename}
								</option>
							))}
						</select>
						{formik.touched.sellercompanystatename &&
						formik.errors.sellercompanystatename ? (
							<div className='error-message'>
								{formik.errors.sellercompanystatename}
							</div>
						) : null}

						<input
							type='text'
							pattern='[0-9]*'
							// required
							disabled
							maxLength='6'
							className='admin-seller-manage-form-input'
							placeholder={`---State Code${formik.values.sellercompanystatecode}---`}
							{...formik.getFieldProps('sellercompanystatecode')}
						/>
						{formik.touched.sellercompanystatecode &&
						formik.errors.sellercompanystatecode ? (
							<div className='error-message'>
								{formik.errors.sellercompanystatecode}
							</div>
						) : null}

						<br />
						<button type='submit' className='admin-seller-manage-form-button'>
							{selectedSellerId ? 'Update' : 'Add'}
						</button>
					</form>
				</div>
			</div>
			<ToastContainer position='top-right' autoClose={3000} />
		</div>
	);
}

export default StaffSellerManage;
