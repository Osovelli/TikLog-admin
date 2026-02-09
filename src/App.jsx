import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { LoginPage } from './pages/AuthPages/LoginPage';
import { Signup } from './pages/AuthPages/Signup';
import { ForgotPassword} from './pages/AuthPages/ForgotPassword';
import { ResetPasswordOtp } from './pages/AuthPages/ResetPasswordOtp';
import { ResetPassword } from './pages/AuthPages/ResetPassword';
import { ResetPasswordSuccess } from './pages/AuthPages/ResetPasswordSuccess';
import { SignUpSuccess } from './pages/AuthPages/SignupSuccess';
import { SignUpOTP } from './pages/AuthPages/SignupOtp';
import { SignupComplete } from './pages/AuthPages/SignUpComplete';
import { HomePage } from './pages/HomePage';
import { Wallet } from './pages/WalletPage';
import { Profile } from './pages/Profile';
import { Notification } from './pages/Notification';
import { VehicleAndRider } from './pages/VehicleAndRider';
import { CustomerPage } from './pages/Customer/CustomerPage';
import { CustomerInfo } from './pages/Customer/CustomerInfo';
import { RiderPage } from './pages/Rider/RiderPage';
import { RiderInfo } from './pages/Rider/RiderInfo';
import { VendorPage } from './pages/Vendor/VendorPage';
import { VendorInfo } from './pages/Vendor/VendorInfo';
import { TransactionPage } from './pages/Transaction/TransactionPage';
import { DeliveryPage } from './pages/Delivery/DeliveryPage';
import { DeliveryDetail } from './pages/Delivery/DeliveryDetails';
import { VehicleManagementPage } from './pages/Vehicle/VehicleManagementPage';
import { ChatManagementPage } from './pages/Chat/ChatManagementPage';
import { RolesPermissionsPage } from './pages/Roles/RolesAndPermissionPage';
import { SettingsPageLayout } from './pages/Settings/SettingsPage';
import { AboutUs } from './components/_SettingsComponents/TabsComponent/AboutUs';
import TermsAndConditionSettings from './components/_SettingsComponents/TermsAndConditionSettings';
import { PrivacyPolicy } from './components/_SettingsComponents/TabsComponent/PrivacyPolicy';
import { DeliveryAndReturnPolicy } from './components/_SettingsComponents/TabsComponent/DeliveryPolicy';
import FAQ from './components/_SettingsComponents/TabsComponent/FAQ';
import Newsletter from './components/_SettingsComponents/TabsComponent/Newsletter';
import CreateNewsletter from './components/_SettingsComponents/CreateNewsletter';
import { Toaster } from 'react-hot-toast';
import { RolesPage } from './pages/Roles/RolesPage';
import PageSettings from './components/_SettingsComponents/TabsComponent/PageSettings';
import { Terms } from './components/_SettingsComponents/TabsComponent/Terms';
import { jwtDecode } from 'jwt-decode';
//import useAuthStore from './store/authStore';
//import { useEffect } from 'react';
//import { RedirectAuthenticatedUser } from './lib/hooks/UseAuthRedirect';


