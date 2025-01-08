import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
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
import { VendorPage } from './pages/Vendor/vendorPage';
import { VendorInfo } from './pages/Vendor/VendorInfo';
import { TransactionPage } from './pages/Transaction/TransactionPage';
import { DeliveryPage } from './pages/Delivery/DeliveryPage';
import { DeliveryDetail } from './pages/Delivery/DeliveryDetails';
import { VehicleManagementPage } from './pages/Vehicle/VehicleManagementPage';
import { ChatManagementPage } from './pages/Chat/ChatManagementPage';
import { RolesPermissionsPage } from './pages/Roles/RolesAndPermissionPage';
import { SettingsPageLayout } from './pages/Settings/SettingsPage';
import { AboutUs } from './components/_SettingsComponents/TabsComponent/AboutUs';
import { Terms } from './components/_SettingsComponents/TabsComponent/Terms';
import { PrivacyPolicy } from './components/_SettingsComponents/TabsComponent/PrivacyPolicy';
import { DeliveryAndReturnPolicy } from './components/_SettingsComponents/TabsComponent/DeliveryPolicy';
import FAQ from './components/_SettingsComponents/TabsComponent/FAQ';
import Newsletter from './components/_SettingsComponents/TabsComponent/Newsletter';
import CreateNewsletter from './components/_SettingsComponents/CreateNewsletter';


function App() {
    return(
        <BrowserRouter>
            <Routes>
                <Route path='/signup' element={<Signup /> } />        
                <Route path='/signin' element={<LoginPage />} />
                <Route path='/forgot-password' element={<ForgotPassword />} />
                <Route path='/reset-password' element={<ResetPassword />} />
                <Route path='/reset-password/success' element={<ResetPasswordSuccess />} />
                <Route path='/reset-password-otp' element={<ResetPasswordOtp />} />
                <Route path='/signup/success' element={<SignUpSuccess />} />
                <Route path='/signup/complete' element={<SignupComplete />} />
                <Route path='/signup-otp' element={<SignUpOTP/>} />
                <Route path='/' element={<HomePage />} />
                <Route path='/customers' element={<CustomerPage />} />
                <Route path='/customers/:id' element={<CustomerInfo/>} />
                <Route path='/riders' element={<RiderPage />} />
                <Route path='/riders/:id' element={<RiderInfo/>} />
                <Route path='/vendors' element={<VendorPage />} />
                <Route path='/vendors/:id' element={<VendorInfo />} />
                {/* <Route path='/delivery' element={<DeliveryPage />} /> */}
                <Route path='/deliveries' element={<DeliveryPage />} />
                <Route path='/deliveries/:id' element={<DeliveryDetail />} />
                <Route path='/wallet' element={<Wallet />} />
                <Route path='/profile' element={<Profile />} />
                <Route path='/notification' element={<Notification />} />
                {/* <Route path='/settings' element={<SettingsPage />} /> */}
                <Route path='/rider' element={<VehicleAndRider />} />
                <Route path='/transaction' element={<TransactionPage />} />
                <Route path='/vehicle' element={<VehicleManagementPage />} />
                <Route path='/chat' element={<ChatManagementPage />} />
                <Route path='/admin-roles' element={<RolesPermissionsPage />} />
                <Route path="/settings" element={<SettingsPageLayout />}>
                    <Route index element={<Navigate to="/settings/about-us" replace />} />
                    <Route path="about-us" element={<AboutUs />} />
                    <Route path="terms" element={<Terms />} />
                    <Route path="privacy" element={<PrivacyPolicy />} />
                    <Route path="delivery" element={<DeliveryAndReturnPolicy />} />
                    <Route path="faq" element={<FAQ />} />
                    <Route path="newsletter" element={<Newsletter />} /> 
                </Route>
                <Route path="/settings/newsletter/create" element={<CreateNewsletter />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
