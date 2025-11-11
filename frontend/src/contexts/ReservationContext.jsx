import React, { createContext, useContext, useReducer } from 'react';

const ReservationContext = createContext();

const reservationReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SELECTED_ROOM':
      return {
        ...state,
        selectedRoom: action.payload
      };
    case 'SET_DATES':
      return {
        ...state,
        checkIn: action.payload.checkIn,
        checkOut: action.payload.checkOut
      };
    case 'SET_GUEST_INFO':
      return {
        ...state,
        guestInfo: action.payload
      };
    case 'CLEAR_RESERVATION':
      return {
        selectedRoom: null,
        checkIn: null,
        checkOut: null,
        guestInfo: null
      };
    default:
      return state;
  }
};

const initialState = {
  selectedRoom: null,
  checkIn: null,
  checkOut: null,
  guestInfo: null
};

export const ReservationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reservationReducer, initialState);

  const setSelectedRoom = (room) => {
    dispatch({ type: 'SET_SELECTED_ROOM', payload: room });
  };

  const setDates = (checkIn, checkOut) => {
    dispatch({ 
      type: 'SET_DATES', 
      payload: { checkIn, checkOut } 
    });
  };

  const setGuestInfo = (guestInfo) => {
    dispatch({ type: 'SET_GUEST_INFO', payload: guestInfo });
  };

  const clearReservation = () => {
    dispatch({ type: 'CLEAR_RESERVATION' });
  };

  return (
    <ReservationContext.Provider value={{
      ...state,
      setSelectedRoom,
      setDates,
      setGuestInfo,
      clearReservation
    }}>
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservation = () => {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error('useReservation must be used within a ReservationProvider');
  }
  return context;
};