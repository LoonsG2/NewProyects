import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Layout/Header'
import Footer from './components/Layout/Footer'
import Home from './pages/Home'
import Rooms from './pages/Rooms'
import RoomDetails from './pages/RoomDetails'
import Reservation from './pages/Reservation'
import MyReservations from './pages/MyReservations'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'
import { ReservationProvider } from './contexts/ReservationContext'
import './App.css'

function App() {
  return (
    <ReservationProvider>
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/rooms/:id" element={<RoomDetails />} />
            <Route path="/reservation" element={<Reservation />} />
            <Route path="/my-reservations" element={<MyReservations />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ReservationProvider>
  )
}

export default App