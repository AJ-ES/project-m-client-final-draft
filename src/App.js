import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AdminAuthProvider } from './components/Admin/AdminAuth';
import ReqAdminAuth from './components/Admin/AdminReqAuth';
import AdminLogin from './components/Admin/Adminlogin';
import AdminDashboard from './components/Admin/Admindashboard';
import { StaffAuthProvider } from './components/Staff/StaffAuth';
import ReqStaffAuth from './components/Staff/StaffReqAuth';
import StaffLogin from './components/Staff/Stafflogin';
import StaffDashboardHO from './components/Staff/StaffdashboardHO';
import StaffDashboardGeneral from './components/Staff/StaffdashboardGeneral';
import StaffDashboard from './components/Staff/Staffdashboard';
import { UserAuthProvider } from './components/User/UserAuth';
import ReqUserAuth from './components/User/UserReqAuth';
import UserLogin from './components/User/Userlogin';
import UserDashboard from './components/User/Userdashboard';
import UserDashboardHO from './components/User/UserdashboardHO';
import UserDashboardGeneral from './components/User/UserdashboardGeneral';
import AdminBuyerManage from './components/Admin/AdminBuyerManage';
import AdminSellerManage from './components/Admin/AdminSellerManage';
import AdminCompanyManage from './components/Admin/AdminCompanyManage';
import AdminConsignmentManage from './components/Admin/AdminConsignmnetManage';
import AdminStaffManage from './components/Admin/AdminStaffManage';
import AdminUserManage from './components/Admin/AdminUserManage';
import StaffBuyerManage from './components/Staff/StaffBuyerManage';
import StaffSellerManage from './components/Staff/StaffSellerManage';
import StaffCompanyManage from './components/Staff/StaffCompanyManage';
import StaffConsignmentManage from './components/Staff/StaffConsignmentManage';
import StaffVechicleManage from './components/Staff/StaffVechicleManage';
import UserBuyerManage from './components/User/UserBuyerManage';
import UserSellerManage from './components/User/UserSellerManage';
import UserCompanyManage from './components/User/UserCompanyManage';
import UserConsignmentManage from './components/User/UserConsignmentManage';
import UserVechicleManage from './components/User/UserVechicleManage';
import AdminVechicleManage from './components/Admin/AdminVechicleManage';
import AdminReports from './components/Admin/AdminReport';
import AdminInvoiceManagement from './components/Admin/AdminInvoiceManager';
import AdminCreateInvoice from './components/Admin/AdminCreateInvoice';
import AdminInvoiceDashboard from './components/Admin/AdminInvoiceDashboard';
import StaffReports from './components/Staff/StaffReport';
import StaffCreateInvoice from './components/Staff/StaffCreateInvoice';
import StaffInvoiceManagement from './components/Staff/StaffInvoiceManage';
import StaffInvoiceDashboard from './components/Staff/StaffInvoiceDashboard';
import UserInvoiceDashboard from './components/User/UserInvoiceDashboard';
import UserInvoiceManagement from './components/User/UserInvoiceManage';
import UserReports from './components/User/UserReport';
import UserCreateInvoice from './components/User/UserCreateInvoice';
import PdfViewer from './components/Admin/AdminPdfViewer';
import StaffPdfViewer from './components/Staff/StaffInvoiceView';
import UserPdfViewer from './components/User/UserInvoiceView';
import AdminViewandEditInvoice from './components/Admin/AdminViewandEditInvoice';

