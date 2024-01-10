import React, { useEffect, useState } from 'react';
import './StaffReport.css';
import background from '../images/Desktop.png';
import axios from 'axios';
// import ReactPaginate from 'react-paginate';
import { CSVLink } from 'react-csv';
import StaffNavbar from './StaffNavbar';

function StaffReports() {
	const [invoice, setInvoice] = useState([]);
	// const [pageNumber, setPageNumber] = useState(0);
	const [searchInput, setSearchInput] = useState('');
	const [value, setValue] = useState('');
	const [exportedData, setExportedData] = useState([]);
	const [selectedAgentOption, setSelectedAgentOption] = useState('');
	const [agentData, setAgentData] = useState('');
	const [startDate, setStartDate] = useState('');
	const [endDate, setEndDate] = useState('');
	// const [selectedDateOption, setSelectedDateOption] = useState('');
	// const [filteredDateSelectData, setFilteredDateSelectData] = useState([]);
	// const [dateData, setDateData] = useState([]);

	const API = process.env.REACT_APP_API;
	const changeTable = (newValue) => {
		setValue(newValue);
	};

	// const itemsPerPage = 15;
	const sortedInvoice = [...invoice].reverse();

	const displayedInvoiceSearch = sortedInvoice.filter((item) => {
		const invoiceNo =
			(item.invoicedetails && item.invoicedetails.invoiceno) || '';
		const companyName =
			(item.companydetails && item.companydetails.companyname) || '';
		const invoiceDate =
			(item.invoicedetails && item.invoicedetails.invoicedate) || '';
		const vehicleNumber =
			(item.vehicledetails && item.vehicledetails.vehiclenumber) || '';
		const driverName =
			(item.vehicledetails && item.vehicledetails.drivername) || '';
		const itemName =
			(item.consignmentdetails.itemdetails[0] &&
				item.consignmentdetails.itemdetails[0].itemname) ||
			'';
		const agentCompanyName =
			(item.sellerdetails && item.sellerdetails.sellercompanyname) || ''; // **Include Agent Company Name field**
		const agentCompanyState =
			(item.sellerdetails && item.sellerdetails.sellercompanystatename) || ''; // **Include Agent Company State Name**
		const searchLowerCase = searchInput?.toLowerCase();

		if (
			invoiceNo.toLowerCase().includes(searchInput?.toLowerCase()) ||
			companyName.toLowerCase().includes(searchInput?.toLowerCase()) ||
			invoiceDate.toLowerCase().includes(searchInput?.toLowerCase()) ||
			vehicleNumber.toLowerCase().includes(searchInput?.toLowerCase()) ||
			driverName.toLowerCase().includes(searchInput?.toLowerCase()) ||
			itemName.toLowerCase().includes(searchLowerCase) ||
			agentCompanyName.toLowerCase().includes(searchLowerCase) || // **Check Agent Company Name**
			agentCompanyState.toLowerCase().includes(searchLowerCase) // **Check Agent Company State Name**
		) {
			return true;
		}

		return false;
	});
	// 	.slice(pageNumber * itemsPerPage, (pageNumber + 1) * itemsPerPage);

	// const pageCount = Math.ceil(sortedInvoice.length / itemsPerPage);

	// const changePage = ({ selected }) => {
	// 	setPageNumber(selected);
	// };

	useEffect(() => {
		axios
			.get(`${API}invoice`)
			.then((response) => {
				setInvoice(response.data);
			})
			.catch((error) => {
				console.error('Error fetching Invoice data:', error);
			});
	}, [API]);

	const handleShowButtonClick = () => {
		if (selectedAgentOption && (startDate || endDate)) {
			const filteredData = filteredAgentSelectData.filter((item) => {
				const isAgentMatch =
					item.sellerdetails &&
					item.sellerdetails.sellercompanyname === selectedAgentOption;

				const itemDate = new Date(item.invoicedetails.invoicedate);
				const isStartDateValid =
					startDate !== '' && !isNaN(new Date(startDate).getTime());
				const isEndDateValid =
					endDate !== '' && !isNaN(new Date(endDate).getTime());

				if (isAgentMatch) {
					if (
						(isStartDateValid && itemDate >= new Date(startDate)) ||
						!isStartDateValid
					) {
						if (
							(isEndDateValid && itemDate <= new Date(endDate)) ||
							!isEndDateValid
						) {
							return true;
						}
					}
				}

				return false;
			});

			const newWindow = window.open('', '_blank');
			newWindow.document.write(generateHTMLContent(filteredData));
		} else if (selectedAgentOption) {
			const agentFilteredData = filteredAgentSelectData.filter((item) => {
				return (
					item.sellerdetails &&
					item.sellerdetails.sellercompanyname === selectedAgentOption
				);
			});

			const newWindow = window.open('', '_blank');
			newWindow.document.write(generateHTMLContent(agentFilteredData));
		} else if (startDate || endDate) {
			const dateFilteredData = filteredAgentSelectData.filter((item) => {
				const itemDate = new Date(item.invoicedetails.invoicedate);
				const isStartDateValid =
					startDate !== '' && !isNaN(new Date(startDate).getTime());
				const isEndDateValid =
					endDate !== '' && !isNaN(new Date(endDate).getTime());

				if (
					(isStartDateValid && itemDate >= new Date(startDate)) ||
					!isStartDateValid
				) {
					if (
						(isEndDateValid && itemDate <= new Date(endDate)) ||
						!isEndDateValid
					) {
						return true;
					}
				}

				return false;
			});

			const newWindow = window.open('', '_blank');
			newWindow.document.write(generateHTMLContent(dateFilteredData));
		} else {
			const newWindow = window.open('', '_blank');
			newWindow.document.write(generateHTMLContent(filteredAgentSelectData));
		}
	};

	const generateHTMLContent = (data) => {
		let htmlContent = '<html><head><title>Agent Data</title></head><body>';

		htmlContent +=
			'<h2 style="text-align: center; font-size: 40px;">Agent Details</h2>';
		htmlContent +=
			'<table style="width: 70%; margin: 0 auto; border-collapse: collapse; border: 1px solid #ddd;">';

		htmlContent += '<tr style="background-color: #fcec03;">';
		htmlContent +=
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Agent Name</th>';
		htmlContent +=
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Date</th>';
		htmlContent +=
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Quantity</th>';
		htmlContent +=
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Place</th>';
		htmlContent += '</tr>';

		let totalQuantity = 0;

		data.forEach((dataItem, index) => {
			htmlContent += '<tr>';
			htmlContent += `<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${dataItem.sellerdetails.sellercompanyname}</td>`;
			htmlContent += `<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
				dataItem.invoicedetails && dataItem.invoicedetails.invoicedate
					? dataItem.invoicedetails.invoicedate.substring(0, 10)
					: 'N/A'
			}</td>`;
			const itemQuantity =
				dataItem.consignmentdetails.itemdetails[0]?.itemquantity !== undefined
					? dataItem.consignmentdetails.itemdetails[0]?.itemquantity
					: 0;
			totalQuantity += itemQuantity;
			htmlContent += `<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${itemQuantity}</td>`;
			htmlContent += `<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${dataItem.sellerdetails.sellercompanystatename}</td>`;
			htmlContent += '</tr>';
		});

		htmlContent += '</table>';

		htmlContent += `<h2 style="text-align: center; font-size: 24px;">Total Quantity: ${totalQuantity}</h2>`;

		htmlContent += '</body></html>';

		return htmlContent;
	};

	const filteredAgentSelectData = sortedInvoice.filter((item) => {
		const agentCompanyName =
			(item.sellerdetails && item.sellerdetails.sellercompanyname) || ''; // **Include Agent Company Name field**
		const agentCompanyState =
			(item.sellerdetails && item.sellerdetails.sellercompanystatename) || ''; // **Include Agent Company State Name**
		// const searchLowerCase = searchInput?.toLowerCase();
		if (
			agentCompanyName || // **Check Agent Company Name**
			agentCompanyState // **Check Agent Company State Name**
		) {
			return true;
		}
		return false;
	});
	// console.log('filteredAgentSelectData', filteredAgentSelectData);

	const loggedNames = new Set();
	const distinctCompanyNames = [];

	filteredAgentSelectData.map((item) => {
		const companyName = item.sellerdetails.sellercompanyname;
		if (!loggedNames.has(companyName)) {
			// console.log(companyName);
			loggedNames.add(companyName);
			distinctCompanyNames.push(companyName);
		}
	});

	// Now, distinctCompanyNames array contains all distinct values
	// console.log(distinctCompanyNames);
	const handleSelectChange = (e) => {
		const selectedValue = e.target.value;
		setSelectedAgentOption(selectedValue);
	};

	const handleFromDateSelect = (e) => {
		const selectedFromDate = e.target.value;
		setStartDate(selectedFromDate);
		// console.log(selectedFromDate);
	};

	// const handleToDateSelect = (e) => {
	// 	const selectedToDate = e.target.value;
	// 	setEndDate(selectedToDate);
	// 	// console.log(selectedToDate);
	// };
	const handleToDateSelect = (event) => {
		const selectedToDate = event.target.value;

		// Use a utility function to increment the date by one day
		const nextDate = incrementDate(selectedToDate);

		// Set the endDate state to the next date
		setEndDate(nextDate);
	};

	const incrementDate = (dateString) => {
		const selectedDate = new Date(dateString);
		selectedDate.setDate(selectedDate.getDate() + 1);

		// Format the next date to match the 'YYYY-MM-DD' format used by the input type 'date'
		const formattedNextDate = selectedDate.toISOString().split('T')[0];

		return formattedNextDate;
	};

	// // Declare isStartDateValid and isEndDateValid before the .filter function
	// const isStartDateValid =
	// 	startDate !== '' && !isNaN(new Date(startDate).getTime());
	// const isEndDateValid = endDate !== '' && !isNaN(new Date(endDate).getTime());

	const filteredDataByDate = filteredAgentSelectData
		.filter((item) => {
			const itemDate = new Date(item.invoicedetails.invoicedate);

			// Check if startDate and endDate are valid date strings
			const isStartDateValid =
				startDate !== '' && !isNaN(new Date(startDate).getTime());
			const isEndDateValid =
				endDate !== '' && !isNaN(new Date(endDate).getTime());

			if (
				(isStartDateValid && itemDate >= new Date(startDate)) ||
				!isStartDateValid
			) {
				if (
					(isEndDateValid && itemDate <= new Date(endDate)) ||
					!isEndDateValid
				) {
					return true;
				}
			}

			return false;
		})
		.map((item) => {
			const toDate = endDate
				? new Date(endDate) // Create a new date object from the endDate
				: null;

			if (toDate) {
				// Add one day to the toDate
				toDate.setDate(toDate.getDate() + 1);
			}

			return {
				...item,
				fromDate: startDate || null,
				toDate: toDate || null,
			};
		});

	// console.log(filteredDataByDate);

	useEffect(() => {
		// console.log('Selected Agent:', selectedAgentOption);

		const agentWiseData = filteredAgentSelectData.filter((item) => {
			const agentCompanyName =
				(item.sellerdetails && item.sellerdetails.sellercompanyname) || '';
			const agentCompanyState =
				(item.sellerdetails && item.sellerdetails.sellercompanystatename) || '';

			if (
				agentCompanyName === selectedAgentOption ||
				agentCompanyState === selectedAgentOption
			) {
				return true;
			}

			return false;
		});

		setAgentData(agentWiseData);
		// console.log(agentWiseData);
	}, [selectedAgentOption]);

	// console.log('agentData', agentData);

	// //for showing data of selected agent
	// const handleShowButtonClick = () => {
	// 	const newWindow = window.open('', '_blank');
	// 	newWindow.document.write(
	// 		'<html><head><title>Agent Data</title></head><body>'
	// 	);

	// 	newWindow.document.write(
	// 		'<h2 style="text-align: center; font-size: 40px;">Agent Details</h2>'
	// 	);
	// 	newWindow.document.write(
	// 		'<table style="width: 70%; margin: 0 auto; border-collapse: collapse; border: 1px solid #ddd;">'
	// 	);

	// 	// Table header
	// 	newWindow.document.write('<tr style="background-color: #f2f2f2;">');
	// 	newWindow.document.write(
	// 		'<th style="padding: 8px; font-size: 24px; text-align: center; border: 1px solid #ddd;">Agent Name</th>'
	// 	);
	// 	newWindow.document.write(
	// 		'<th style="padding: 8px; font-size: 24px; text-align: center; border: 1px solid #ddd;">Date</th>'
	// 	);
	// 	newWindow.document.write(
	// 		'<th style="padding: 8px; font-size: 24px; text-align: center; border: 1px solid #ddd;">Quantity</th>'
	// 	);
	// 	newWindow.document.write(
	// 		'<th style="padding: 8px; font-size: 24px; text-align: center; border: 1px solid #ddd;">Place</th>'
	// 	);
	// 	newWindow.document.write('</tr>');

	// 	// Table body
	// 	let totalQuantity = 0; // Initialize total quantity

	// 	agentData.forEach((dataItem, index) => {
	// 		newWindow.document.write('<tr>');
	// 		newWindow.document.write(
	// 			`<td style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">${dataItem.sellerdetails.sellercompanyname}</td>`
	// 		);
	// 		newWindow.document.write(
	// 			`<td style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">${
	// 				dataItem.invoicedetails && dataItem.invoicedetails.invoicedate
	// 					? dataItem.invoicedetails.invoicedate.substring(0, 10)
	// 					: 'N/A'
	// 			}</td>`
	// 		);
	// 		const itemQuantity =
	// 			dataItem.consignmentdetails.itemdetails[0]?.itemquantity !== undefined
	// 				? dataItem.consignmentdetails.itemdetails[0]?.itemquantity
	// 				: 0;
	// 		totalQuantity += itemQuantity; // Accumulate quantity
	// 		newWindow.document.write(
	// 			`<td style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">${itemQuantity}</td>`
	// 		);
	// 		newWindow.document.write(
	// 			`<td style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">${dataItem.sellerdetails.sellercompanystatename}</td>`
	// 		);
	// 		newWindow.document.write('</tr>');
	// 	});

	// 	newWindow.document.write('</table>');

	// 	// Display total quantity after the table
	// 	newWindow.document.write(
	// 		`<h2 style="text-align: center; font-size: 24px;">Total Quantity: ${totalQuantity}</h2>`
	// 	);

	// 	newWindow.document.write('</body></html>');
	// };

	// //for showing data of agents by date
	// const handleShowDataByDate = () => {
	// 	const newWindow = window.open('', '_blank');
	// 	newWindow.document.write(
	// 		'<html><head><title>Agent Details</title></head><body>'
	// 	);

	// 	newWindow.document.write(
	// 		'<h2 style="text-align: center; font-size: 40px;">Agent Details</h2>'
	// 	);
	// 	newWindow.document.write(
	// 		'<table style="width: 70%; margin: 0 auto; border-collapse: collapse; border: 1px solid #ddd;">'
	// 	);

	// 	// Table header
	// 	newWindow.document.write('<tr style="background-color: #f2f2f2;">');
	// 	newWindow.document.write(
	// 		'<th style="padding: 8px; font-size: 24px; text-align: center; border: 1px solid #ddd;">Agent Name</th>'
	// 	);
	// 	newWindow.document.write(
	// 		'<th style="padding: 8px; font-size: 24px; text-align: center; border: 1px solid #ddd;">Date</th>'
	// 	);
	// 	newWindow.document.write(
	// 		'<th style="padding: 8px; font-size: 24px; text-align: center; border: 1px solid #ddd;">Quantity</th>'
	// 	);
	// 	newWindow.document.write(
	// 		'<th style="padding: 8px; font-size: 24px; text-align: center; border: 1px solid #ddd;">Place</th>'
	// 	);
	// 	newWindow.document.write('</tr>');

	// 	// Table body
	// 	let totalQuantity = 0; // Initialize total quantity

	// 	filteredDataByDate.forEach((dataItem, index) => {
	// 		newWindow.document.write('<tr>');
	// 		newWindow.document.write(
	// 			`<td style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">${dataItem.sellerdetails.sellercompanyname}</td>`
	// 		);
	// 		newWindow.document.write(
	// 			`<td style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">${
	// 				dataItem.invoicedetails && dataItem.invoicedetails.invoicedate
	// 					? dataItem.invoicedetails.invoicedate.substring(0, 10)
	// 					: 'N/A'
	// 			}</td>`
	// 		);
	// 		const itemQuantity =
	// 			dataItem.consignmentdetails.itemdetails[0]?.itemquantity !== undefined
	// 				? dataItem.consignmentdetails.itemdetails[0]?.itemquantity
	// 				: 0;
	// 		totalQuantity += itemQuantity; // Accumulate quantity
	// 		newWindow.document.write(
	// 			`<td style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">${itemQuantity}</td>`
	// 		);
	// 		newWindow.document.write(
	// 			`<td style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">${dataItem.sellerdetails.sellercompanystatename}</td>`
	// 		);
	// 		newWindow.document.write('</tr>');
	// 	});

	// 	newWindow.document.write('</table>');

	// 	// Display total quantity after the table
	// 	newWindow.document.write(
	// 		`<h2 style="text-align: center; font-size: 24px;">Total Quantity: ${totalQuantity}</h2>`
	// 	);

	// 	newWindow.document.write('</body></html>');
	// };

	//for showing data of load section by date
	const handleShowLoadDataByDate = () => {
		const newWindow = window.open('', '_blank');
		newWindow.document.write(
			'<html><head><title>Load Details</title></head><body>'
		);

		newWindow.document.write(
			'<h2 style="text-align: center; font-size: 40px;">Load Details</h2>'
		);
		newWindow.document.write(
			'<table style="width: 70%; margin: 0 auto; border-collapse: collapse; border: 1px solid #ddd;">'
		);

		// Table header
		newWindow.document.write('<tr style="background-color: #fcec03;">');
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Invoice NO</th>'
		);
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Date</th>'
		);
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Transportation Cost</th>'
		);
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Company Name</th>'
		);
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">No of Items</th>'
		);
		newWindow.document.write('</tr>');

		filteredDataByDate.forEach((dataItem, index) => {
			newWindow.document.write('<tr>');
			newWindow.document.write(
				`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
					dataItem.invoicedetails && dataItem.invoicedetails.invoiceno
						? dataItem.invoicedetails.invoiceno.substring(0, 12)
						: 'N/A'
				}</td>`
			);
			newWindow.document.write(
				`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
					dataItem.invoicedetails && dataItem.invoicedetails.invoicedate
						? new Date(dataItem.invoicedetails.invoicedate).toLocaleDateString(
								'en-GB',
								{
									day: '2-digit',
									month: '2-digit',
									year: 'numeric',
								}
						  )
						: 'N/A'
				}</td>`
			);
			newWindow.document.write(
				`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
					dataItem.loadingdetails && dataItem.loadingdetails.transportationcost
						? dataItem.loadingdetails.transportationcost
						: 'N/A'
				}</td>`
			);
			newWindow.document.write(
				`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
					dataItem.companydetails && dataItem.companydetails.companyname
						? dataItem.companydetails.companyname.substring(0, 12)
						: 'N/A'
				}</td>`
			);
			newWindow.document.write(
				`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
					dataItem.consignmentdetails &&
					dataItem.consignmentdetails.itemdetails &&
					dataItem.consignmentdetails.itemdetails.length
						? dataItem.consignmentdetails.itemdetails.length
						: 'N/A'
				}</td>`
			);
			newWindow.document.write('</tr>');
		});

		newWindow.document.write('</table>');

		newWindow.document.write('</body></html>');
	};

	//for showing data of mis section by date
	const handleShowMisDataByDate = () => {
		const newWindow = window.open('', '_blank');
		newWindow.document.write(
			'<html><head><title>MIS Details</title></head><body>'
		);

		newWindow.document.write(
			'<h2 style="text-align: center; font-size: 40px;">MIS Details</h2>'
		);
		newWindow.document.write(
			'<table style="width: 70%; margin: 0 auto; border-collapse: collapse; border: 1px solid #ddd;">'
		);

		// Table header
		newWindow.document.write('<tr style="background-color: #fcec03;">');
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Date</th>'
		);
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Buyer</th>'
		);
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Load From</th>'
		);
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Destination</th>'
		);
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Motor Vehicle No</th>'
		);
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Total Qty</th>'
		);
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Ref. Code</th>'
		);
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Bill Maker Name</th>'
		);
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Rate</th>'
		);
		newWindow.document.write('</tr>');

		filteredDataByDate.forEach((dataItem, index) => {
			dataItem.consignmentdetails.itemdetails.forEach((item, index) => {
				newWindow.document.write('<tr>');
				newWindow.document.write(
					`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
						dataItem.invoicedetails && dataItem.invoicedetails.invoicedate
							? new Date(
									dataItem.invoicedetails.invoicedate
							  ).toLocaleDateString('en-GB', {
									day: '2-digit',
									month: '2-digit',
									year: 'numeric',
							  })
							: 'N/A'
					}</td>`
				);
				newWindow.document.write(
					`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
						dataItem.buyerdetails && dataItem.buyerdetails.buyercompanyname
							? dataItem.buyerdetails.buyercompanyname.substring(0, 12)
							: 'N/A'
					}</td>`
				);
				newWindow.document.write(
					`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
						dataItem.loadingdetails && dataItem.loadingdetails.startpoint
							? dataItem.loadingdetails.startpoint.substring(0, 12)
							: 'N/A'
					}</td>`
				);
				newWindow.document.write(
					`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
						dataItem.loadingdetails && dataItem.loadingdetails.endpoint
							? dataItem.loadingdetails.endpoint.substring(0, 12)
							: 'N/A'
					}</td>`
				);
				newWindow.document.write(
					`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
						dataItem.vehicledetails && dataItem.vehicledetails.vechiclenumber
							? dataItem.vehicledetails.vechiclenumber.substring(0, 12)
							: 'N/A'
					}</td>`
				);
				newWindow.document.write(
					`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
						item.itemquantity ? item.itemquantity : 'N/A'
					}</td>`
				);
				newWindow.document.write(
					`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
						dataItem.boardingdetails && dataItem.boardingdetails.partyref
							? dataItem.boardingdetails.partyref.substring(0, 12)
							: 'N/A'
					}</td>`
				);
				newWindow.document.write(
					`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
						dataItem.invoicedetails && dataItem.invoicedetails.invoicemakername
							? dataItem.invoicedetails.invoicemakername.substring(0, 12)
							: 'N/A'
					}</td>`
				);
				newWindow.document.write(
					`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
						item.itemtaxrate ? item.itemtaxrate : 'N/A'
					}</td>`
				);
				newWindow.document.write('</tr>');
			});
		});

		newWindow.document.write('</table>');

		newWindow.document.write('</body></html>');
	};

	//for showing data of Day section by date
	const handleShowDayDataByDate = () => {
		const newWindow = window.open('', '_blank');
		newWindow.document.write(
			'<html><head><title>Day Wise Details</title></head><body>'
		);

		newWindow.document.write(
			'<h2 style="text-align: center; font-size: 40px;">Day Wise Details</h2>'
		);
		newWindow.document.write(
			'<table style="width: 70%; margin: 0 auto; border-collapse: collapse; border: 1px solid #ddd;">'
		);

		// Table header
		newWindow.document.write('<tr style="background-color: #fcec03;">');
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Created Date</th>'
		);
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Invoice NO</th>'
		);
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Invoice Date</th>'
		);
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Transportaion Cost</th>'
		);
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Loading Date</th>'
		);
		newWindow.document.write('</tr>');

		filteredDataByDate.forEach((dataItem, index) => {
			newWindow.document.write('<tr>');
			newWindow.document.write(
				`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
					dataItem.invoicedetails.invoicecreatedate
						? new Date(dataItem.invoicedetails.invoicecreatedate).toLocaleDateString(
								'en-GB',
								{
									day: '2-digit',
									month: '2-digit',
									year: 'numeric',
								}
						  )
						: 'N/A'
				}</td>`
			);
			newWindow.document.write(
				`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
					dataItem.invoicedetails && dataItem.invoicedetails.invoiceno
						? dataItem.invoicedetails.invoiceno.substring(0, 12)
						: 'N/A'
				}</td>`
			);

			newWindow.document.write(
				`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
					dataItem.invoicedetails.invoicedate
						? new Date(dataItem.invoicedetails.invoicedate).toLocaleDateString(
								'en-GB',
								{
									day: '2-digit',
									month: '2-digit',
									year: 'numeric',
								}
						  )
						: 'N/A'
				}</td>`
			);
			newWindow.document.write(
				`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
					dataItem.loadingdetails.transportationcost
						? dataItem.loadingdetails.transportationcost
						: 'N/A'
				}</td>`
			);
			newWindow.document.write(
				`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
					dataItem.boardingdetails.dateofloading
						? new Date(dataItem.boardingdetails.dateofloading).toLocaleDateString(
								'en-GB',
								{
									day: '2-digit',
									month: '2-digit',
									year: 'numeric',
								}
						  )
						: 'N/A'
				}</td>`
			);
			newWindow.document.write('</tr>');
		});

		newWindow.document.write('</table>');

		newWindow.document.write('</body></html>');
	};

	//for showing data of Item section by date
	const handleShowItemDataByDate = () => {
		const newWindow = window.open('', '_blank');
		newWindow.document.write(
			'<html><head><title>Item Wise Details</title></head><body>'
		);

		newWindow.document.write(
			'<h2 style="text-align: center; font-size: 40px;">Item Wise Details</h2>'
		);
		newWindow.document.write(
			'<table style="width: 70%; margin: 0 auto; border-collapse: collapse; border: 1px solid #ddd;">'
		);

		// Table header
		newWindow.document.write('<tr style="background-color: #fcec03;">');
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Date</th>'
		);
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Invoice No</th>'
		);
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Item Name</th>'
		);
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Item Amount</th>'
		);
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Item Tax</th>'
		);
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Item Quantity</th>'
		);

		newWindow.document.write('</tr>');

		filteredDataByDate.forEach((dataItem, index) => {
			dataItem.consignmentdetails.itemdetails.forEach((item, index) => {
				newWindow.document.write('<tr>');
				newWindow.document.write(
					`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
						dataItem.invoicedetails && dataItem.invoicedetails.invoicedate
							? new Date(
									dataItem.invoicedetails.invoicedate
							  ).toLocaleDateString('en-GB', {
									day: '2-digit',
									month: '2-digit',
									year: 'numeric',
							  })
							: 'N/A'
					}</td>`
				);
				newWindow.document.write(
					`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
						dataItem.invoicedetails && dataItem.invoicedetails.invoiceno
							? dataItem.invoicedetails.invoiceno.substring(0, 12)
							: 'N/A'
					}</td>`
				);

				newWindow.document.write(
					`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
						item.itemname ? item.itemname : 'N/A'
					}</td>`
				);
				newWindow.document.write(
					`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
						item.itemprice ? item.itemprice : 'N/A'
					}</td>`
				);
				newWindow.document.write(
					`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
						item.itemtaxrate ? item.itemtaxrate : 'N/A'
					}</td>`
				);
				newWindow.document.write(
					`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
						item.itemquantity ? item.itemquantity : 'N/A'
					}</td>`
				);
				newWindow.document.write('</tr>');
			});
		});

		newWindow.document.write('</table>');

		newWindow.document.write('</body></html>');
	};

	//for showing data of Vehicle section by date
	const handleShowVehicleDataByDate = () => {
		const newWindow = window.open('', '_blank');
		newWindow.document.write(
			'<html><head><title>Vehicle Wise Details</title></head><body>'
		);

		newWindow.document.write(
			'<h2 style="text-align: center; font-size: 40px;">Vehicle Wise Details</h2>'
		);
		newWindow.document.write(
			'<table style="width: 70%; margin: 0 auto; border-collapse: collapse; border: 1px solid #ddd;">'
		);

		// Table header
		newWindow.document.write('<tr style="background-color: #fcec03;">');
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Vehicle No</th>'
		);
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Invoice Date</th>'
		);
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Invoice No</th>'
		);
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Transportation Cost</th>'
		);
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Driver Number</th>'
		);
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Vehicle Model</th>'
		);
		newWindow.document.write('</tr>');

		filteredDataByDate.forEach((dataItem, index) => {
			newWindow.document.write('<tr>');
			newWindow.document.write(
				`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
					dataItem.vehicledetails && dataItem.vehicledetails.vechiclenumber
						? dataItem.vehicledetails.vechiclenumber.substring(0, 12)
						: 'N/A'
				}</td>`
			);
			newWindow.document.write(
				`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
					dataItem.invoicedetails && dataItem.invoicedetails.invoicedate
						? new Date(dataItem.invoicedetails.invoicedate).toLocaleDateString(
								'en-GB',
								{
									day: '2-digit',
									month: '2-digit',
									year: 'numeric',
								}
						  )
						: 'N/A'
				}</td>`
			);
			newWindow.document.write(
				`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
					dataItem.invoicedetails && dataItem.invoicedetails.invoiceno
						? dataItem.invoicedetails.invoiceno.substring(0, 12)
						: 'N/A'
				}</td>`
			);
			newWindow.document.write(
				`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
					dataItem.loadingdetails.transportationcost
						? dataItem.loadingdetails.transportationcost
						: 'N/A'
				}</td>`
			);
			newWindow.document.write(
				`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
					dataItem.vehicledetails && dataItem.vehicledetails.drivernumber
						? dataItem.vehicledetails.drivernumber
						: 'N/A'
				}</td>`
			);
			newWindow.document.write(
				`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
					dataItem.vehicledetails && dataItem.vehicledetails.vechiclemodel
						? dataItem.vehicledetails.vechiclemodel.substring(0, 12)
						: 'N/A'
				}</td>`
			);
			newWindow.document.write('</tr>');
		});

		newWindow.document.write('</table>');

		newWindow.document.write('</body></html>');
	};

	//for showing data of Driver section by date
	const handleShowDriverDataByDate = () => {
		const newWindow = window.open('', '_blank');
		newWindow.document.write(
			'<html><head><title>Driver Wise Details</title></head><body>'
		);

		newWindow.document.write(
			'<h2 style="text-align: center; font-size: 40px;">Driver Wise Details</h2>'
		);
		newWindow.document.write(
			'<table style="width: 70%; margin: 0 auto; border-collapse: collapse; border: 1px solid #ddd;">'
		);

		// Table header
		newWindow.document.write('<tr style="background-color: #fcec03;">');
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Driver Name</th>'
		);
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Vehicle No</th>'
		);
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Invoice No</th>'
		);
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Invoice Date</th>'
		);
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Transportation Cost</th>'
		);
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">Vehicle Model</th>'
		);
		newWindow.document.write(
			'<th style="padding: 8px; font-size: 20px; text-align: center; border: 1px solid #ddd;">No of Items</th>'
		);
		newWindow.document.write('</tr>');

		filteredDataByDate.forEach((dataItem, index) => {
			newWindow.document.write('<tr>');
			newWindow.document.write(
				`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
					dataItem.vehicledetails && dataItem.vehicledetails.drivernumber
						? dataItem.vehicledetails.drivernumber
						: 'N/A'
				}</td>`
			);
			newWindow.document.write(
				`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
					dataItem.vehicledetails && dataItem.vehicledetails.vechiclenumber
						? dataItem.vehicledetails.vechiclenumber.substring(0, 12)
						: 'N/A'
				}</td>`
			);
			newWindow.document.write(
				`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
					dataItem.invoicedetails && dataItem.invoicedetails.invoiceno
						? dataItem.invoicedetails.invoiceno.substring(0, 12)
						: 'N/A'
				}</td>`
			);
			newWindow.document.write(
				`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
					dataItem.invoicedetails && dataItem.invoicedetails.invoicedate
						? new Date(dataItem.invoicedetails.invoicedate).toLocaleDateString(
								'en-GB',
								{
									day: '2-digit',
									month: '2-digit',
									year: 'numeric',
								}
						  )
						: 'N/A'
				}</td>`
			);
			newWindow.document.write(
				`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
					dataItem.loadingdetails.transportationcost
						? dataItem.loadingdetails.transportationcost
						: 'N/A'
				}</td>`
			);
			newWindow.document.write(
				`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
					dataItem.vehicledetails && dataItem.vehicledetails.vechiclemodel
						? dataItem.vehicledetails.vechiclemodel.substring(0, 12)
						: 'N/A'
				}</td>`
			);
			newWindow.document.write(
				`<td style="padding: 8px; font-size: 16px; text-align: center; border: 1px solid #ddd;">${
					dataItem.consignmentdetails &&
					dataItem.consignmentdetails.itemdetails &&
					dataItem.consignmentdetails.itemdetails.length
						? dataItem.consignmentdetails.itemdetails.length
						: 'N/A'
				}</td>`
			);

			newWindow.document.write('</tr>');
		});

		newWindow.document.write('</table>');

		newWindow.document.write('</body></html>');
	};

	const handleSearchInputChange = (e) => {
		const inputValue = e.target.value;
		setSearchInput(inputValue);
	
		switch (value) {
			case 'load':
				const filteredLoadData = displayedInvoiceSearch.map((invoice) => ({
					'Invoice No': invoice.invoicedetails?.invoiceno ?? 'N/A',
					Date: invoice.invoicedetails?.invoicedate
						? new Date(invoice.invoicedetails.invoicedate).toLocaleDateString('en-GB', {
							  day: '2-digit',
							  month: '2-digit',
							  year: 'numeric',
						  })
						: 'N/A',
					'Total Cost': invoice.loadingdetails?.transportationcost ?? 'N/A',
					'Company Name': invoice.companydetails?.companyname ?? 'N/A',
					'No of Items': invoice.consignmentdetails?.itemdetails.length ?? '0',
				}));
	
				setExportedData(filteredLoadData);
				break;
			case 'mis':
				const filteredMisData = displayedInvoiceSearch.map((invoice) => ({
					'Invoice No': invoice.invoicedetails?.invoiceno ?? 'N/A',
					'Buyer': invoice.buyerdetails?.buyercompanyname ?? 'N/A',
					'Load From': invoice.loadingdetails?.startpoint ?? 'N/A',
					'Destination': invoice.loadingdetails?.endpoint ?? 'N/A',
					'Motor vehicle No': invoice.vehicledetails?.vechiclenumber ?? 'N/A',
					'Ref. Code': invoice.boardingdetails?.partyref ?? 'N/A',
					'Date': invoice.invoicedetails?.invoicedate
						? new Date(invoice.invoicedetails.invoicedate).toLocaleDateString('en-GB', {
							  day: '2-digit',
							  month: '2-digit',
							  year: 'numeric',
						  })
						: 'N/A',
					'Total Cost': invoice.loadingdetails?.transportationcost ?? 'N/A',
					'Company Name': invoice.companydetails?.companyname ?? 'N/A',
					'No of Items': invoice.consignmentdetails?.itemdetails.length ?? '0',
				}));
	
				setExportedData(filteredMisData);
				break;
			case 'day':
				const filteredDayData = displayedInvoiceSearch.map((invoice) => ({
					'Created Date': invoice.invoicedetails?.invoicecreatedate
						? new Date(invoice.invoicedetails.invoicecreatedate).toLocaleDateString('en-GB', {
							  day: '2-digit',
							  month: '2-digit',
							  year: 'numeric',
						  })
						: 'N/A',
					'Invoice No': invoice.invoicedetails?.invoiceno ?? 'N/A',
					'Invoice Date': invoice.invoicedetails?.invoicedate
						? new Date(invoice.invoicedetails.invoicedate).toLocaleDateString('en-GB', {
							  day: '2-digit',
							  month: '2-digit',
							  year: 'numeric',
						  })
						: 'N/A',
					'Transportation Cost': invoice.loadingdetails?.transportationcost ?? 'N/A',
					'Loading Date': invoice.boardingdetails?.dateofloading
						? new Date(invoice.boardingdetails.dateofloading).toLocaleDateString('en-GB', {
							  day: '2-digit',
							  month: '2-digit',
							  year: 'numeric',
						  })
						: 'N/A',
				}));
	
				setExportedData(filteredDayData);
				break;
			case 'item':
				const filteredItemData = displayedInvoiceSearch.flatMap((invoice) =>
					invoice.consignmentdetails?.itemdetails.map((item) => ({
						'Invoice Date': invoice.invoicedetails?.invoicedate
							? new Date(invoice.invoicedetails.invoicedate).toLocaleDateString('en-GB', {
								  day: '2-digit',
								  month: '2-digit',
								  year: 'numeric',
							  })
							: 'N/A',
						'Invoice No': invoice.invoicedetails?.invoiceno ?? 'N/A',
						'Item Name': item.itemname,
						'Item Amount': item.itemprice,
						'Item Tax': item.itemtaxrate,
						'Item Quantity': item.itemquantity,
					}))
				);
	
				setExportedData(filteredItemData);
				break;
			case 'agent':
				const filteredAgentData = displayedInvoiceSearch.map((invoice) => ({
					'Agent Company Name': invoice.sellerdetails?.sellercompanyname?.substring(0, 12) ?? 'N/A',
					'Item Quantity': invoice.consignmentdetails?.itemdetails[0]?.itemquantity ?? 'N/A',
					'Invoice Date': invoice.invoicedetails?.invoicedate?.substring(0, 12) ?? 'N/A',
					'Anget Company State Name': invoice.sellerdetails?.sellercompanystatename?.substring(0, 12) ?? 'N/A',
				}));
	
				setExportedData(filteredAgentData);
				break;
			case 'vechicle':
				const filteredVehicleData = displayedInvoiceSearch.map((invoice) => ({
					'Vehicle No': invoice.vehicledetails?.vechiclenumber ?? 'N/A',
					'Invoice Date': invoice.invoicedetails?.invoicedate
						? new Date(invoice.invoicedetails.invoicedate).toLocaleDateString('en-GB', {
							  day: '2-digit',
							  month: '2-digit',
							  year: 'numeric',
						  })
						: 'N/A',
					'Invoice No': invoice.invoicedetails?.invoiceno ?? 'N/A',
					'Transportation Cost': invoice.loadingdetails?.transportationcost ?? 'N/A',
					'Driver Number': invoice.vehicledetails?.drivernumber ?? 'N/A',
					'Vehicle Model': invoice.vehicledetails?.vechiclemodel ?? 'N/A',
				}));
	
				setExportedData(filteredVehicleData);
				break;
			case 'driver':
				const filteredDriverData = displayedInvoiceSearch.map((invoice) => ({
					'Driver Number': invoice.vehicledetails?.drivernumber ?? 'N/A',
					'Vehicle No': invoice.vehicledetails?.vechiclenumber ?? 'N/A',
					'Invoice No': invoice.invoicedetails?.invoiceno ?? 'N/A',
					'Invoice Date': invoice.invoicedetails?.invoicedate
						? new Date(invoice.invoicedetails.invoicedate).toLocaleDateString('en-GB', {
							  day: '2-digit',
							  month: '2-digit',
							  year: 'numeric',
						  })
						: 'N/A',
					'Transportation Cost': invoice.loadingdetails?.transportationcost ?? 'N/A',
					'Vehicle Model': invoice.vehicledetails?.vechiclemodel ?? 'N/A',
					'No of Items': invoice.consignmentdetails?.itemdetails.length ?? '0',
				}));
	
				setExportedData(filteredDriverData);
				break;
			default:
				break;
		}
	};
	

	const exportMisReport = () => {
		const filteredMisDataData = displayedInvoiceSearch.map((invoice) => ({
			'Date':
				invoice.invoicedetails && invoice.invoicedetails.invoicedate
					? new Date(invoice.invoicedetails.invoicedate).toLocaleDateString(
							'en-GB',
							{
								day: '2-digit',
								month: '2-digit',
								year: 'numeric',
							}
					  )
					: 'N/A',
					'Buyer Name':
					invoice.buyerdetails && invoice.buyerdetails.buyercompanyname
						? invoice.buyerdetails.buyercompanyname
						: 'N/A',
			'Load From':
				invoice.loadingdetails && invoice.loadingdetails.startpoint
					? invoice.loadingdetails.startpoint
					: 'N/A',
			'Destination':
				invoice.loadingdetails && invoice.loadingdetails.endpoint
					? invoice.loadingdetails.endpoint
					: 'N/A',
			'Motor vehicle No':
				invoice.vehicledetails && invoice.vehicledetails.vechiclenumber
					? invoice.vehicledetails.vechiclenumber
					: 'N/A',
			'Total Quantity':
				invoice.consignmentdetails &&
				invoice.consignmentdetails.itemdetails[0]
					? invoice.consignmentdetails.itemdetails[0].itemquantity
					: '0',
			'Ref. Code':
				invoice.boardingdetails && invoice.boardingdetails.partyref
					? invoice.boardingdetails.partyref
					: 'N/A',
			'Bill Maker Name':
				invoice.invoicedetails && invoice.invoicedetails.invoicemakername
					? invoice.invoicedetails.invoicemakername
					: 'N/A',
			'Rate':
				invoice.consignmentdetails && invoice.consignmentdetails.itemdetails[0]
					? invoice.consignmentdetails.itemdetails[0].itemprice
					: 'N/A',
		}));
		setExportedData(filteredMisDataData);
	};

	const exportLoadReport = () => {
		const filteredLoadDataData = displayedInvoiceSearch.map((invoice) => ({
			'Invoice No':
				invoice.invoicedetails && invoice.invoicedetails.invoiceno
					? invoice.invoicedetails.invoiceno
					: 'N/A',
			'Date':
				invoice.invoicedetails && invoice.invoicedetails.invoicedate
					? new Date(invoice.invoicedetails.invoicedate).toLocaleDateString(
							'en-GB',
							{
								day: '2-digit',
								month: '2-digit',
								year: 'numeric',
							}
					  )
					: 'N/A',
			'Transportation Cost':
				invoice.loadingdetails && invoice.loadingdetails.transportationcost
					? invoice.loadingdetails.transportationcost
					: 'N/A',
			'Company Name':
				invoice.companydetails && invoice.companydetails.companyname
					? invoice.companydetails.companyname
					: 'N/A',
			'No of Items':
				invoice.consignmentdetails &&
				invoice.consignmentdetails.itemdetails.length
					? invoice.consignmentdetails.itemdetails.length
					: '0',
		}));
		setExportedData(filteredLoadDataData);
	};

	const exportDayWiseReport = () => {
		const filteredDayData = displayedInvoiceSearch.map((invoice) => ({
			'Created Date':
				invoice.invoicedetails && invoice.invoicedetails.invoicecreatedate
					? new Date(invoice.invoicedetails.invoicecreatedate).toLocaleDateString(
							'en-GB',
							{
								day: '2-digit',
								month: '2-digit',
								year: 'numeric',
							}
					  )
					: 'N/A',
					'Invoice No':
					invoice.invoicedetails && invoice.invoicedetails.invoiceno
						? invoice.invoicedetails.invoiceno
						: 'N/A',
				'Invoice Date':
						invoice.invoicedetails && invoice.invoicedetails.invoicedate
							? new Date(invoice.invoicedetails.invoicedate).toLocaleDateString(
									'en-GB',
									{
										day: '2-digit',
										month: '2-digit',
										year: 'numeric',
									}
							  )
							: 'N/A',
			'Transportation Cost':
				invoice.loadingdetails && invoice.loadingdetails.transportationcost
					? invoice.loadingdetails.transportationcost
					: 'N/A',
			'Loading Date':
					invoice.boardingdetails && invoice.boardingdetails.dateofloading
						? new Date(invoice.boardingdetails.dateofloading).toLocaleDateString(
								'en-GB',
								{
									day: '2-digit',
									month: '2-digit',
									year: 'numeric',
								}
						  )
						: 'N/A',
		}));
		setExportedData(filteredDayData);
	};

	const exportItemWiseReport = () => {
		const filteredItemData = displayedInvoiceSearch.flatMap((invoice) =>
			invoice.consignmentdetails.itemdetails.map((item) => ({
				'Invoice Date':
						invoice.invoicedetails && invoice.invoicedetails.invoicedate
							? new Date(invoice.invoicedetails.invoicedate).toLocaleDateString(
									'en-GB',
									{
										day: '2-digit',
										month: '2-digit',
										year: 'numeric',
									}
							  )
							: 'N/A',
				'Invoice No':
					invoice.invoicedetails && invoice.invoicedetails.invoiceno
						? invoice.invoicedetails.invoiceno
						: 'N/A',
				'Item Name': item.itemname,
				'Item Amount': item.itemprice,
				'Item Tax': item.itemtaxrate,
				'Item Quantity': item.itemquantity,
				
			}))
		);
		setExportedData(filteredItemData);
	};

	const exportVehicleWiseReport = () => {
		const filteredVehicleData = displayedInvoiceSearch.map((invoice) => ({
			'Vehicle No':
					invoice.vehicledetails && invoice.vehicledetails.vechiclenumber
				? invoice.vehicledetails.vechiclenumber
				: 'N/A',
			'Invoice Date':
						invoice.invoicedetails && invoice.invoicedetails.invoicedate
							? new Date(invoice.invoicedetails.invoicedate).toLocaleDateString(
									'en-GB',
									{
										day: '2-digit',
										month: '2-digit',
										year: 'numeric',
									}
							  )
							: 'N/A',
			'Invoice No':
							invoice.invoicedetails && invoice.invoicedetails.invoiceno
								? invoice.invoicedetails.invoiceno
								: 'N/A',
			'Transportation Cost':
				invoice.loadingdetails && invoice.loadingdetails.transportationcost
					? invoice.loadingdetails.transportationcost
					: 'N/A',
			'Driver Number':
				invoice.vehicledetails && invoice.vehicledetails.drivernumber
					? invoice.vehicledetails.drivernumber
					: 'N/A',
			'Vehicle Model':
					invoice.vehicledetails && invoice.vehicledetails.vechiclemodel
						? invoice.vehicledetails.vechiclemodel
						: 'N/A',
		}));
		setExportedData(filteredVehicleData);
	};

	const exportDriverWiseReport = () => {
		const filteredDriverData = displayedInvoiceSearch.map((invoice) => ({
			'Driver Number':
				invoice.vehicledetails && invoice.vehicledetails.drivernumber
					? invoice.vehicledetails.drivernumber
					: 'N/A',
			'Vehicle No':
					invoice.vehicledetails && invoice.vehicledetails.vechiclenumber
				? invoice.vehicledetails.vechiclenumber
				: 'N/A',
			'Invoice No':
				invoice.invoicedetails && invoice.invoicedetails.invoiceno
					? invoice.invoicedetails.invoiceno
					: 'N/A',
			'Invoice Date':
						invoice.invoicedetails && invoice.invoicedetails.invoicedate
							? new Date(invoice.invoicedetails.invoicedate).toLocaleDateString(
									'en-GB',
									{
										day: '2-digit',
										month: '2-digit',
										year: 'numeric',
									}
							  )
							: 'N/A',
			'Transportation Cost':
							invoice.loadingdetails && invoice.loadingdetails.transportationcost
								? invoice.loadingdetails.transportationcost
								: 'N/A',
			'Vehicle Model':
					invoice.vehicledetails && invoice.vehicledetails.vechiclemodel
						? invoice.vehicledetails.vechiclemodel
						: 'N/A',
			'No of Items':
						invoice.consignmentdetails &&
						invoice.consignmentdetails.itemdetails.length
							? invoice.consignmentdetails.itemdetails.length
							: '0',
		}));
		setExportedData(filteredDriverData);
	};

	const exportAgentWiseReport = () => {
		const filteredAgentData = displayedInvoiceSearch.map((invoice) => ({
			'Agent Company Name':
				invoice.sellerdetails?.sellercompanyname ?? '<N/A',
			'Item Quantity':
				invoice.consignmentdetails?.itemdetails[0] ?? '<N/A',
			'Invoice Date':
				invoice.invoicedetails?.invoicedate ?? '<N/A',
			'Anget Company State Name':
				invoice.sellerdetails?.sellercompanystatename ??
				'<N/A',
		}));
		setExportedData(filteredAgentData);
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
			<div className='reports'>
				<div className='reports-data'>
					<div className='reports-data-header'>

						<button
							className='reports-data-header-button start'
							value='load'
							onClick={() => {
								changeTable('load');
								exportLoadReport();
							}}
						>
							Load Report
						</button>
						<button
							className='reports-data-header-button'
							value='mis'
							onClick={() => {
								changeTable('mis');
								exportMisReport();
							}}
						>
							MIS Report
						</button>
						<button
							className='reports-data-header-button'
							value='day'
							onClick={() => {
								changeTable('day');
								exportDayWiseReport();
							}}
						>
							Day Wise Report
						</button>
						<button
							className='reports-data-header-button'
							value='item'
							onClick={() => {
								changeTable('item');
								exportItemWiseReport();
							}}
						>
							Item Wise Report
						</button>
						<button
							className='reports-data-header-button'
							value='agent'
							onClick={() => {
								changeTable('agent');
								exportAgentWiseReport();
							}}
						>
							Agent Wise Report
						</button>
						<button
							className='reports-data-header-button'
							value='vechicle'
							onClick={() => {
								changeTable('vechicle');
								exportVehicleWiseReport();
							}}
						>
							Vehicle Wise Report
						</button>
						<button
							className='reports-data-header-button end'
							value='driver'
							onClick={() => {
								changeTable('driver');
								exportDriverWiseReport();
							}}
						>
							Driver Wise Report
						</button>
					</div>
					<div className='reports-data-top'>
						<div className='reports-data-search'>
							<input
								type='text'
								placeholder='Search Invoice...'
								className='reports-search-input'
								value={searchInput}
								onChange={handleSearchInputChange}
							/>
						</div>
						{/*
						<CSVLink
							data={exportedData}
							filename={`exported_data_${new Date().toISOString()}.csv`}
							className='export-button'
							target='_blank'
						>
							Export
						</CSVLink>
						*/}
					</div>

					<div className='reports-data-body-container'>
						{value === 'mis' && (
							<div className='data-show-div'>
								<div style={{ margin: '10px' }}>
									<div className='date-div'>
										<label className='date-label'>From:</label>
										<input
											className='date-select'
											type='date'
											value={startDate}
											onChange={handleFromDateSelect}
										/>
										<label className='date-label'>To:</label>
										<input
											className='date-select'
											type='date'
											value={endDate}
											onChange={handleToDateSelect}
										/>
										{/* Button for Date Range */}
										<button
											className='show-date-data-btn'
											onClick={handleShowMisDataByDate}
										>
											Show
										</button>
									</div>
								</div>
								<div className='reports-data-body'>
									<table className='reports-data-body-table-load'>
										<thead className='reports-data-body-table-load-head'>
											<tr className='reports-data-body-table-load-head-row'>
												<th className='reports-data-body-table-load-head-row-item'>
													Date
												</th>
												<th className='reports-data-body-table-load-head-row-item'>
													Buyer
												</th>
												<th className='reports-data-body-table-load-head-row-item'>
													Load From
												</th>
												<th className='reports-data-body-table-load-head-row-item'>
													Destination
												</th>
												<th className='reports-data-body-table-load-head-row-item'>
													Motor Vehicle No
												</th>
												<th className='reports-data-body-table-load-head-row-item'>
													Total Qty
												</th>
												<th className='reports-data-body-table-load-head-row-item'>
													Ref. Code
												</th>
												<th className='reports-data-body-table-load-head-row-item'>
													Bill Maker Name
												</th>
												<th className='reports-data-body-table-load-head-row-item'>
													Rate
												</th>
											</tr>
										</thead>
										<tbody className='reports-data-body-table-item-body'>
											{displayedInvoiceSearch.map((invoice) =>
												invoice.consignmentdetails.itemdetails.map(
													(item, index) => (
														<tr
															key={index}
															className='reports-data-body-table-item-body-row'
														>
															<td className='reports-data-body-table-day-body-row-item'>
																{invoice.invoicedetails.invoicedate
																	? new Date(
																			invoice.invoicedetails.invoicedate
																	  ).toLocaleDateString('en-GB', {
																			day: '2-digit',
																			month: '2-digit',
																			year: 'numeric',
																	  })
																	: 'N/A'}
															</td>
															<td className='reports-data-body-table-load-body-row-item'>
																{invoice.buyerdetails &&
																invoice.buyerdetails.buyercompanyname
																	? invoice.buyerdetails.buyercompanyname.substring(
																			0,
																			12
																	  )
																	: 'N/A'}
															</td>
															<td className='reports-data-body-table-load-body-row-item'>
																{invoice.loadingdetails &&
																invoice.loadingdetails.startpoint
																	? invoice.loadingdetails.startpoint.substring(
																			0,
																			12
																	  )
																	: 'N/A'}
															</td>
															<td className='reports-data-body-table-load-body-row-item'>
																{invoice.loadingdetails &&
																invoice.loadingdetails.endpoint
																	? invoice.loadingdetails.endpoint.substring(
																			0,
																			12
																	  )
																	: 'N/A'}
															</td>
															<td className='reports-data-body-table-load-body-row-item'>
																{invoice.vehicledetails &&
																invoice.vehicledetails.vechiclenumber
																	? invoice.vehicledetails.vechiclenumber.substring(
																			0,
																			12
																	  )
																	: 'N/A'}
															</td>
															<td className='reports-data-body-table-item-body-row-item'>
																{item.itemquantity ? item.itemquantity : 'N/A'}
															</td>
															<td className='reports-data-body-table-load-body-row-item'>
																{invoice.boardingdetails &&
																invoice.boardingdetails.partyref
																	? invoice.boardingdetails.partyref.substring(
																			0,
																			12
																	  )
																	: 'N/A'}
															</td>
															<td className='reports-data-body-table-load-body-row-item'>
																{invoice.invoicedetails &&
																invoice.invoicedetails.invoicemakername
																	? invoice.invoicedetails.invoicemakername.substring(
																			0,
																			12
																	  )
																	: 'N/A'}
															</td>
															<td className='reports-data-body-table-item-body-row-item'>
																{item.itemtaxrate ? item.itemtaxrate : 'N/A'}
															</td>
														</tr>
													)
												)
											)}
										</tbody>
									</table>
								</div>
							</div>
						)}
						{value === 'load' && (
							<div className='data-show-div'>
								<div style={{ margin: '10px' }}>
									<div className='date-div'>
										<label className='date-label'>From:</label>
										<input
											className='date-select'
											type='date'
											value={startDate}
											onChange={handleFromDateSelect}
										/>
										<label className='date-label'>To:</label>
										<input
											className='date-select'
											type='date'
											value={endDate}
											onChange={handleToDateSelect}
										/>
										{/* Button for Date Range */}
										<button
											className='show-date-data-btn'
											onClick={handleShowLoadDataByDate}
										>
											Show
										</button>
									</div>
								</div>
								<div className='reports-data-body'>
									<table className='reports-data-body-table-load'>
										<thead className='reports-data-body-table-load-head'>
											<tr className='reports-data-body-table-load-head-row'>
												<th className='reports-data-body-table-load-head-row-item'>
													Invoice No
												</th>
												<th className='reports-data-body-table-load-head-row-item'>
													Date
												</th>
												<th className='reports-data-body-table-load-head-row-item'>
													Transportation Cost
												</th>
												<th className='reports-data-body-table-load-head-row-item'>
													Company Name
												</th>
												<th className='reports-data-body-table-load-head-row-item'>
													No of Items
												</th>
											</tr>
										</thead>
										<tbody className='reports-data-body-table-load-body'>
											{displayedInvoiceSearch.map((invoice) => (
												<tr
													key={invoice._id}
													className='reports-data-body-table-load-body-row'
												>
													<td className='reports-data-body-table-load-body-row-item'>
														{invoice.invoicedetails &&
														invoice.invoicedetails.invoiceno
															? invoice.invoicedetails.invoiceno.substring(
																	0,
																	12
															  )
															: 'N/A'}
													</td>
													<td className='reports-data-body-table-load-body-row-item'>
														{invoice.invoicedetails &&
														invoice.invoicedetails.invoicedate
															? new Date(
																	invoice.invoicedetails.invoicedate
															  ).toLocaleDateString('en-GB', {
																	day: '2-digit',
																	month: '2-digit',
																	year: 'numeric',
															  })
															: 'N/A'}
													</td>
													<td className='reports-data-body-table-load-body-row-item'>
														{invoice.loadingdetails && invoice.loadingdetails.transportationcost
														? invoice.loadingdetails.transportationcost
															: 'N/A'}
													</td> 
													<td className='reports-data-body-table-load-body-row-item'>
														{invoice.companydetails &&
														invoice.companydetails.companyname
															? invoice.companydetails.companyname
															: 'N/A'}
													</td>
													<td className='reports-data-body-table-load-body-row-item'>
														{invoice.consignmentdetails &&
														invoice.consignmentdetails.itemdetails &&
														invoice.consignmentdetails.itemdetails.length
															? invoice.consignmentdetails.itemdetails.length
															: 'N/A'}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}
						{value === 'day' && (
							<div className='data-show-div'>
								<div style={{ margin: '10px' }}>
									<div className='date-div'>
										<label className='date-label'>From:</label>
										<input
											className='date-select'
											type='date'
											value={startDate}
											onChange={handleFromDateSelect}
										/>
										<label className='date-label'>To:</label>
										<input
											className='date-select'
											type='date'
											value={endDate}
											onChange={handleToDateSelect}
										/>
										{/* Button for Date Range */}
										<button
											className='show-date-data-btn'
											onClick={handleShowDayDataByDate}
										>
											Show
										</button>
									</div>
								</div>
								<div className='reports-data-body'>
									<table className='reports-data-body-table-day'>
										<thead className='reports-data-body-table-day-head'>
											<tr className='reports-data-body-table-day-head-row'>
												<th className='reports-data-body-table-day-head-row-item'>
													Created Date
												</th>
												<th className='reports-data-body-table-day-head-row-item'>
													Invoice no
												</th>
												<th className='reports-data-body-table-day-head-row-item'>
													Invoice Date
												</th>
												 <th className='reports-data-body-table-day-head-row-item'>
													Transportaion Cost
												</th>
												<th className='reports-data-body-table-day-head-row-item'>
													Loading Date
												</th>
											</tr>
										</thead>
										<tbody className='reports-data-body-table-day-body'>
											{displayedInvoiceSearch.map((invoice) => (
												<tr
													key={invoice._id}
													className='reports-data-body-table-day-body-row'
												>
													<td className='reports-data-body-table-day-body-row-item'>
														{invoice.invoicedetails.invoicecreatedate
															? new Date(
																	invoice.invoicedetails.invoicecreatedate
															  ).toLocaleDateString('en-GB', {
																	day: '2-digit',
																	month: '2-digit',
																	year: 'numeric',
															  })
															: 'N/A'}
													</td>
													<td className='reports-data-body-table-day-body-row-item'>
														{invoice.invoicedetails &&
														invoice.invoicedetails.invoiceno
															? invoice.invoicedetails.invoiceno.substring(
																	0,
																	12
															  )
															: 'N/A'}
													</td>
													<td className='reports-data-body-table-day-body-row-item'>
														{invoice.invoicedetails.invoicedate
															? new Date(
																	invoice.invoicedetails.invoicedate
															  ).toLocaleDateString('en-GB', {
																	day: '2-digit',
																	month: '2-digit',
																	year: 'numeric',
															  })
															: 'N/A'}
													</td>
													 <td className='reports-data-body-table-day-body-row-item'>
														{invoice.loadingdetails.transportationcost
															? invoice.loadingdetails.transportationcost
															: 'N/A'}
													</td>
													<td className='reports-data-body-table-day-body-row-item'>
														{invoice.boardingdetails.dateofloading
															? new Date(
																	invoice.boardingdetails.dateofloading
															  ).toLocaleDateString('en-GB', {
																	day: '2-digit',
																	month: '2-digit',
																	year: 'numeric',
															  })
															: 'N/A'}
													</td> 
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}
						{value === 'item' && (
							<div className='data-show-div'>
								<div style={{ margin: '10px' }}>
									<div className='date-div'>
										<label className='date-label'>From:</label>
										<input
											className='date-select'
											type='date'
											value={startDate}
											onChange={handleFromDateSelect}
										/>
										<label className='date-label'>To:</label>
										<input
											className='date-select'
											type='date'
											value={endDate}
											onChange={handleToDateSelect}
										/>
										{/* Button for Date Range */}
										<button
											className='show-date-data-btn'
											onClick={handleShowItemDataByDate}
										>
											Show
										</button>
									</div>
								</div>
								<div className='reports-data-body'>
									<table className='reports-data-body-table-item'>
										<thead className='reports-data-body-table-item-head'>
											<tr className='reports-data-body-table-item-head-row'>
												<th className='reports-data-body-table-day-head-row-item'>
													Date
												</th>
												<th className='reports-data-body-table-item-head-row-item'>
													Invoice No
												</th>
												<th className='reports-data-body-table-item-head-row-item'>
													Item Name
												</th>
												<th className='reports-data-body-table-item-head-row-item'>
													Item Amount
												</th>
												<th className='reports-data-body-table-item-head-row-item'>
													Item Tax
												</th>
												<th className='reports-data-body-table-item-head-row-item'>
													Item Quantity
												</th>
											</tr>
										</thead>
										<tbody className='reports-data-body-table-item-body'>
											{displayedInvoiceSearch.map((invoice) =>
												invoice.consignmentdetails.itemdetails.map(
													(item, index) => (
														<tr
															key={index}
															className='reports-data-body-table-item-body-row'
														>
															<td className='reports-data-body-table-day-body-row-item'>
																{invoice.invoicedetails.invoicedate
																	? new Date(
																			invoice.invoicedetails.invoicedate
																	  ).toLocaleDateString('en-GB', {
																			day: '2-digit',
																			month: '2-digit',
																			year: 'numeric',
																	  })
																	: 'N/A'}
															</td>
															<td className='reports-data-body-table-load-body-row-item'>
																{invoice.invoicedetails &&
																invoice.invoicedetails.invoiceno
																	? invoice.invoicedetails.invoiceno.substring(
																			0,
																			12
																	  )
																	: 'N/A'}
															</td>
															<td className='reports-data-body-table-item-body-row-item'>
																{item.itemname ? item.itemname : 'N/A'}
															</td>
															<td className='reports-data-body-table-item-body-row-item'>
																{item.itemprice ? item.itemprice : 'N/A'}
															</td>
															<td className='reports-data-body-table-item-body-row-item'>
																{item.itemtaxrate ? item.itemtaxrate : 'N/A'}
															</td>
															<td className='reports-data-body-table-item-body-row-item'>
																{item.itemquantity ? item.itemquantity : 'N/A'}
															</td>
														</tr>
													)
												)
											)}
										</tbody>
									</table>
								</div>
							</div>
						)}
						{value === 'vechicle' && (
							<div className='data-show-div'>
								<div style={{ margin: '10px' }}>
									<div className='date-div'>
										<label className='date-label'>From:</label>
										<input
											className='date-select'
											type='date'
											value={startDate}
											onChange={handleFromDateSelect}
										/>
										<label className='date-label'>To:</label>
										<input
											className='date-select'
											type='date'
											value={endDate}
											onChange={handleToDateSelect}
										/>
										{/* Button for Date Range */}
										<button
											className='show-date-data-btn'
											onClick={handleShowVehicleDataByDate}
										>
											Show
										</button>
									</div>
								</div>
								<div className='reports-data-body'>
									<table className='reports-data-body-table-vechicle'>
										<thead className='reports-data-body-table-vechicle-head'>
											<tr className='reports-data-body-table-vechicle-head-row'>
												<th className='reports-data-body-table-day-head-row-item'>
													Vehicle No
												</th>
												<th className='reports-data-body-table-item-head-row-item'>
													Invoice Date
												</th>
												<th className='reports-data-body-table-vechicle-head-row-item'>
													Invoice No
												</th>
												<th className='reports-data-body-table-vechicle-head-row-item'>
													Transportation Cost
												</th>
												<th className='reports-data-body-table-vechicle-head-row-item'>
													Driver Number
												</th>
												<th className='reports-data-body-table-vechicle-head-row-item'>
													Vehicle Model
												</th> 
											</tr>
										</thead>

										<tbody className='reports-data-body-table-vechicle-body'>
											{displayedInvoiceSearch.map((invoice) => (
												<tr
													key={invoice._id}
													className='reports-data-body-table-vechicle-body-row'
												>
													<td className='reports-data-body-table-load-body-row-item'>
														{invoice.vehicledetails.vechiclenumber &&
														invoice.vehicledetails.vechiclenumber
															? invoice.vehicledetails.vechiclenumber
															: 'N/A'}
													</td>

													<td className='reports-data-body-table-day-body-row-item'>
														{invoice.invoicedetails.invoicedate
															? new Date(
																	invoice.invoicedetails.invoicedate
															  ).toLocaleDateString('en-GB', {
																	day: '2-digit',
																	month: '2-digit',
																	year: 'numeric',
															  })
															: 'N/A'}
													</td>
													<td className='reports-data-body-table-load-body-row-item'>
														{invoice.invoicedetails &&
														invoice.invoicedetails.invoiceno
															? invoice.invoicedetails.invoiceno.substring(
																	0,
																	12
															  )
															: 'N/A'}
													</td>
													<td className='reports-data-body-table-day-body-row-item'>
														{invoice.loadingdetails.transportationcost
															? invoice.loadingdetails.transportationcost
															: 'N/A'}
													</td>
													<td className='reports-data-body-table-load-body-row-item'>
														{invoice.vehicledetails.drivernumber &&
														invoice.vehicledetails.drivernumber
															? invoice.vehicledetails.drivernumber
															: 'N/A'}
													</td>
													<td className='reports-data-body-table-load-body-row-item'>
														{invoice.vehicledetails.vechiclemodel &&
														invoice.vehicledetails.vechiclemodel
															? invoice.vehicledetails.vechiclemodel
															: 'N/A'}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}
						{value === 'driver' && (
							<div className='data-show-div'>
								<div style={{ margin: '10px' }}>
									<div className='date-div'>
										<label className='date-label'>From:</label>
										<input
											className='date-select'
											type='date'
											value={startDate}
											onChange={handleFromDateSelect}
										/>
										<label className='date-label'>To:</label>
										<input
											className='date-select'
											type='date'
											value={endDate}
											onChange={handleToDateSelect}
										/>
										{/* Button for Date Range */}
										<button
											className='show-date-data-btn'
											onClick={handleShowDriverDataByDate}
										>
											Show
										</button>
									</div>
								</div>
								<div className='reports-data-body'>
									<table className='reports-data-body-table-driver'>
										<thead className='reports-data-body-table-driver-head'>
											<tr className='reports-data-body-table-driver-head-row'>
											<th className='reports-data-body-table-driver-head-row-item'>
													Driver Number
												</th>
												<th className='reports-data-body-table-driver-head-row-item'>
													Vehicle No
												</th>
												<th className='reports-data-body-table-driver-head-row-item'>
													Invoice No
												</th>
												<th className='reports-data-body-table-day-head-row-item'>
													Date
												</th>
												<th className='reports-data-body-table-driver-head-row-item'>
													Transportaion Cost
												</th>
												<th className='reports-data-body-table-driver-head-row-item'>
													Vehicle Model
												</th>
												<th className='reports-data-body-table-driver-head-row-item'>
													No of Items
												</th>
											</tr>
										</thead>
										<tbody className='reports-data-body-table-driver-body'>
											{displayedInvoiceSearch.map((invoice) => (
												<tr
													key={invoice._id}
													className='reports-data-body-table-driver-body-row'
												>
													<td className='reports-data-body-table-load-body-row-item'>
														{invoice.vehicledetails.drivernumber &&
														invoice.vehicledetails.drivernumber
															? invoice.vehicledetails.drivernumber
															: 'N/A'}
													</td>
													<td className='reports-data-body-table-load-body-row-item'>
														{invoice.vehicledetails.vechiclenumber &&
														invoice.vehicledetails.vechiclenumber
															? invoice.vehicledetails.vechiclenumber
															: 'N/A'}
													</td>
													<td className='reports-data-body-table-load-body-row-item'>
														{invoice.invoicedetails &&
														invoice.invoicedetails.invoiceno
															? invoice.invoicedetails.invoiceno.substring(
																	0,
																	12
															  )
															: 'N/A'}
													</td>
													<td className='reports-data-body-table-day-body-row-item'>
														{invoice.invoicedetails.invoicedate
															? new Date(
																	invoice.invoicedetails.invoicedate
															  ).toLocaleDateString('en-GB', {
																	day: '2-digit',
																	month: '2-digit',
																	year: 'numeric',
															  })
															: 'N/A'}
													</td>
													
													<td className='reports-data-body-table-day-body-row-item'>
														{invoice.loadingdetails.transportationcost
															? invoice.loadingdetails.transportationcost
															: 'N/A'}
													</td>
													
													<td className='reports-data-body-table-load-body-row-item'>
														{invoice.vehicledetails.vechiclemodel &&
														invoice.vehicledetails.vechiclemodel
															? invoice.vehicledetails.vechiclemodel
															: 'N/A'}
													</td>
													<td className='reports-data-body-table-load-body-row-item'>
														{invoice.consignmentdetails &&
														invoice.consignmentdetails.itemdetails &&
														invoice.consignmentdetails.itemdetails.length
															? invoice.consignmentdetails.itemdetails.length
															: 'N/A'}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}
						{value === 'agent' && (
							<div className='data-show-div'>
								<div style={{ margin: '10px' }} className='agent-div'>
									{/* Select Input */}
									<div className='agent-in-div'>
										<select
											className='select-agent-input'
											onChange={handleSelectChange}
											defaultValue='' // Use defaultValue to set the default value
										>
											<option value='' disabled>
												Select Agent
											</option>
											{distinctCompanyNames.map((option) => (
												<option key={option} value={option}>
													{option}
												</option>
											))}
										</select>
										<div>
											<label className='date-label'>From:</label>
											<input
												className='date-agent-select'
												type='date'
												value={startDate}
												onChange={handleFromDateSelect}
											/>
										</div>
										<div>
											<label className='date-label'>To:</label>
											<input
												className='date-agent-select'
												type='date'
												value={endDate}
												onChange={handleToDateSelect}
											/>
										</div>
									</div>
									{/* Button */}
									<div>
										<button
											className='show-agent-data-btn'
											onClick={handleShowButtonClick}
										>
											Show
										</button>
									</div>
								</div>

								<div className='reports-data-body-agent'>
									<table className='reports-data-body-table-driver'>
										{/* Table header */}
										<thead className='reports-data-body-table-driver-head'>
											<tr className='reports-data-body-table-driver-head-row'>
												<th className='reports-data-body-table-driver-head-row-item'>
													Date
												</th>
												<th className='reports-data-body-table-driver-head-row-item'>
													Invoice No
												</th>
												<th className='reports-data-body-table-driver-head-row-item'>
													Agent Company Name
												</th>
												<th className='reports-data-body-table-driver-head-row-item'>
													Item Quantity
												</th>
												<th className='reports-data-body-table-driver-head-row-item'>
													Agent Company State Name
												</th>
											</tr>
										</thead>
										{/* Table body */}
										<tbody className='reports-data-body-table-driver-body'>
											{displayedInvoiceSearch.map((invoice) => (
												<tr
													key={invoice._id}
													className='reports-data-body-table-driver-body-row'
												>
													<td className='reports-data-body-table-driver-body-row-item'>
														{invoice.invoicedetails?.invoicedate
															? new Date(
																	invoice.invoicedetails.invoicedate
															  ).toLocaleDateString()
															: 'N/A'}
													</td>
													<td className='reports-data-body-table-load-body-row-item'>
														{invoice.invoicedetails &&
														invoice.invoicedetails.invoiceno
															? invoice.invoicedetails.invoiceno.substring(
																	0,
																	12
															  )
															: 'N/A'}
													</td>
													<td className='reports-data-body-table-driver-body-row-item'>
														{invoice.sellerdetails.sellercompanyname?.substring(
															0,
															12
														) ?? 'N/A'}
													</td>
													<td className='reports-data-body-table-driver-body-row-item'>
														{invoice.consignmentdetails.itemdetails[0]
															?.itemquantity ?? 'N/A'}
													</td>
													<td className='reports-data-body-table-driver-body-row-item'>
														{invoice.sellerdetails.sellercompanystatename?.substring(
															0,
															12
														) ?? 'N/A'}
													</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>
							</div>
						)}
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
				</div>
			</div>
		</div>
	);
}

export default StaffReports;
