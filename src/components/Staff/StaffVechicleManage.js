import React, { useState, useEffect } from 'react';
import '../Admin/AdminVechicleManage.css';
import '../Admin/AdminStateManage.css';
import axios from 'axios';
import background from '../images/Desktop.png';
// import ReactPaginate from 'react-paginate';
import StaffNavbar from './StaffNavbar';
import E from '../images/E.png';
import D from '../images/D.png';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function StaffLoadingManage() {
	const [loadings, setLoadings] = useState([]);
	// const [pageNumber, setPageNumber] = useState(0);
	const [selectedLoadingId, setSelectedLoadingId] = useState(null);
	const [states, setStates] = useState([]);
	const [selectedStateId, setSelectedStateId] = useState(null);
	const API = process.env.REACT_APP_API;

	const validationSchema = Yup.object().shape({
		startpoint: Yup.string().required('Start Point is required'),
		endpoint: Yup.string().required('End Point is required'),
		rate: Yup.number()
			.required('Rate is required')
			.positive('Rate must be positive'),
	});

	const stateValidationSchema = Yup.object().shape({
		statename: Yup.string().required('State Name is required'),
		statecode: Yup.string().required('State Code is required'),
	});

	const formik = useFormik({
		initialValues: {
			startpoint: '',
			endpoint: '',
			rate: '',
		},
		validationSchema: validationSchema,
		onSubmit: (values) => {
			handleFormSubmit(values);
		},
	});

	const stateFormik = useFormik({
		initialValues: {
			statename: '',
			statecode: '',
		},
		stateValidationSchema: stateValidationSchema,
		onSubmit: (values) => {
			handleStateFormSubmit(values);
		},
	});

	// const itemsPerPage = 12;
	const [searchInput, setSearchInput] = useState('');
	const [searchStateInput, setSearchStateInput] = useState('');

	const sortedLoadings = [...loadings].reverse();
	const sortedStates = [...states].reverse();
	const displayedLoadingsSearch = sortedLoadings.filter(
		(item) =>
			item.startpoint.toLowerCase().includes(searchInput.toLowerCase()) ||
			item.endpoint.toLowerCase().includes(searchInput.toLowerCase())
	);
	const displayedStatesSearch = sortedStates.filter(
		(item) =>
			(item.statename &&
				item.statename
					.toLowerCase()
					.includes(searchStateInput.toLowerCase())) ||
			(item.statecode &&
				item.statecode.toLowerCase().includes(searchStateInput.toLowerCase()))
	);
	// 	.slice(pageNumber * itemsPerPage, (pageNumber + 1) * itemsPerPage);

	// const pageCount = Math.ceil(sortedLoadings.length / itemsPerPage);

	// const changePage = ({ selected }) => {
	// 	setPageNumber(selected);
	// };

	useEffect(() => {
		axios
			.get(`${API}load`)
			.then((response) => {
				setLoadings(response.data);
			})
			.catch((error) => {
				console.error('Error fetching loading data:', error);
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

	const handleLoadingUpdate = (loadingUpdateId) => {
		const selectedLoading = loadings.find(
			(loading) => loading._id === loadingUpdateId
		);
		setSelectedLoadingId(loadingUpdateId);
		formik.setValues({
			startpoint: selectedLoading.startpoint,
			endpoint: selectedLoading.endpoint,
			rate: selectedLoading.rate,
		});
	};
	const handleStateUpdate = (stateUpdateId) => {
		const selectedState = states.find((state) => state._id === stateUpdateId);
		setSelectedStateId(stateUpdateId);
		stateFormik.setValues({
			statename: selectedState.statename,
			statecode: selectedState.statecode,
		});
	};

	const handleLoadingDelete = (loadingDeleteId) => {
		const isConfirmed = window.confirm(
			'Are you sure you want to delete this loading?'
		);

		if (isConfirmed) {
			axios
				.delete(`${API}load/${loadingDeleteId}`)
				.then(() => {
					console.log('Loading deleted successfully');
					setLoadings((prevLoadings) =>
						prevLoadings.filter((loading) => loading._id !== loadingDeleteId)
					);
					toast.success('Loading Deleted Successfully');
				})
				.catch((error) => {
					console.error('Error deleting loading:', error);
					toast.error('Error deleting loading. Please try again.');
				});
		}
	};
	const handleStateDelete = (stateDeleteId) => {
		const isConfirmed = window.confirm(
			'Are you sure you want to delete this state?'
		);

		if (isConfirmed) {
			axios
				.delete(`${API}state/${stateDeleteId}`)
				.then(() => {
					console.log('State deleted successfully');
					setStates((prevStates) =>
						prevStates.filter((state) => state._id !== stateDeleteId)
					);
					toast.success('State Deleted Successfully');
				})
				.catch((error) => {
					console.error('Error deleting state:', error);
					toast.error('Error deleting state. Please try again.');
				});
		}
	};

	const handleFormSubmit = (formData) => {
		if (selectedLoadingId) {
			axios
				.put(`${API}load/${selectedLoadingId}`, formData)
				.then((response) => {
					setLoadings((prevLoadings) =>
						prevLoadings.map((loading) =>
							loading._id === selectedLoadingId ? response.data : loading
						)
					);
					toast.success('Loading Details are Updated Successfully');
				})
				.catch((error) => {
					console.error('Error updating loading:', error);
					toast.error('Error updating loading. Please try again.');
				});
		} else {
			axios
				.post(`${API}load`, formData)
				.then((response) => {
					setLoadings((prevLoadings) => [...prevLoadings, response.data]);
					toast.success('Loading Details are Saved Successfully');
				})
				.catch((error) => {
					console.error('Error creating loading:', error);
					toast.error('Error creating loading. Please try again.');
				});
		}

		formik.resetForm();
		setSelectedLoadingId(null);
	};

	const handleStateFormSubmit = (formData) => {
		if (selectedStateId) {
			axios
				.put(`${API}state/${selectedStateId}`, formData)
				.then((response) => {
					setStates((prevStates) =>
						prevStates.map((state) =>
							state._id === selectedStateId ? response.data : state
						)
					);
					toast.success('State Details are Updated Successfully');
				})
				.catch((error) => {
					console.error('Error updating state:', error);
					toast.error('Error updating state. Please try again.');
				});
		} else {
			axios
				.post(`${API}state`, formData)
				.then((response) => {
					setStates((prevStates) => [...prevStates, response.data]);
					toast.success('State Details are Saved Successfully');
				})
				.catch((error) => {
					console.error('Error creating state:', error);
					toast.error('Error creating state. Please try again.');
				});
		}

		stateFormik.resetForm();
		setSelectedStateId(null);
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
			<div className='admin-loading-manage'>
				<div className='admin-loading-manage-data'>
					<h1 className='admin-loading-manage-data-title'>ALL LOADINGS</h1>
					<input
						type='text'
						placeholder='Search Loading...'
						className='admin-user-manage-form-input'
						value={searchInput}
						onChange={(e) => setSearchInput(e.target.value)}
					/>
					<div className='table-scroll'>
						<table className='admin-loading-manage-data-table'>
							<thead className='admin-loading-manage-data-table-head'>
								<tr className='admin-loading-manage-data-table-row-head'>
									<th className='admin-loading-manage-data-table-header'>Sl</th>
									<th className='admin-loading-manage-data-table-header'>
										Start Point
									</th>
									<th className='admin-loading-manage-data-table-header'>
										End Point
									</th>
									<th className='admin-loading-manage-data-table-header'>
										Rate
									</th>
									<th className='admin-loading-manage-data-table-header'>
										Action
									</th>
								</tr>
							</thead>
							<tbody className='admin-loading-manage-data-table-body'>
								{displayedLoadingsSearch.map((loading, idx) => (
									<tr
										key={loading._id}
										className='admin-loading-manage-data-table-row-body'
									>
										<td className='admin-loading-manage-data-table-data'>
											{idx + 1}
										</td>
										<td className='admin-loading-manage-data-table-data'>
											{loading.startpoint}
										</td>
										<td className='admin-loading-manage-data-table-data'>
											{loading.endpoint}
										</td>
										<td className='admin-loading-manage-data-table-data'>
											{loading.rate}
										</td>
										<td className='admin-loading-manage-data-table-data'>
											<button
												style={{
													background: 'none',
													border: 'none',
												}}
												onClick={() => handleLoadingUpdate(loading._id)}
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
                      {/*}
											<button
												style={{
													background: 'none',
													border: 'none',
												}}
												onClick={() => handleLoadingDelete(loading._id)}
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
				<div className='admin-loading-manage-form'>
					<h1 className='admin-loading-manage-form-title'>
						{selectedLoadingId ? 'UPDATE LOADING' : 'ADD LOADING'}
					</h1>
					<form
						className='admin-loading-manage-form-form'
						onSubmit={formik.handleSubmit}
					>
						<input
							type='text'
							className='admin-loading-manage-form-input-high'
							placeholder='Start Point'
							required
							name='startpoint'
							value={formik.values.startpoint}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
						{formik.touched.startpoint && formik.errors.startpoint && (
							<div className='error-message'>{formik.errors.startpoint}</div>
						)}
						<input
							type='text'
							className='admin-loading-manage-form-input-high'
							placeholder='End Point'
							required
							name='endpoint'
							value={formik.values.endpoint}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
						{formik.touched.endpoint && formik.errors.endpoint && (
							<div className='error-message'>{formik.errors.endpoint}</div>
						)}
						<input
							type='number'
							className='admin-loading-manage-form-input-high'
							placeholder='Rate'
							required
							name='rate'
							value={formik.values.rate}
							onChange={formik.handleChange}
							onBlur={formik.handleBlur}
						/>
						{formik.touched.rate && formik.errors.rate && (
							<div className='error-message'>{formik.errors.rate}</div>
						)}
						<br />
						<button
							type='submit'
							className='admin-loading-manage-form-button'
							disabled={formik.isSubmitting || !formik.isValid}
						>
							{selectedLoadingId ? 'Update' : 'Add'}
						</button>
					</form>
				</div>
			</div>
			<br />
			<div className='admin-state-manage'>
				<div className='admin-state-manage-data'>
					<h1 className='admin-state-manage-data-title'>ALL STATES</h1>
					<input
						type='text'
						placeholder='Search State...'
						className='admin-user-manage-form-input'
						value={searchStateInput}
						onChange={(e) => setSearchStateInput(e.target.value)}
					/>
					<div className='table-scroll'>
						<table className='admin-state-manage-data-table'>
							<thead className='admin-state-manage-data-table-head'>
								<tr className='admin-state-manage-data-table-row-head'>
									<th className='admin-state-manage-data-table-header'>Sl</th>
									<th className='admin-state-manage-data-table-header'>
										State Name
									</th>
									<th className='admin-state-manage-data-table-header'>
										State Code
									</th>
									<th className='admin-state-manage-data-table-header'>
										Action
									</th>
								</tr>
							</thead>
							<tbody className='admin-state-manage-data-table-body'>
								{displayedStatesSearch.map((state, idx) => (
									<tr
										key={state._id}
										className='admin-state-manage-data-table-row-body'
									>
										<td className='admin-state-manage-data-table-data'>
											{idx + 1}
										</td>
										<td className='admin-state-manage-data-table-data'>
											{state.statename}
											{/* {state.statename.substring(0, 23)} */}
										</td>
										<td className='admin-state-manage-data-table-data'>
											{state.statecode}
										</td>
										<td className='admin-state-manage-data-table-data'>
											<button
												style={{
													background: 'none',
													border: 'none',
												}}
												onClick={() => handleStateUpdate(state._id)}
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
												onClick={() => handleStateDelete(state._id)}
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
				<div className='admin-state-manage-form'>
					<h1 className='admin-state-manage-form-title'>
						{selectedStateId ? 'UPDATE STATE' : 'ADD STATE'}
					</h1>
					<form
						className='admin-state-manage-form-form'
						onSubmit={stateFormik.handleSubmit}
					>
						<input
							type='text'
							className='admin-state-manage-form-input-high'
							placeholder='State Name'
							required
							name='statename'
							value={stateFormik.values.statename}
							onChange={stateFormik.handleChange}
							onBlur={stateFormik.handleBlur}
						/>
						{stateFormik.touched.statename && stateFormik.errors.statename && (
							<div className='error-message'>
								{stateFormik.errors.statename}
							</div>
						)}
						<input
							type='text'
							className='admin-state-manage-form-input-high'
							placeholder='State Code'
							required
							name='statecode'
							value={stateFormik.values.statecode}
							onChange={stateFormik.handleChange}
							onBlur={stateFormik.handleBlur}
						/>
						{stateFormik.touched.statecode && stateFormik.errors.statecode && (
							<div className='error-message'>
								{stateFormik.errors.statecode}
							</div>
						)}
						<br />
						<button
							type='submit'
							className='admin-state-manage-form-button'
							disabled={stateFormik.isSubmitting || !stateFormik.isValid}
						>
							{selectedStateId ? 'Update' : 'Add'}
						</button>
					</form>
				</div>
			</div>
			<ToastContainer position='top-right' autoClose={3000} />
		</div>
	);
}

export default StaffLoadingManage;
