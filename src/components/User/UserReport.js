import React, { useEffect, useState } from "react";
import './UserReport.css';
import background from '../images/Desktop.png';
import axios from "axios";
import ReactPaginate from 'react-paginate';
import { CSVLink } from 'react-csv';
import UserNavbar from "./UserNavbar";

function UserReports() {
    const [invoice,setInvoice] = useState([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [searchInput, setSearchInput] = useState('');
    const [value, setValue] = useState('');
    const [exportedData, setExportedData] = useState([]);

    const API = process.env.REACT_APP_API;
    const changeTable = (newValue) => {
        setValue(newValue);
    }
    const itemsPerPage = 15;
    const sortedInvoice = [...invoice].reverse();
    const displayedInvoiceSearch = sortedInvoice
  .filter((item) => {
    const invoiceNo = item.invoicedetails.invoiceno || '';
    const companyName = item.companydetails.companyname || '';
    const invoiceDate = item.invoicedetails.invoicedate || '';
    const vehicleNumber = item.vehicledetails.vehiclenumber || '';
    const driverName = item.vehicledetails.drivername || '';
    const itemName =
      (item.consignmentdetails.itemdetails[0] && item.consignmentdetails.itemdetails[0].itemname) || '';

    // Check if any of the search criteria is null or cannot be converted to lowercase
    if (
      invoiceNo.toLowerCase().includes(searchInput?.toLowerCase()) ||
      companyName.toLowerCase().includes(searchInput?.toLowerCase()) ||
      invoiceDate.toLowerCase().includes(searchInput?.toLowerCase()) ||
      vehicleNumber.toLowerCase().includes(searchInput?.toLowerCase()) ||
      driverName.toLowerCase().includes(searchInput?.toLowerCase()) ||
      itemName.toLowerCase().includes(searchInput?.toLowerCase())
    ) {
      return true;
    }

    return false;
  })
  .slice(pageNumber * itemsPerPage, (pageNumber + 1) * itemsPerPage);

    const pageCount = Math.ceil(sortedInvoice.length / itemsPerPage);
    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };

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
    const exportLoadReport = () => {
        setExportedData(sortedInvoice.map((invoice) => ({
            'Invoice No': invoice.invoicedetails.invoiceno,
            'Date': invoice.invoicedetails.invoicedate,
            'Total Cost': invoice.boardingdetails.totalcost,
            'Company Name': invoice.companydetails.companyname,
            'No of Items': invoice.consignmentdetails.itemdetails.length,
        })));
    };
    
    const exportDayWiseReport = () => {
        setExportedData(displayedInvoiceSearch.map((invoice) => ({
            'Date': invoice.invoicedetails.invoicedate,
            'Invoice no': invoice.invoicedetails.invoiceno,
            'Order Date': invoice.invoicedetails.ordereddate,
            'Total Cost': invoice.boardingdetails.totalcost,
            'Delivery Note Date': invoice.invoicedetails.deliverynotedate,
        })));
    };
    
    const exportItemWiseReport = () => {
        setExportedData(displayedInvoiceSearch.flatMap((invoice) =>
            invoice.consignmentdetails.itemdetails.map((item) => ({
                'Item Name': item.itemname,
                'Item Amount': item.itemprice,
                'Item Tax': item.itemtaxrate,
                'Item Quantity': item.itemquantity,
                'Invoice No': invoice.invoicedetails.invoiceno,
            }))
        ));
    };
    
    const exportVehicleWiseReport = () => {
        setExportedData(displayedInvoiceSearch.map((invoice) => ({
            'Vehicle': invoice.vehicledetails.vehiclenumber,
            'Transportation Cost': invoice.boardingdetails.transportationcost,
            'Total Cost': invoice.boardingdetails.totalcost,
            'Driver': invoice.vehicledetails.drivername,
            'Weight': invoice.boardingdetails.weight,
        })));
    };
    
    const exportDriverWiseReport = () => {
        setExportedData(displayedInvoiceSearch.map((invoice) => ({
            'Driver': invoice.vehicledetails.drivername,
            'Vehicle': invoice.vehicledetails.vehiclenumber,
            'Invoice No': invoice.invoicedetails.invoiceno,
            'Total Cost': invoice.boardingdetails.totalcost,
            'Driver License No': invoice.vehicledetails.driverlicenseno,
        })));
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
            <div className="reports">
                <div className="reports-data">
                    <div className="reports-data-header">
                    <button className="reports-data-header-button start" value="load" onClick={() => { changeTable('load'); exportLoadReport(); }}>
                            Load Report
                        </button>
                        <button className="reports-data-header-button" value="day" onClick={() =>{ changeTable('day'); exportDayWiseReport(); }}>Day Wise Report</button>
                        <button className="reports-data-header-button" value="item" onClick={() =>{ changeTable('item'); exportItemWiseReport();}}>Item Wise Report</button>
                        <button className="reports-data-header-button" value="vechicle" onClick={() =>{ changeTable('vechicle'); exportVehicleWiseReport();}}>Vehicle Wise Report</button>
                        <button className="reports-data-header-button end" value="driver" onClick={() =>{ changeTable('driver'); exportDriverWiseReport();}}>Driver Wise Report</button>
                    </div>
                    <div className="reports-data-top">
                    <div className="reports-data-search">
                    <input
                            type='text'
                            placeholder='Search Invoice...'
                            className='reports-search-input'
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                    </div>
                        
                        <CSVLink
                            data={exportedData}
                            filename={`exported_data_${new Date().toISOString()}.csv`}
                            className="export-button"
                            target="_blank"
                        >
                            Export
                        </CSVLink>
                        
                    
                    </div>
                    <div className="reports-data-body-container">
                    {value === 'load' && (
                        <div className="reports-data-body">
                            <table className="reports-data-body-table-load">
                                <thead className="reports-data-body-table-load-head">
                                    <tr className="reports-data-body-table-load-head-row">
                                        <th className="reports-data-body-table-load-head-row-item">Invoice No</th>
                                        <th className="reports-data-body-table-load-head-row-item">Date</th>
                                        <th className="reports-data-body-table-load-head-row-item">Total Cost</th>
                                        <th className="reports-data-body-table-load-head-row-item">Company Name</th>
                                        <th className="reports-data-body-table-load-head-row-item">No of Items</th>
                                    </tr>
                                </thead>
                                <tbody className="reports-data-body-table-load-body">
                                    { displayedInvoiceSearch.map((invoice) => (
                                    <tr key={invoice._id} className="reports-data-body-table-load-body-row">
                                        <td className="reports-data-body-table-load-body-row-item">{invoice.invoicedetails.invoiceno}</td>
                                        <td className="reports-data-body-table-load-body-row-item">{invoice.invoicedetails.invoicedate ?
    new Date(invoice.invoicedetails.invoicedate).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }) : 'N/A'}</td>
                                        <td className="reports-data-body-table-load-body-row-item">{invoice.boardingdetails.totalcost}</td>
                                        <td className="reports-data-body-table-load-body-row-item">{invoice.companydetails.companyname}</td>
                                        <td className="reports-data-body-table-load-body-row-item">{invoice.consignmentdetails.itemdetails.length}</td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {value === 'day' && (
                        <div className="reports-data-body">
                            <table className="reports-data-body-table-day">
                                <thead className="reports-data-body-table-day-head">
                                    <tr className="reports-data-body-table-day-head-row">
                                        <th className="reports-data-body-table-day-head-row-item">Date</th>
                                        <th className="reports-data-body-table-day-head-row-item">Invoice no</th>
                                        <th className="reports-data-body-table-day-head-row-item">Order Date</th>
                                        <th className="reports-data-body-table-day-head-row-item">Total Cost</th>
                                        <th className="reports-data-body-table-day-head-row-item">Delivery Note Date</th>
                                    </tr>
                                </thead>
                                <tbody className="reports-data-body-table-day-body">
                                    {displayedInvoiceSearch.map((invoice) => (
                                        <tr key={invoice._id} className="reports-data-body-table-day-body-row">
                                        <td className="reports-data-body-table-day-body-row-item">{invoice.invoicedetails.invoicedate ?
    new Date(invoice.invoicedetails.invoicedate).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }) : 'N/A'}</td>
                                        <td className="reports-data-body-table-day-body-row-item">{invoice.invoicedetails.invoiceno}</td>
                                        <td className="reports-data-body-table-day-body-row-item">{invoice.invoicedetails.ordereddate ?
    new Date(invoice.invoicedetails.ordereddate).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }) : 'N/A'}</td>
                                        <td className="reports-data-body-table-day-body-row-item">{invoice.boardingdetails.totalcost}</td>
                                        <td className="reports-data-body-table-day-body-row-item">
                                        {invoice.invoicedetails.deliverynotedate ?
    new Date(invoice.invoicedetails.deliverynotedate).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }) : 'N/A'}
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {value === 'item' && (
                        <div className="reports-data-body">
                            <table className="reports-data-body-table-item">
                                <thead className="reports-data-body-table-item-head">
                                    <tr className="reports-data-body-table-item-head-row">
                                        <th className="reports-data-body-table-item-head-row-item">Item Name</th>
                                        <th className="reports-data-body-table-item-head-row-item">Item Amount</th>
                                        <th className="reports-data-body-table-item-head-row-item">Item Tax</th>
                                        <th className="reports-data-body-table-item-head-row-item">Item Quantity</th>
                                        <th className="reports-data-body-table-item-head-row-item">Invoice No</th>
                                    </tr>
                                </thead>
                                <tbody className="reports-data-body-table-item-body">
                                {displayedInvoiceSearch.map((invoice) =>
                                            invoice.consignmentdetails.itemdetails.map((item, index) => (
                                                <tr key={index} className="reports-data-body-table-item-body-row">
                                                <td className="reports-data-body-table-item-body-row-item">{item.itemname}</td>
                                                <td className="reports-data-body-table-item-body-row-item">{item.itemprice}</td>
                                                <td className="reports-data-body-table-item-body-row-item">{item.itemtaxrate}</td>
                                                <td className="reports-data-body-table-item-body-row-item">{item.itemquantity}</td>
                                                <td className="reports-data-body-table-item-body-row-item">{invoice.invoicedetails.invoiceno}</td>
                                                </tr>
                                            ))
                                            )}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {value === 'vechicle' && (
                        <div className="reports-data-body">
                            <table className="reports-data-body-table-vechicle">
                                <thead className="reports-data-body-table-vechicle-head">
                                    <tr className="reports-data-body-table-vechicle-head-row">
                                        <th className="reports-data-body-table-vechicle-head-row-item">Vehicle</th>
                                        <th className="reports-data-body-table-vechicle-head-row-item">Transportation Cost</th>
                                        <th className="reports-data-body-table-vechicle-head-row-item">Total Cost</th>
                                        <th className="reports-data-body-table-vechicle-head-row-item">Driver</th>
                                        <th className="reports-data-body-table-vechicle-head-row-item">weight</th>
                                    </tr>
                                </thead>
                                
                                <tbody className="reports-data-body-table-vechicle-body">
                                    { displayedInvoiceSearch.map((invoice) => (
                                    <tr key={invoice._id} className="reports-data-body-table-vechicle-body-row">
                                        <td className="reports-data-body-table-vechicle-body-row-item">{invoice.vehicledetails.vehiclenumber}</td>
                                        <td className="reports-data-body-table-vechicle-body-row-item">{invoice.boardingdetails.transportationcost}</td>
                                        <td className="reports-data-body-table-vechicle-body-row-item">{invoice.boardingdetails.totalcost}</td>
                                        <td className="reports-data-body-table-vechicle-body-row-item">{invoice.vehicledetails.drivername}</td>
                                        <td className="reports-data-body-table-vechicle-body-row-item">{invoice.boardingdetails.weight}</td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                           
                        </div>
                    )}
                    {value === 'driver' && (
                        <div className="reports-data-body">
                            <table className="reports-data-body-table-driver">
                                <thead className="reports-data-body-table-driver-head">
                                    <tr className="reports-data-body-table-driver-head-row">
                                        <th className="reports-data-body-table-driver-head-row-item">Driver</th>
                                        <th className="reports-data-body-table-driver-head-row-item">Vechicle</th>
                                        <th className="reports-data-body-table-driver-head-row-item">Invoice No</th>
                                        <th className="reports-data-body-table-driver-head-row-item">Total Cost</th>
                                        <th className="reports-data-body-table-driver-head-row-item">Driver License No</th>
                                    </tr>
                                    
                                </thead>
                                <tbody className="reports-data-body-table-driver-body">
                                { displayedInvoiceSearch.map((invoice) => (
                                    <tr key={invoice._id} className="reports-data-body-table-driver-body-row">
                                        <td className="reports-data-body-table-driver-body-row-item">{invoice.vehicledetails.drivername}</td>
                                        <td className="reports-data-body-table-driver-body-row-item">{invoice.vehicledetails.vehiclenumber}</td>
                                        <td className="reports-data-body-table-driver-body-row-item">{invoice.invoicedetails.invoiceno}</td>
                                        <td className="reports-data-body-table-driver-body-row-item">{invoice.boardingdetails.totalcost}</td>
                                        <td className="reports-data-body-table-driver-body-row-item">{invoice.vehicledetails.driverlicenseno}</td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                <ReactPaginate
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
                        />
                </div>
            </div>
        </div>
    );
}

export default UserReports;