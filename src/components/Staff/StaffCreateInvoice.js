import React, { useEffect, useState } from 'react';
import './StaffCreateInvoice.css';
import background from '../images/Desktop.png';
import A from '../images/A.png';
import D from '../images/D.png';
import Close from '../images/cross_icon.jpg';
import StaffNavbar from './StaffNavbar';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import copy from 'clipboard-copy';
import { useStaffAuth } from './StaffAuth';

function StaffCreateInvoice() {
	const auth = useStaffAuth();
	const navigate = useNavigate();
	const [view, setView] = useState(false);
	const [url, setUrl] = useState([]);
	const [companies, setCompanies] = useState([]);
	const [selectedCompany, setSelectedCompany] = useState({});

	const [sellers, setSellers] = useState([]);
	const [selectedSeller, setSelectedSeller] = useState({});

	const [buyers, setBuyers] = useState([]);
	const [selectedBuyer, setSelectedBuyer] = useState({});

	const [consignments, setConsignments] = useState([]);
	const [addedConsignment, setAddedConsignment] = useState({});
	// const [selectedConsignment, setSelectedConsignment] = useState({});
	
	const [Loading, setLoading] = useState({});
	const [selectedLoading, setSelectedLoading] = useState({});
	const [dataToSend, setDataToSend] = useState({
		companydetails: {
			companyname: '',
			companygstno: '',
			// companycontact: '',
			companystate: '',
			companyofficeaddress: '',
			companypincode: '',
		},
		sellerdetails: {
			sellercompanyname: '',
			sellercompanyaddress: '',
			sellercompanystatename: '',
			sellercompanystatecode: '',
		},
		buyerdetails: {
			buyercompanyname: '',
			buyercompanygstno: '',
			buyercompanyaddress: '',
			buyercompanystatename: '',
			buyercompanystatecode: '',
		},
		vehicledetails: {
			drivernumber: '',
			vechiclenumber: '',
			vechiclemodel: '',
		},
		consignmentdetails: {
			itemdetails: [],
		},
		invoicedetails: {
			invoiceno: '',
			invoicedate: '',
			invoicemakername : auth.staff.staffname,
		},
		boardingdetails: {
			dateofloading: '',
			// watermark: '',
			partyref: '',
		},
		loadingdetails: {
			startpoint: '',
			endpoint: '',
			transportationcost: '',
		},
	});

	const API = process.env.REACT_APP_API;
	const ViewURL = 'https://project-m-client.vercel.app/';

	const handleChange = (e, section, field) => {
		const value = e.target.value;
		setDataToSend((prevData) => ({
			...prevData,
			[section]: {
				...prevData[section],
				[field]: value,
			},
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		// Check the length of items in dataToSend
		if (dataToSend && dataToSend.consignmentdetails.itemdetails.length >= 1) {
			try {
				const response = await fetch(`${API}invoice`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(dataToSend),
				});

				if (response.ok) {
					const data = await response.json();
					console.log('Invoice created successfully:', data);
					toast.success('Invoice created successfully');
					setUrl(data._id);
					setView(true);
					setIsModalOpen(true);
				} else {
					toast.error('Invoice creation failed');
				}
			} catch (error) {
				toast.error('Error creating invoice:', error);
			}
		} else {
			// Show an alert if the length is not greater than 1
			// alert('Please add items before creating invoice.');
			toast.info(
				'Please add Items in Consignment Details before creating invoice.'
			);
		}
	};

	const validationSchema = Yup.object().shape({
		vehicledetails: Yup.object().shape({
			drivernumber: Yup.string()
				.matches(/[0-9]{10}/, 'Invalid mobile number, Please enter 10-digits')
				.required('Driver Number is required'),
			vechiclenumber: Yup.string()
				.matches(
					/^[A-Z]{2}\d{2}\s[A-Z]{2}\s\d{4}$/,
					'Invalid vehicle number. Please use the format: AB12 CD 3456'
				)
				.required('Vehicle Number is required'),

			vechiclemodel: Yup.string().required('Vehicle Model is required'),
		}),
	});

	const formik = useFormik({
		initialValues: {
			vehicledetails: {
				drivernumber: '',
				vechiclenumber: '',
				vechiclemodel: '',
			},
		},
		validationSchema,
		onSubmit: handleSubmit,
	});

	useEffect(() => {
		const fetchCompanies = async () => {
			try {
				const response = await fetch(`${API}company`);
				if (response.ok) {
					const data = await response.json();
					setCompanies(data);
				} else {
					console.error('Failed to fetch companies data');
				}
			} catch (error) {
				console.error('Error fetching companies data:', error);
			}
		};

		fetchCompanies();
	}, [API]);

	useEffect(() => {
		const fetchSellers = async () => {
			try {
				const response = await fetch(`${API}seller`);
				if (response.ok) {
					const data = await response.json();
					setSellers(data);
				} else {
					console.error('Failed to fetch sellers data');
				}
			} catch (error) {
				console.error('Error fetching sellers data:', error);
			}
		};
		fetchSellers();
	}, [API]);

	useEffect(() => {
		const fetchBuyers = async () => {
			try {
				const response = await fetch(`${API}buyer`);
				if (response.ok) {
					const data = await response.json();
					setBuyers(data);
				} else {
					console.error('Failed to fetch buyers data');
				}
			} catch (error) {
				console.error('Error fetching buyers data:', error);
			}
		};
		fetchBuyers();
	}, [API]);

	useEffect(() => {
		const fetchConsignments = async () => {
			try {
				const response = await fetch(`${API}consignment`);
				if (response.ok) {
					const data = await response.json();
					setConsignments(data);
				} else {
					console.error('Failed to fetch consignments data');
				}
			} catch (error) {
				console.error('Error fetching consignments data:', error);
			}
		};
		fetchConsignments();
	}, [API]);
	useEffect(() => {
		const fetchLoadingData = async () => {
			try {
				const response = await fetch(`${API}load`);
				if (response.ok) {
					const data = await response.json();
					setLoading(data);
				} else {
					console.error('Failed to fetch loading data');
				}
			} catch (error) {
				console.error('Error fetching loading data:', error);
			}
		};

		fetchLoadingData();
	}, [API]);

	const handleSelectChangeCompany = (e) => {
		const selectedCompanyId = e.target.value;
		const selectedCompany = companies.find(
			(company) => company._id === selectedCompanyId
		);

		setDataToSend((prevData) => ({
			...prevData,
			companydetails: {
				...prevData.companydetails,
				companyid: selectedCompany.companyid,
				companyname: selectedCompany.companyname,
				companyregistrationtype: selectedCompany.companyregistrationtype,
				companygstno: selectedCompany.companygstno,
				companycontact: selectedCompany.companycontact,
				companystate: selectedCompany.companystate,
				companyofficeaddress: selectedCompany.companyofficeaddress,
				companypincode: selectedCompany.companypincode,
			},
		}));
		setSelectedCompany(selectedCompany);
	};

	const handleSelectChangeSeller = (selectedOption) => {
		const selectedSellerId = selectedOption.value;
		const selectedSeller = sellers.find(
			(seller) => seller._id === selectedSellerId
		);

		setDataToSend((prevData) => ({
			...prevData,
			sellerdetails: {
				...prevData.sellerdetails,
				sellerid: selectedSeller.sellerid,
				sellercompanyname: selectedSeller.sellercompanyname,
				sellercompanyaddress: selectedSeller.sellercompanyaddress,
				sellercompanystatename: selectedSeller.sellercompanystatename,
				sellercompanystatecode: selectedSeller.sellercompanystatecode,
			},
		}));
		setSelectedSeller(selectedSeller);
	};

	const handleSelectChangeBuyer = (selectedOption) => {
		const selectedBuyerId = selectedOption.value;
		const selectedBuyer = buyers.find((buyer) => buyer._id === selectedBuyerId);

		setDataToSend((prevData) => ({
			...prevData,
			buyerdetails: {
				...prevData.buyerdetails,
				buyerid: selectedBuyer.buyerid,
				buyercompanyname: selectedBuyer.buyercompanyname,
				buyercompanygstno: selectedBuyer.buyercompanygstno,
				buyercompanyaddress: selectedBuyer.buyercompanyaddress,
				buyercompanystatename: selectedBuyer.buyercompanystatename,
				buyercompanystatecode: selectedBuyer.buyercompanystatecode,
			},
		}));
		setSelectedBuyer(selectedBuyer);
	};
	const handleSelectChangeConsignment = (e) => {
		const selectedConsignmentId = e.target.value;
		const selectedConsignment = consignments.find(
			(consignment) => consignment._id === selectedConsignmentId
		);

		setAddedConsignment(selectedConsignment);
	};

	const ConsignmentsAdd = () => {
		if (
			!addedConsignment.itemname ||
			!addedConsignment.itemquantity ||
			!addedConsignment.itemhsn ||
			!addedConsignment.itemprice ||
			!addedConsignment.itemtaxrate
		) {
			return;
		}

		setDataToSend((prevData) => ({
			...prevData,
			consignmentdetails: {
				...prevData.consignmentdetails,
				itemdetails: [
					...prevData.consignmentdetails.itemdetails,
					{
						itemname: addedConsignment.itemname,
						itemquantity: addedConsignment.itemquantity,
						itemhsn: addedConsignment.itemhsn,
						itemprice: addedConsignment.itemprice,
						itemtaxrate: addedConsignment.itemtaxrate,
					},
				],
			},
		}));
		setAddedConsignment({});
	};

	const ConsignmentsRemove = (index) => {
		setDataToSend((prevData) => ({
			...prevData,
			consignmentdetails: {
				...prevData.consignmentdetails,
				itemdetails: prevData.consignmentdetails.itemdetails.filter(
					(item, i) => i !== index
				),
			},
		}));
	};

	const handleConsignmentChange = (e) => {
		const value = e.target.value;
		setAddedConsignment((prevAdded) => ({
			...prevAdded,
			[e.target.name]: value,
		}));
	};

	const handleSelectChangeLoading = (selectedOption, field) => {
		const [startpoint, endpoint, rate] = selectedOption.value.split('-');

		setDataToSend((prevData) => ({
			...prevData,
			loadingdetails: {
				...prevData.loadingdetails,
				startpoint,
				endpoint,
				transportationcost: rate, // Set rate to transportationcost
			},
		}));

		setSelectedLoading((prevSelected) => ({
			...prevSelected,
			[field]: selectedOption,
		}));
	};

	const openPdfViewer = () => {
		navigate(`/pdf/${url}`);
	};

	const [isModalOpen, setIsModalOpen] = useState(false);
	const closePdfViewer = () => {
		setIsModalOpen(false);
	};

	const handleCopy = () => {
		const linkToCopy = `${ViewURL}pdf/${url}`; // Replace with the actual link or variable

		try {
			copy(linkToCopy);
			alert('Link copied to clipboard!');
			// toast.success('Link copied to clipboard!');
		} catch (error) {
			console.error('Unable to copy to clipboard.', error);
			alert('Error copying to clipboard. Please try again.');
			// toast.error('Error copying to clipboard. Please try again.');
		}
	};

	return (
		<div
			style={{
				backgroundImage: `url(${background})`,
				minHeight: '100vh',
			}}
		>
			<StaffNavbar />

			<h1 className='admin-create-invoice-title'>CREATE INVOICE</h1>
			<form className='admin-create-invoice-form-all'>
				<div className='admin-create-invoice-container'>
					<div className='admin-create-invoice-data'>
						<h2 className='admin-create-invoice-subtitle'>COMPANY DETAILS</h2>
						<select
							className='admin-create-invoice-select'
							id='companyid'
							name='companyid'
							value={selectedCompany.companyid}
							onChange={handleSelectChangeCompany}
							required
						>
							<option value=''>Select Company</option>
							{companies.map((company) => (
								<option key={company._id} value={company._id}>
									{company.companyname}
								</option>
							))}
						</select>
					</div>
					<div className='admin-create-invoice-form'>
						<div className='admin-create-invoice-form-div'>
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<label
									className='admin-create-invoice-form-label'
									htmlFor='companyname'
								>
									Company Name
								</label>
								<input
									className='admin-create-invoice-form-input'
									id='companyname'
									name='companyname'
									type='text'
									required
									disabled
									value={selectedCompany.companyname}
									onChange={(e) =>
										handleChange(e, 'companydetails', 'companyname')
									}
								/>
							</div>
						</div>

						<div className='admin-create-invoice-form-div'>
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<label
									className='admin-create-invoice-form-label'
									htmlFor='companygstno'
								>
									Company GST No.
								</label>
								<input
									className='admin-create-invoice-form-input'
									id='companygstno'
									name='companygstno'
									type='text'
									required
									disabled
									value={selectedCompany.companygstno}
									onChange={(e) =>
										handleChange(e, 'companydetails', 'companygstno')
									}
								/>
							</div>
						</div>
						{/*
						<div className='admin-create-invoice-form-div'>
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<label
									className='admin-create-invoice-form-label'
									htmlFor='companycontact'
								>
									Company Contact
								</label>
								<input
									className='admin-create-invoice-form-input'
									id='companycontact'
									name='companycontact'
									type='tel'
									required
									disabled
									value={selectedCompany.companycontact}
									onChange={(e) =>
										handleChange(e, 'companydetails', 'companycontact')
									}
								/>
							</div>
						</div>
*/}
						<div className='admin-create-invoice-form-div'>
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<label
									className='admin-create-invoice-form-label'
									htmlFor='companystate'
								>
									Company State
								</label>
								<input
									className='admin-create-invoice-form-input'
									id='companystate'
									name='companystate'
									type='text'
									required
									disabled
									value={selectedCompany.companystate}
									onChange={(e) =>
										handleChange(e, 'companydetails', 'companystate')
									}
								/>
							</div>
						</div>
						<div className='admin-create-invoice-form-div'>
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<label
									className='admin-create-invoice-form-label'
									htmlFor='companyofficeaddress'
								>
									Company Office Address
								</label>
								<input
									className='admin-create-invoice-form-input'
									id='companyofficeaddress'
									name='companyofficeaddress'
									type='text'
									required
									disabled
									value={selectedCompany.companyofficeaddress}
									onChange={(e) =>
										handleChange(e, 'companydetails', 'companyofficeaddress')
									}
								/>
							</div>
						</div>
						<div className='admin-create-invoice-form-div'>
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<label
									className='admin-create-invoice-form-label'
									htmlFor='companypincode'
								>
									Company State Code
								</label>
								<input
									className='admin-create-invoice-form-input'
									id='companypincode'
									name='companypincode'
									type='text'
									required
									disabled
									value={selectedCompany.companypincode}
									onChange={(e) =>
										handleChange(e, 'companydetails', 'companypincode')
									}
								/>
							</div>
						</div>
					</div>
					<div className='admin-create-invoice-data'>
						<h2 className='admin-create-invoice-subtitle'>AGENT DETAILS</h2>
						<Select
							className='admin-create-invoice-select'
							id='sellerid'
							name='sellerid'
							// value={{
							// 	value: selectedSeller._id,
							// 	label: selectedSeller.sellercompanyname,
							// }}
							required
							placeholder='Select Agent'
							onChange={handleSelectChangeSeller}
							options={sellers.map((seller) => ({
								value: seller._id,
								label: seller.sellercompanyname,
							}))}
						/>
					</div>
					<div className='admin-create-invoice-form'>
						<div className='admin-create-invoice-form-div'>
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<label
									className='admin-create-invoice-form-label'
									htmlFor='sellercompanyname'
								>
									Agent Company Name
								</label>
								<input
									className='admin-create-invoice-form-input'
									id='sellercompanyname'
									name='sellercompanyname'
									type='text'
									required
									disabled
									value={selectedSeller.sellercompanyname}
									onChange={(e) =>
										handleChange(e, 'sellerdetails', 'sellercompanyname')
									}
								/>
							</div>
						</div>
						<div className='admin-create-invoice-form-div'>
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<label
									className='admin-create-invoice-form-label'
									htmlFor='sellercompanyaddress'
								>
									Agent Company Address
								</label>
								<input
									className='admin-create-invoice-form-input'
									id='sellercompanyaddress'
									name='sellercompanyaddress'
									type='text'
									required
									disabled
									value={selectedSeller.sellercompanyaddress}
									onChange={(e) =>
										handleChange(e, 'sellerdetails', 'sellercompanyaddress')
									}
								/>
							</div>
						</div>
						<div className='admin-create-invoice-form-div'>
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<label
									className='admin-create-invoice-form-label'
									htmlFor='sellercompanystatename'
								>
									Agent Company State Name
								</label>
								<input
									className='admin-create-invoice-form-input'
									id='sellercompanystatename'
									name='sellercompanystatename'
									type='text'
									required
									disabled
									value={selectedSeller.sellercompanystatename}
									onChange={(e) =>
										handleChange(e, 'sellerdetails', 'sellercompanystatename')
									}
								/>
							</div>
						</div>
						<div className='admin-create-invoice-form-div'>
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<label
									className='admin-create-invoice-form-label'
									htmlFor='sellercompanystatecode'
								>
									Agent Company State Code
								</label>
								<input
									className='admin-create-invoice-form-input'
									id='sellercompanystatecode'
									name='sellercompanystatecode'
									type='text'
									required
									disabled
									value={selectedSeller.sellercompanystatecode}
									onChange={(e) =>
										handleChange(e, 'sellerdetails', 'sellercompanystatecode')
									}
								/>
							</div>
						</div>
					</div>
					<div className='admin-create-invoice-data'>
						<h2 className='admin-create-invoice-subtitle'>BUYER DETAILS</h2>
						<Select
							className='admin-create-invoice-select'
							id='buyerid'
							name='buyerid'
							placeholder='Select Buyer'
							// value={{
							// 	value: selectedBuyer._id,
							// 	label: selectedBuyer.buyercompanyname,
							// }}
							required
							onChange={handleSelectChangeBuyer}
							options={buyers.map((buyer) => ({
								value: buyer._id,
								label: buyer.buyercompanyname,
							}))}
						/>
					</div>
					<div className='admin-create-invoice-form'>
						<div className='admin-create-invoice-form-div'>
							<label
								className='admin-create-invoice-form-label'
								htmlFor='buyercompanyname'
							>
								Buyer Company Name
							</label>
							<input
								className='admin-create-invoice-form-input'
								id='buyercompanyname'
								name='buyercompanyname'
								type='text'
								required
								disabled
								value={selectedBuyer.buyercompanyname}
								onChange={(e) =>
									handleChange(e, 'buyerdetails', 'buyercompanyname')
								}
							/>
						</div>
						<div className='admin-create-invoice-form-div'>
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<label
									className='admin-create-invoice-form-label'
									htmlFor='buyercompanyaddress'
								>
									Buyer Company Address
								</label>
								<input
									className='admin-create-invoice-form-input'
									id='buyercompanyaddress'
									name='buyercompanyaddress'
									type='text'
									required
									disabled
									value={selectedBuyer.buyercompanyaddress}
									onChange={(e) =>
										handleChange(e, 'buyerdetails', 'buyercompanyaddress')
									}
								/>
							</div>
						</div>
						<div className='admin-create-invoice-form-div'>
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<label
									className='admin-create-invoice-form-label'
									htmlFor='buyercompanygstno'
								>
									Buyer GST No
								</label>
								<input
									className='admin-create-invoice-form-input'
									id='buyercompanygstno'
									name='buyercompanygstno'
									type='text'
									required
									disabled
									value={selectedBuyer.buyercompanygstno}
									onChange={(e) =>
										handleChange(e, 'buyerdetails', 'buyercompanygstno')
									}
								/>
							</div>
						</div>

						<div className='admin-create-invoice-form-div'>
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<label
									className='admin-create-invoice-form-label'
									htmlFor='buyercompanystatename'
								>
									Buyer Company State Name
								</label>
								<input
									className='admin-create-invoice-form-input'
									id='buyercompanystatename'
									name='buyercompanystatename'
									type='text'
									required
									disabled
									value={selectedBuyer.buyercompanystatename}
									onChange={(e) =>
										handleChange(e, 'buyerdetails', 'buyercompanystatename')
									}
								/>
							</div>
						</div>
						<div className='admin-create-invoice-form-div'>
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<label
									className='admin-create-invoice-form-label'
									htmlFor='buyercompanystatecode'
								>
									Buyer Company State Code
								</label>
								<input
									className='admin-create-invoice-form-input'
									id='buyercompanystatecode'
									name='buyercompanystatecode'
									type='text'
									required
									disabled
									value={selectedBuyer.buyercompanystatecode}
									onChange={(e) =>
										handleChange(e, 'buyerdetails', 'buyercompanystatecode')
									}
								/>
							</div>
						</div>
					</div>
					<div className='admin-create-invoice-data'>
						<h2 className='admin-create-invoice-subtitle'>VEHICLE DETAILS</h2>
					</div>
					<div className='admin-create-invoice-form'>
						<div className='admin-create-invoice-form-div'>
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<label
									className='admin-create-invoice-form-label'
									htmlFor='drivernumber'
								>
									Driver Mobile Number
								</label>
								<input
									className='admin-create-invoice-form-input-v'
									id='drivernumber'
									name='vehicledetails.drivernumber'
									type='tel'
									maxLength={10}
									pattern='[0-9]{10}'
									placeholder='Enter 10-digit mobile number without +91'
									required
									onChange={(e) => {
										formik.handleChange(e);
										handleChange(e, 'vehicledetails', 'drivernumber');
									}}
									onBlur={formik.handleBlur}
									value={formik.values.vehicledetails?.drivernumber || ''}
								/>
								{formik.touched.vehicledetails?.drivernumber &&
									formik.errors.vehicledetails?.drivernumber && (
										<div className='error'>
											{formik.errors.vehicledetails.drivernumber}
										</div>
									)}
							</div>
						</div>

						<div className='admin-create-invoice-form-div'>
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<label className='admin-create-invoice-form-label' htmlFor=''>
									Vehicle Number
								</label>
								<input
									className='admin-create-invoice-form-input-v'
									id=''
									name='vehicledetails.vechiclenumber'
									type='text'
									pattern='^[A-Z]{2}[0-9]{2}[A-Z]{2}[0-9]{4}$'
									required
									placeholder='Ex: AB12 CD 3456'
									onChange={(e) => {
										formik.handleChange(e);
										handleChange(e, 'vehicledetails', 'vechiclenumber');
									}}
									onBlur={formik.handleBlur}
									value={
										formik.values.vehicledetails?.vechiclenumber.toUpperCase() ||
										''
									}
								/>
								{formik.touched.vehicledetails?.vechiclenumber &&
									formik.errors.vehicledetails?.vechiclenumber && (
										<div className='error'>
											{formik.errors.vehicledetails.vechiclenumber}
										</div>
									)}
							</div>
						</div>
						<div className='admin-create-invoice-form-div'>
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<label
									className='admin-create-invoice-form-label'
									htmlFor='vechiclemodel'
								>
									Vehicle Model
								</label>
								<br />
								<input
									className='admin-create-invoice-form-input-v'
									id='vechiclemodel'
									name='vehicledetails.vechiclemodel'
									type='text'
									required
									onChange={(e) => {
										formik.handleChange(e);
										handleChange(e, 'vehicledetails', 'vechiclemodel');
									}}
									onBlur={formik.handleBlur}
									value={
										formik.values.vehicledetails?.vechiclemodel.toUpperCase() ||
										''
									}
								/>
								{formik.touched.vehicledetails?.vechiclemodel &&
									formik.errors.vehicledetails?.vechiclemodel && (
										<div className='error'>
											{formik.errors.vehicledetails.vechiclemodel}
										</div>
									)}
							</div>
						</div>
					</div>
					<div className='admin-create-invoice-data'>
						<h2 className='admin-create-invoice-subtitle'>
							CONSIGNMENT DETAILS
						</h2>
						<select
							className='admin-create-invoice-select'
							id='consignmentid'
							name='consignmentid'
							// value={addedConsignment._id || ''}
							onChange={handleSelectChangeConsignment}
							required
						>
							<option value=''>Select Consignment ID</option>
							{consignments.map((consignment) => (
								<option key={consignment._id} value={consignment._id}>
									{consignment.itemname}
								</option>
							))}
						</select>
					</div>
					<table className='admin-create-invoice-table-consigment'>
						<thead className='admin-create-invoice-table-thead'>
							<tr className='admin-create-invoice-table-row-head'>
								<th className='admin-create-invoice-table-row-th'>Item Name</th>
								<th className='admin-create-invoice-table-row-th'>
									Item Quantity
								</th>
								<th className='admin-create-invoice-table-row-th'>Item HSN</th>
								<th className='admin-create-invoice-table-row-th'>
									Item Price
								</th>
								<th className='admin-create-invoice-table-row-th'>
									Item Tax Rate
								</th>
								<th className='admin-create-invoice-table-row-th'>Action</th>
							</tr>
						</thead>
						<tbody className='admin-create-invoice-table-tbody'>
							<tr className='admin-create-invoice-table-row-body'>
								<td className='admin-create-invoice-table-row-body-td'>
									<input
										className='admin-create-invoice-table-consigment-input'
										type='text'
										value={addedConsignment.itemname || ''}
										onChange={handleConsignmentChange}
										name='itemname'
										disabled
									/>
								</td>
								<td className='admin-create-invoice-table-row-body-td'>
									<input
										className='admin-create-invoice-table-consigment-input'
										type='number'
										value={addedConsignment.itemquantity || ''}
										onChange={handleConsignmentChange}
										name='itemquantity'
									/>
								</td>
								<td className='admin-create-invoice-table-row-body-td'>
									<input
										className='admin-create-invoice-table-consigment-input'
										type='text'
										value={addedConsignment.itemhsn || ''}
										onChange={handleConsignmentChange}
										name='itemhsn'
									/>
								</td>
								<td className='admin-create-invoice-table-row-body-td'>
									<input
										className='admin-create-invoice-table-consigment-input'
										type='number'
										value={addedConsignment.itemprice || ''}
										onChange={handleConsignmentChange}
										name='itemprice'
									/>
								</td>
								<td className='admin-create-invoice-table-row-body-td'>
									<input
										className='admin-create-invoice-table-consigment-input'
										type='number'
										value={addedConsignment.itemtaxrate || ''}
										onChange={handleConsignmentChange}
										name='itemtaxrate'
									/>
								</td>
								<td className='admin-create-invoice-table-row-body-td'>
									<button
										type='button'
										className='admin-create-invoice-table-consigment-button'
										onClick={ConsignmentsAdd}
										disabled={
											!addedConsignment.itemname ||
											!addedConsignment.itemquantity ||
											!addedConsignment.itemhsn ||
											!addedConsignment.itemprice ||
											!addedConsignment.itemtaxrate
										}
									>
										<img
											className='admin-create-invoice-table-consigment-icon'
											src={A}
											alt='add'
										/>
									</button>
								</td>
							</tr>
							<tr className='admin-create-invoice-table-row-subtitle'>
								<h3 className='admin-create-invoice-subtitle-table'>
									ADDED ITEMS
								</h3>
							</tr>
							{dataToSend.consignmentdetails.itemdetails.map((item, index) => (
								<tr key={index} className='admin-create-invoice-table-row-body'>
									<td className='admin-create-invoice-table-consigment-value'>
										{item.itemname}
									</td>
									<td className='admin-create-invoice-table-consigment-value'>
										{item.itemquantity}
									</td>
									<td className='admin-create-invoice-table-consigment-value'>
										{item.itemhsn}
									</td>
									<td className='admin-create-invoice-table-consigment-value'>
										{item.itemprice}
									</td>
									<td className='admin-create-invoice-table-consigment-value'>
										{item.itemtaxrate}
									</td>
									<td className='admin-create-invoice-table-consigment-value'>
										<button
											className='admin-create-invoice-table-consigment-button'
											type='button'
											onClick={() => ConsignmentsRemove(index)}
										>
											<img
												className='admin-create-invoice-table-consigment-icon-low'
												src={D}
												alt='delete'
											/>
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className='admin-create-invoice-data'>
						<h2 className='admin-create-invoice-subtitle'>INVOICE DETAILS</h2>
					</div>
					<div className='admin-create-invoice-form'>
						<div className='admin-create-invoice-form-div'>
							<label
								className='admin-create-invoice-form-label'
								htmlFor='invoicedate'
							>
								Invoice Date
							</label>
							<br />
							<input
								className='admin-create-invoice-form-input'
								id='invoicedate'
								name='invoicedate'
								required
								type='date'
								onChange={(e) =>
									handleChange(e, 'invoicedetails', 'invoicedate')
								}
							/>
						</div>
					</div>
					<div className='admin-create-invoice-data'>
						<h2 className='admin-create-invoice-subtitle'>BOARDING DETAILS</h2>
					</div>
					<div className='admin-create-invoice-form'>
						<div className='admin-create-invoice-form-div'>
							<label
								className='admin-create-invoice-form-label'
								htmlFor='loading'
							>
								Loading
							</label>
							<Select
								className='admin-create-invoice-select-loading'
								id='loading'
								name='loading'
								required
								value={selectedLoading.startpoint}
								onChange={(selectedOption) =>
									handleSelectChangeLoading(selectedOption, 'startpoint')
								}
								options={
									Array.isArray(Loading)
										? Loading.map((item) => ({
												value: `${item.startpoint}-${item.endpoint}-${item.rate}`,
												label: `${item.startpoint} to ${item.endpoint}`,
										  }))
										: []
								}
							/>
						</div>

						<div className='admin-create-invoice-form-div'>
							{/* <div style={{ display: 'flex', flexDirection: 'column' }}> */}
							<label
								className='admin-create-invoice-form-label'
								htmlFor='startpoint'
							>
								Start Point
							</label>
							<br />
							<input
								className='admin-create-invoice-form-input'
								id='startpoint'
								name='startpoin'
								type='text'
								required
								disabled
								value={`${dataToSend.loadingdetails.startpoint}`}
								onChange={(e) =>
									handleChange(e, 'loadingdetails', 'startpoint')
								}
								readOnly
							/>
							{/* </div> */}
						</div>
						<div className='admin-create-invoice-form-div'>
							{/* <div style={{ display: 'flex', flexDirection: 'column' }}> */}
							<label
								className='admin-create-invoice-form-label'
								htmlFor='endpoint'
							>
								End Point
							</label>
							<br />
							<input
								className='admin-create-invoice-form-input'
								id='endpoint'
								name='endpoint'
								type='text'
								required
								disabled
								value={`${dataToSend.loadingdetails.endpoint}`}
								onChange={(e) => handleChange(e, 'loadingdetails', 'endpoint')}
								readOnly
							/>
							{/* </div> */}
						</div>
						<div className='admin-create-invoice-form-div'>
							{/* <div style={{ display: 'flex', flexDirection: 'column' }}> */}
							<label
								className='admin-create-invoice-form-label'
								htmlFor='transportationcost'
							>
								Transportation Cost
							</label>
							<br />
							<input
								className='admin-create-invoice-form-input'
								id='transportationcost'
								name='transportationcost'
								type='text'
								required
								disabled
								value={`${dataToSend.loadingdetails.transportationcost}`}
								onChange={(e) =>
									handleChange(e, 'loadingdetails', 'transportationcost')
								}
								readOnly
							/>
							{/* </div> */}
						</div>

						<div className='admin-create-invoice-form-div'>
							<div style={{ display: 'flex', flexDirection: 'column' }}>
								<label
									className='admin-create-invoice-form-label'
									htmlFor='dateofloading'
								>
									Date of Loading
								</label>
								<input
									className='admin-create-invoice-form-input'
									id='dateofloading'
									name='dateofloading'
									type='date'
									required
									onChange={(e) =>
										handleChange(e, 'boardingdetails', 'dateofloading')
									}
								/>
							</div>
						</div>

						<div className='admin-create-invoice-form-div'>
							<label
								className='admin-create-invoice-form-label'
								htmlFor='watermark'
							>
								Water Mark
							</label>
							<br />
							<input
								className='admin-create-invoice-form-input'
								id='watermark'
								name='watermark'
								type='text'
								required
								value={selectedCompany.companyname}
								onChange={(e) =>
									handleChange(e, 'boardingdetails', 'watermark')
								}
								disabled
							/>
						</div>

						<div className='admin-create-invoice-form-div'>
							{/* <div style={{ display: 'flex', flexDirection: 'column' }}> */}
							<label
								className='admin-create-invoice-form-label'
								htmlFor='Party Ref.'
							>
								Party Ref.
							</label>
							<br />
							<input
								className='admin-create-invoice-form-input-v'
								id='partyref'
								name='partyref'
								type='text'
								required
								onChange={(e) =>
									handleChange(
										{
											...e,
											target: {
												...e.target,
												value: e.target.value.toUpperCase(),
											},
										},
										'boardingdetails',
										'partyref'
									)
								}
							/>

							{/* </div> */}
						</div>
					</div>
					<div className='admin-create-invoice-data-submit'>
						<button
							className='admin-create-invoice-button'
							onClick={handleSubmit}
							// onClick={() => setIsModalOpen(true)}
						>
							CREATE INVOICE
						</button>
						<br />
						{isModalOpen && view && (
							<div className='modal'>
								<div className='modal-content'>
									{/* <p className='close' onClick={() => closePdfViewer()}>
										&times;
									</p> */}
									<img
										src={Close}
										alt='Close'
										className='close'
										onClick={() => closePdfViewer()}
									/>
									<div className='modal-btn-div'>
										<button
											className='modal-btn'
											onClick={() => openPdfViewer()}
										>
											View Invoice
										</button>
										<button className='modal-btn' onClick={handleCopy}>
											Copy Link
										</button>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</form>
			<ToastContainer position='top-right' autoClose={3000} />
		</div>
	);
}

export default StaffCreateInvoice;
