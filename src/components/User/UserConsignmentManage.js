import React, { useState, useEffect } from 'react';
import './UserConsignmentManage.css';
import axios from 'axios';
import background from '../images/Desktop.png';
// import ReactPaginate from 'react-paginate';
import UserNavbar from './UserNavbar';
import E from '../images/E.png';
import D from '../images/D.png';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UserConsignmentManage() {
	const [consignedItems, setConsignedItems] = useState([]);
	const [selectedConsignmentId, setSelectedConsignmentId] = useState(null);
	const API = process.env.REACT_APP_API;

	const [searchInput, setSearchInput] = useState('');
	// const itemsPerPage = 12;
	// const [pageNumber, setPageNumber] = useState(0);

	const sortedConsigned = [...consignedItems].reverse();
	const displayedConsignedSearch = sortedConsigned.filter((item) =>
		item.itemname.toLowerCase().includes(searchInput.toLowerCase())
	);
	// 	.slice(pageNumber * itemsPerPage, (pageNumber + 1) * itemsPerPage);

	// const pageCount = Math.ceil(consignedItems.length / itemsPerPage);

	useEffect(() => {
		axios
			.get(`${API}consignment`)
			.then((response) => {
				setConsignedItems(response.data);
			})
			.catch((error) => {
				console.error('Error fetching consignment data:', error);
			});
	}, [API]);

	// Formik and Yup Validation
	const formik = useFormik({
		initialValues: {
			itemname: '',
			itemquantity: '',
			itemhsn: '',
			itemprice: '',
			itemtaxrate: '',
		},
		validationSchema: Yup.object({
			itemname: Yup.string().required('Item Name is required'),
			itemquantity: Yup.number().required('Item Quantity is required'),
			itemhsn: Yup.number().required('Item HSN is required'),
			itemprice: Yup.number().required('Item Price is required'),
			itemtaxrate: Yup.number().required('Item Tax Rate is required'),
		}),
		onSubmit: (values) => {
			handleFormSubmit(values);
		},
	});

	const handleConsignmentUpdate = (consignmentUpdateId) => {
		setSelectedConsignmentId(consignmentUpdateId);
		const selectedConsignment = consignedItems.find(
			(consignment) => consignment._id === consignmentUpdateId
		);
		formik.setValues({ ...selectedConsignment });
	};

	// const changePage = ({ selected }) => {
	// 	setPageNumber(selected);
	// };

	const handleFormSubmit = (values) => {
		if (selectedConsignmentId) {
			axios
				.put(`${API}consignment/${selectedConsignmentId}`, values)
				.then((response) => {
					setConsignedItems((prevConsignedItems) =>
						prevConsignedItems.map((consignment) =>
							consignment._id === selectedConsignmentId
								? response.data
								: consignment
						)
					);
					toast.success('Consignment Details are Updated Successfully');
				})
				.catch((error) => {
					console.error('Error updating consignment:', error);
					toast.error('Error In Updating the Consignment');
				});
		} else {
			axios
				.post(`${API}consignment`, values)
				.then((response) => {
					setConsignedItems((prevConsignedItems) => [
						...prevConsignedItems,
						response.data,
					]);
					toast.success('Consignment Details are Saved Successfully');
				})
				.catch((error) => {
					console.error('Error creating consignment:', error);
					toast.error('Error creating consignment. Please try again.');
				});
		}

		formik.resetForm();
		setSelectedConsignmentId(null);
	};

	// const handleDeleteConsignment = (consignmentId) => {
	// 	const confirmDelete = window.confirm(
	// 		'Are you sure you want to delete this Consignment?'
	// 	);

	// 	if (confirmDelete) {
	// 		axios
	// 			.delete(`${API}consignment/${consignmentId}`)
	// 			.then((response) => {
	// 				setConsignedItems((prevConsignedItems) =>
	// 					prevConsignedItems.filter(
	// 						(consignment) => consignment._id !== consignmentId
	// 					)
	// 				);
	// 				toast.success('Consignment deleted successfully');
	// 			})
	// 			.catch((error) => {
	// 				console.error('Error deleting consignment:', error);
	// 				toast.error('Error deleting consignment. Please try again.');
	// 			});
	// 	}
	// };

	const handleDeleteConsignment = (consignmentId) => {
		// Fetch invoices data
		axios
			.get(`${API}invoice`)
			.then((invoicesResponse) => {
				const invoicesData = invoicesResponse.data;
				// console.log('invoicesData', invoicesData);

				// Get the consignment details associated with the consignment ID
				const consignmentToDelete = consignedItems.find(
					(consignment) => consignment._id === consignmentId
				);
				// console.log('consignmentToDelete', consignmentToDelete);

				if (!consignmentToDelete) {
					console.error('Consignment not found for deletion');
					return;
				}

				// Check if the consignment itemname exists in any of the invoices
				const isConsignmentReferencedInInvoices = invoicesData.some((invoice) =>
					invoice.consignmentdetails.itemdetails.some(
						(item) => item.itemname === consignmentToDelete.itemname
					)
				);

				if (isConsignmentReferencedInInvoices) {
					// If the consignment is referenced in invoices, show a message and don't delete
					toast.info(
						'Cannot delete consignment because it is referenced in invoices'
					);
				} else {
					// If the consignment is not referenced, proceed with deletion
					const confirmDelete = window.confirm(
						'Are you sure you want to delete this Consignment?'
					);

					if (confirmDelete) {
						// Make an API call to delete the consignment
						axios
							.delete(`${API}consignment/${consignmentId}`)
							.then((response) => {
								// Update the local state to reflect the removal of the consignment
								setConsignedItems((prevConsignedItems) =>
									prevConsignedItems.filter(
										(consignment) => consignment._id !== consignmentId
									)
								);
								// Display a success toast message
								toast.success('Consignment deleted successfully');
							})
							.catch((error) => {
								// Handle error during deletion
								console.error('Error deleting consignment:', error);
								toast.error('Error deleting consignment. Please try again.');
							});
					}
				}
			})
			.catch((error) => {
				// Handle error fetching invoices data
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
			<div className='admin-consignment-manage'>
				<div className='admin-consignment-manage-data'>
					<h1 className='admin-consignment-manage-data-title'>
						ALL CONSIGNMENTS
					</h1>
					<input
						type='text'
						placeholder='Search Item Name...'
						className='admin-consignment-manage-form-input'
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
					/>
					<div className='table-scroll-consignment'>
						<table className='admin-consignment-manage-data-table'>
							<thead className='admin-consignment-manage-data-table-head'>
								<tr className='admin-consignment-manage-data-table-row-head'>
									<th className='admin-consignment-manage-data-table-header'>
										Sl
									</th>
									<th className='admin-consignment-manage-data-table-header'>
										Item Name
									</th>
									<th className='admin-consignment-manage-data-table-header'>
										Item Quantity
									</th>
									<th className='admin-consignment-manage-data-table-header'>
										Item HSN
									</th>
									<th className='admin-consignment-manage-data-table-header'>
										Item Price
									</th>
									<th className='admin-consignment-manage-data-table-header'>
										Item Tax Rate
									</th>
                  {/*
									<th className='admin-consignment-manage-data-table-header'>
										Action
									</th>
                  */}
								</tr>
							</thead>
							<tbody className='admin-consignment-manage-data-table-body'>
								{displayedConsignedSearch.map((item, idx) => (
									<tr
										key={item._id}
										className='admin-consignment-manage-data-table-row-body'
									>
										<td className='admin-consignment-manage-data-table-data highlight'>
											{idx + 1}
										</td>
										<td className='admin-consignment-manage-data-table-data highlight'>
											{item.itemname}
										</td>
										<td className='admin-consignment-manage-data-table-data'>
											{item.itemquantity}
										</td>
										<td className='admin-consignment-manage-data-table-data'>
											{item.itemhsn}
										</td>
										<td className='admin-consignment-manage-data-table-data'>
											{item.itemprice}
										</td>
										<td className='admin-consignment-manage-data-table-data'>
											{item.itemtaxrate}
										</td>
{/*
										<td className='admin-consignment-manage-data-table-data'>
											<button
												style={{
													background: 'none',
													border: 'none',
												}}
												onClick={() => handleConsignmentUpdate(item._id)}
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
												onClick={() => handleDeleteConsignment(item._id)}
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
				<div className='admin-consignment-manage-form'>
					<h1 className='admin-consignment-manage-form-title'>
						{selectedConsignmentId ? 'UPDATE CONSIGNMENT' : 'ADD CONSIGNMENT'}
					</h1>
					<form
						className='admin-consignment-manage-form-form'
						onSubmit={formik.handleSubmit}
					>
						<input
							type='text'
							required
							className='admin-consignment-manage-form-input'
							placeholder='Item Name'
							{...formik.getFieldProps('itemname')}
						/>
						{formik.touched.itemname && formik.errors.itemname ? (
							<div className='error-message'>{formik.errors.itemname}</div>
						) : null}

						<input
							type='number'
							required
							pattern='[0-9]*'
							className='admin-consignment-manage-form-input'
							placeholder='Item Quantity'
							{...formik.getFieldProps('itemquantity')}
						/>
						{formik.touched.itemquantity && formik.errors.itemquantity ? (
							<div className='error-message'>{formik.errors.itemquantity}</div>
						) : null}

						<input
							type='number'
							pattern='[0-9]*'
							required
							className='admin-consignment-manage-form-input'
							placeholder='Item HSN'
							{...formik.getFieldProps('itemhsn')}
						/>
						{formik.touched.itemhsn && formik.errors.itemhsn ? (
							<div className='error-message'>{formik.errors.itemhsn}</div>
						) : null}

						<input
							type='number'
							required
							pattern='[0-9]*'
							className='admin-consignment-manage-form-input'
							placeholder='Item Price'
							{...formik.getFieldProps('itemprice')}
						/>
						{formik.touched.itemprice && formik.errors.itemprice ? (
							<div className='error-message'>{formik.errors.itemprice}</div>
						) : null}

						<input
							type='number'
							pattern='[0-9]*'
							required
							className='admin-consignment-manage-form-input'
							placeholder='Item Tax Rate'
							{...formik.getFieldProps('itemtaxrate')}
						/>
						{formik.touched.itemtaxrate && formik.errors.itemtaxrate ? (
							<div className='error-message'>{formik.errors.itemtaxrate}</div>
						) : null}

						<br />
						<button
							type='submit'
							className='admin-consignment-manage-form-button'
						>
							{selectedConsignmentId ? 'Update' : 'Add'}
						</button>
					</form>
				</div>
			</div>
			<ToastContainer position='top-right' autoClose={3000} />
		</div>
	);
}

export default UserConsignmentManage;
