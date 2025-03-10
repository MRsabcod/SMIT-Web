import React from 'react';
import AppRouter from './config/router';
import useScrollReveal from './ScrollReveal/useScrollReveal';
import useGetAllCourses from './hooks/useGetAllCourses';
import { useSelector } from 'react-redux';
import Loading from './Components/Loading';

function App() {
  const { loading } = useSelector(state => state.courses);

  useGetAllCourses();
  useScrollReveal();

  return (
    <div className='light:bg-[#ffffffab]'>
      {
        loading ? <Loading /> : <AppRouter />
      }
    </div>
  )
}

export default App;