function App() { 
  const ProtectedRoute = ({ children }) => {  
      const token = localStorage.getItem('token');
      if (!token) {
          return <Navigate to='/signin' replace />;
      }

      try {
          const decoded = jwtDecode(token);
          // Check if token is expired
          if (decoded.exp * 1000 < Date.now()) {
              localStorage.removeItem('token');
              return <Navigate to='/signin' replace />;
          }
      } catch (e) {
          localStorage.removeItem('token');
          return <Navigate to='/signin' replace />;
      }

      return children;
  };

  const RedirectAuthenticatedUser = ({ children }) => {
    const token = localStorage.getItem('token')
    // (isAuthenticated && user ) {
    if (token) {
      return <Navigate to='/' replace />;
    }
	return children;
};

    return(
        <BrowserRouter>
            <Routes>
                <Route 
                path='/signin' 
                element={
                  <RedirectAuthenticatedUser>
                    <LoginPage />
                  </RedirectAuthenticatedUser>
                  } 
                />
                <Route 
                path='/forgot-password' 
                element={<ForgotPassword />} 
                />
                <Route path='/reset-password' element={<ResetPassword />} />
                <Route path='/reset-password-otp' element={<ResetPasswordOtp />} />
                <Route path='/reset-password/success' element={<ResetPasswordSuccess />} />
                <Route path='/signup' element={<Signup /> } />              
                <Route path='/signup/success' element={<SignUpSuccess />} />
                <Route path='/signup/complete' element={<SignupComplete />} />
                <Route path='/signup-otp' element={<SignUpOTP/>} />

                {/* Protected Routes - Require authentication */}
                <Route 
                path='/' 
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                } />
                <Route 
                path='/customers' 
                element={
                  <ProtectedRoute>
                    <CustomerPage />
                  </ProtectedRoute>
                  } />
                <Route 
                path='/customers/:id' 
                element={
                  <ProtectedRoute>
                    <CustomerInfo/>
                    </ProtectedRoute>
                    } 
                  />
                <Route 
                path='/riders' 
                element={
                  <ProtectedRoute>
                    <RiderPage />
                    </ProtectedRoute>
                    } 
                  />
                <Route 
                path='/riders/:id' 
                element={
                  <ProtectedRoute>
                    <RiderInfo/>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                path='/vendors' 
                element={
                  <ProtectedRoute>
                    <VendorPage />
                  </ProtectedRoute>
                  } 
                  />
                <Route 
                path='/vendors/:id' 
                element={
                  <ProtectedRoute>
                    <VendorInfo />
                    </ProtectedRoute>
                  } 
                />
                {/* <Route path='/delivery' element={<DeliveryPage />} /> */}
                <Route 
                path='/deliveries' 
                element={
                  <ProtectedRoute>
                    <DeliveryPage />
                  </ProtectedRoute>
                } />
                <Route 
                path='/deliveries/:id' 
                element={
                  <ProtectedRoute>
                    <DeliveryDetail />
                  </ProtectedRoute>
                  } 
                />
                {/* <Route 
                path='/wallet' 
                element={
                  <ProtectedRoute>
                    <Wallet />
                  </ProtectedRoute>
                    } 
                  /> */}
                <Route 
                path='/profile' 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                    } 
                  />
                <Route 
                path='/notification' 
                element={
                  <ProtectedRoute>
                    <Notification />
                  </ProtectedRoute>
                  } 
                />
                {/* <Route path='/settings' element={<SettingsPage />} /> */}
                <Route 
                path='/vehicle' 
                element={
                  <ProtectedRoute>
                    <VehicleAndRider />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                path='/transaction' 
                element={
                  <ProtectedRoute>
                    <TransactionPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                path='/vehicle' 
                element={
                  <ProtectedRoute>
                    <VehicleManagementPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                path='/chat' 
                element={
                  <ProtectedRoute>
                    <ChatManagementPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                path='/admin-users' 
                element={
                  <ProtectedRoute>
                    <RolesPermissionsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                path='/roles-management' 
                element={
                  <ProtectedRoute>
                    <RolesPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                path='/terms-and-conditions' 
                element={
                  <ProtectedRoute>
                    <TermsAndConditionSettings />
                  </ProtectedRoute>
                  } 
                />
                <Route 
                path="/settings" 
                element={
                  <ProtectedRoute>
                    <SettingsPageLayout />
                  </ProtectedRoute>
                }>
                    <Route index element={<Navigate to="/settings/about-us" replace />} />
                    <Route path="about-us" element={<AboutUs />} />
                    <Route path="terms" element={<Terms />} />
                    <Route path="privacy" element={<PrivacyPolicy />} />
                    <Route path="delivery" element={<DeliveryAndReturnPolicy />} />
                    <Route path="faq" element={<FAQ />} />
                    <Route path="newsletter" element={<Newsletter />} />
                    <Route path="pages" element={<PageSettings />} /> 
                </Route>
                <Route 
                path="/settings/newsletter/create" 
                element={
                  <ProtectedRoute>
                    <CreateNewsletter />
                  </ProtectedRoute>
                  } 
                />
            </Routes>
             <Toaster />
        </BrowserRouter>
    )
}

export default App