function App() {
	return (
		<Router>
			<div>
				{/* Admin Routes */}
				<AdminAuthProvider>
					<Routes>
						<Route path='/in' element={<AdminViewandEditInvoice />} />
						<Route path='/' element={<AdminLogin />} />
						<Route
							path='/admindashboard'
							element={
								<ReqAdminAuth>
									<AdminDashboard />
								</ReqAdminAuth>
							}
						/>
						<Route path='/pdf/:selectedInvoiceId/:timestamp' element={<PdfViewer />} />
						<Route
							path='/admininvdash'
							element={
								<ReqAdminAuth>
									<AdminInvoiceDashboard />
								</ReqAdminAuth>
							}
						/>
						<Route
							path='/adminbuyman'
							element={
								<ReqAdminAuth>
									<AdminBuyerManage />
								</ReqAdminAuth>
							}
						/>
						<Route
							path='/adminsellman'
							element={
								<ReqAdminAuth>
									<AdminSellerManage />
								</ReqAdminAuth>
							}
						/>
						<Route
							path='/admincomman'
							element={
								<ReqAdminAuth>
									<AdminCompanyManage />
								</ReqAdminAuth>
							}
						/>
						<Route
							path='/adminconman'
							element={
								<ReqAdminAuth>
									<AdminConsignmentManage />
								</ReqAdminAuth>
							}
						/>
						<Route
							path='/adminstaffman'
							element={
								<ReqAdminAuth>
									<AdminStaffManage />
								</ReqAdminAuth>
							}
						/>
						<Route
							path='/adminuserman'
							element={
								<ReqAdminAuth>
									<AdminUserManage />
								</ReqAdminAuth>
							}
						/>
						<Route
							path='/adminvecman'
							element={
								<ReqAdminAuth>
									<AdminVechicleManage />
								</ReqAdminAuth>
							}
						/>
						<Route
							path='/admingenrep'
							element={
								<ReqAdminAuth>
									<AdminReports />
								</ReqAdminAuth>
							}
						/>
						<Route
							path='/admininman'
							element={
								<ReqAdminAuth>
									<AdminInvoiceManagement />
								</ReqAdminAuth>
							}
						/>
						<Route
							path='/admincreinv'
							element={
								<ReqAdminAuth>
									<AdminCreateInvoice />
								</ReqAdminAuth>
							}
						/>
						<Route
							path='/admininvview'
							element={
								<ReqAdminAuth>
									<PdfViewer />
								</ReqAdminAuth>
							}
						/>
					</Routes>
				</AdminAuthProvider>

				{/* Staff Routes */}
				<StaffAuthProvider>
					<Routes>
						<Route path='/staff' element={<StaffLogin />} />
						<Route
							path='/staffinvdash'
							element={
								<ReqStaffAuth>
									<StaffInvoiceDashboard />
								</ReqStaffAuth>
							}
						/>
						<Route
							path='/staffsuperdash'
							element={
								<ReqStaffAuth>
									<StaffDashboard />
								</ReqStaffAuth>
							}
						/>
						<Route
							path='/staffhodash'
							element={
								<ReqStaffAuth>
									<StaffDashboardHO />
								</ReqStaffAuth>
							}
						/>
						<Route
							path='/staffgendash'
							element={
								<ReqStaffAuth>
									<StaffDashboardGeneral />
								</ReqStaffAuth>
							}
						/>
						<Route
							path='/staffbuyman'
							element={
								<ReqStaffAuth>
									<StaffBuyerManage />
								</ReqStaffAuth>
							}
						/>
						<Route
							path='/staffcrein'
							element={
								<ReqStaffAuth>
									<StaffCreateInvoice />
								</ReqStaffAuth>
							}
						/>
						<Route
							path='/staffinman'
							element={
								<ReqStaffAuth>
									<StaffInvoiceManagement />
								</ReqStaffAuth>
							}
						/>
						<Route
							path='/staffgenrep'
							element={
								<ReqStaffAuth>
									<StaffReports />
								</ReqStaffAuth>
							}
						/>
						<Route
							path='/staffsellman'
							element={
								<ReqStaffAuth>
									<StaffSellerManage />
								</ReqStaffAuth>
							}
						/>
						<Route
							path='/staffcomman'
							element={
								<ReqStaffAuth>
									<StaffCompanyManage />
								</ReqStaffAuth>
							}
						/>
						<Route
							path='/staffconman'
							element={
								<ReqStaffAuth>
									<StaffConsignmentManage />
								</ReqStaffAuth>
							}
						/>
						<Route
							path='/staffvecman'
							element={
								<ReqStaffAuth>
									<StaffVechicleManage />
								</ReqStaffAuth>
							}
						/>
						<Route
							path='/staffinvview'
							element={
								<ReqStaffAuth>
									<StaffPdfViewer />
								</ReqStaffAuth>
							}
						/>
					</Routes>
				</StaffAuthProvider>

				{/* User Routes */}
				<UserAuthProvider>
					<Routes>
						<Route path='/user' element={<UserLogin />} />
						<Route
							path='/userinvdash'
							element={
								<ReqUserAuth>
									<UserInvoiceDashboard />
								</ReqUserAuth>
							}
						/>
						<Route
							path='/usersuperdash'
							element={
								<ReqUserAuth>
									<UserDashboard />
								</ReqUserAuth>
							}
						/>
						<Route
							path='/userhodash'
							element={
								<ReqUserAuth>
									<UserDashboardHO />
								</ReqUserAuth>
							}
						/>
						<Route
							path='/usergendash'
							element={
								<ReqUserAuth>
									<UserDashboardGeneral />
								</ReqUserAuth>
							}
						/>
						<Route
							path='/userbuyman'
							element={
								<ReqUserAuth>
									<UserBuyerManage />
								</ReqUserAuth>
							}
						/>
						<Route
							path='/usersellman'
							element={
								<ReqUserAuth>
									<UserSellerManage />
								</ReqUserAuth>
							}
						/>
						<Route
							path='/usercomman'
							element={
								<ReqUserAuth>
									<UserCompanyManage />
								</ReqUserAuth>
							}
						/>
						<Route
							path='/userconman'
							element={
								<ReqUserAuth>
									<UserConsignmentManage />
								</ReqUserAuth>
							}
						/>
						<Route
							path='/uservecman'
							element={
								<ReqUserAuth>
									<UserVechicleManage />
								</ReqUserAuth>
							}
						/>
						<Route
							path='/userinman'
							element={
								<ReqUserAuth>
									<UserInvoiceManagement />
								</ReqUserAuth>
							}
						/>
						<Route
							path='/usergenrep'
							element={
								<ReqUserAuth>
									<UserReports />
								</ReqUserAuth>
							}
						/>
						<Route
							path='/usercrein'
							element={
								<ReqUserAuth>
									<UserCreateInvoice />
								</ReqUserAuth>
							}
						/>
						<Route
							path='/userinvview'
							element={
								<ReqUserAuth>
									<UserPdfViewer />
								</ReqUserAuth>
							}
						/>
					</Routes>
				</UserAuthProvider>
			</div>
		</Router>
	);
}

export default App;
