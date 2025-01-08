import React from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { AppLayout } from '@/components/AppLayout'

const routes = [
  { path: '/settings/about-us', label: 'About Us' },
  { path: '/settings/terms', label: 'Terms & Conditions' },
  { path: '/settings/privacy', label: 'Privacy Policy' },
  { path: '/settings/delivery', label: 'Delivery & Return Policy' },
  { path: '/settings/faq', label: 'FAQ' },
  { path: '/settings/newsletter', label: 'Newsletter' },
]

export const SettingsPageLayout = () => {
  const location = useLocation()

  return (
    <AppLayout title="Website Settings">
    <div className="p-6 space-y-6">
      <div className="bg-gray-100 rounded-lg p-1">
        <Swiper
          slidesPerView="auto"
          spaceBetween={8}
          className="!static"
        >
          {routes.map((route) => (
            <SwiperSlide key={route.path} className="!w-auto">
              <Link to={route.path}>
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${
                    location.pathname === route.path
                      ? 'bg-white shadow text-gray-900'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {route.label}
                </button>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <Outlet />
      </div>
    </div>
    </AppLayout>
  )
}