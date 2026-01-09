import { BrowserRouter as Router, Routes , Route, useLocation } from 'react-router-dom';
import './App.css';
import HomePage from './Clients/Screens/HomePage';
import AboutPage from './Clients/Screens/AboutPage';
import PortfolioPage from './Clients/Screens/PortfolioPage';
import PortfolioDetailsPage from './Clients/Screens/PortfolioDetailsPage';
import ContactPage from './Clients/Screens/ContactPage';
import PageNotFound from './Clients/Screens/PageNotFound';
import AdminLoginPage from './Admin/Screens/AdminLoginPage';
import AdminHomePage from './Admin/Screens/AdminHomePage';
import AdminAboutPage from './Admin/Screens/AdminAboutPage';
import AdminPortfolioPage from './Admin/Screens/AdminPortfolioPage';
import AdminContactPage from './Admin/Screens/AdminContactPage';
import AdminSettingPage from './Admin/Screens/AdminSettingPage';
import {
  showloading,
  setVideoBannerData,
  setQuoteData,
  setContactData,
  setServiceData,
  setAboutData,
  setClientData,
  setTeamData,
  setPortfolioData,
  setPortfolioLengthData,
  hiddenloading,
  ReloadData
} from './API/Server/rootSlice'
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { useEffect, useCallback } from 'react';
import {URL} from './Url/Url'
import LoadingPage from './Clients/Screens/LoadingPage';
import MMEPage from './Clients/Screens/MMEPage';

function AppContent() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admindashboard') || location.pathname.startsWith('/administrator')

  var hours = 12
  var now  = new Date().getTime()
  var setupTime = localStorage.getItem('setupTime')

  const today = new Date();

  if(setupTime === null){
    localStorage.setItem('setupTime',now)
  }
  else{
    if(now - setupTime > hours*60*60*1000){
      localStorage.clear()
      localStorage.setItem('setupTime',now)
    }
  }

  const {
    isLoading,
    videoBannerData,
    quoteData,
    contactData,
    serviceData,
    aboutData,
    clientData,
    portfolioData,
    portfolioLengthData,
    teamData,
    reloadData
  } = useSelector((state) => state.root)

  const dispatch = useDispatch()

  // Banner Video For Home Page

  const getBannerVideo = useCallback(async () => {

    try{
      dispatch(showloading())
      const responce = await axios.get(`${URL}/api/NextStudio/video-banner`)
      dispatch(setVideoBannerData(responce.data.video))
      dispatch(ReloadData(false))
      dispatch(hiddenloading())
    }catch(err){
      dispatch(hiddenloading())
    }
  }, [dispatch])

  useEffect(() => {
    if(!videoBannerData){
      getBannerVideo()
    }
  },[videoBannerData, getBannerVideo])

  // get all slogan data

  const getSlonganData = useCallback(async () =>{
    try{
      dispatch(showloading())
      const responce = await axios.get(`${URL}/api/NextStudio/quote`)
      dispatch(setQuoteData(responce.data.quote))
      dispatch(ReloadData(false))
      dispatch(hiddenloading())
    }catch(err){
      dispatch(hiddenloading())
    }
  }, [dispatch])

  useEffect(() => {
    if(!quoteData){
      getSlonganData()
    }
  },[quoteData, getSlonganData])

  //get all contact Data

  const getContactData = useCallback(async () => {
    try{
      dispatch(showloading())
      const responce = await axios.get(`${URL}/api/NextStudio/contact`)
      dispatch(setContactData(responce.data.contact))
      dispatch(ReloadData(false))
      dispatch(hiddenloading())
    }catch(err){
      dispatch(hiddenloading())
    }
  }, [dispatch])

  useEffect(() => {
    if(!contactData){
      getContactData()
    }
  },[contactData, getContactData])

  // get all Service Data

  const getServiceData = useCallback(async () => {
    try{
      dispatch(showloading())
      const responce = await axios.get(`${URL}/api/NextStudio/service`)
      dispatch(setServiceData(responce.data.service))
      dispatch(ReloadData(false))
      dispatch(hiddenloading())
    }catch(err){
      dispatch(hiddenloading())
    }
  }, [dispatch])

  useEffect(() => {
    if(!serviceData){
      getServiceData()
    }
  },[serviceData, getServiceData])

  // get all About Data

  const getAboutData= useCallback(async () => {
    try{
      dispatch(showloading())
      const responce = await axios.get(`${URL}/api/NextStudio/about`)
      dispatch(setAboutData(responce.data.about))
      dispatch(ReloadData(false))
      dispatch(hiddenloading())
    }catch(err){
      dispatch(hiddenloading())
    }
  }, [dispatch])

  useEffect(() => {
    if(!aboutData){
      getAboutData()
    }
  },[aboutData, getAboutData])

  const getClientData = useCallback(async () => {
    try{
      dispatch(showloading())
      const responce = await axios.get(`${URL}/api/NextStudio/client`)
      dispatch(setClientData(responce.data.client))
      dispatch(ReloadData(false))
      dispatch(hiddenloading())
    }catch(err){
      dispatch(hiddenloading())
    }
  }, [dispatch])

  useEffect(() => {
    if(!clientData){
      getClientData()
    }
  },[clientData, getClientData])

  const getTeamData = useCallback(async () => {
    try{
      dispatch(hiddenloading())
      const responce = await axios.get(`${URL}/api/NextStudio/team`)
      dispatch(setTeamData(responce.data.team))
      dispatch(ReloadData(false))
      dispatch(hiddenloading())
    }catch(err){
      dispatch(hiddenloading())
    }
  }, [dispatch])

  const getPortfolioById = useCallback(async (id) => {
    try{
      dispatch(showloading())
      const responce = await axios.get(`${URL}/api/NextStudio/portfolio/${id}`)
      dispatch(setPortfolioData([responce.data.portfolio])) // Store as array for compatibility
      dispatch(ReloadData(false))
      dispatch(hiddenloading())
      return responce.data.portfolio
    }catch(err){
      dispatch(hiddenloading())
      return null
    }
  }, [dispatch])

  useEffect(() => {
    if(!teamData){
      getTeamData()
    }
  },[teamData, getTeamData])

  // get all portfolio data (only for client routes, not admin routes)

  const getPortfolioData = useCallback(async () => {
    // Don't fetch on admin routes
    if (isAdminRoute) return;
    
    try{
      dispatch(hiddenloading())
      const responce = await axios.get(`${URL}/api/NextStudio/portfolio`)
      dispatch(setPortfolioData(responce.data.portfolios))
      dispatch(ReloadData(false))
      dispatch(hiddenloading())
    }catch(err){
      dispatch(hiddenloading())
    }
  }, [dispatch, isAdminRoute])
  
  useEffect(() => {
    if(!portfolioData && !isAdminRoute){
      getPortfolioData()
    }
  },[portfolioData, getPortfolioData, isAdminRoute])

  // get all portfolio data length (only for client routes, not admin routes)

  const getPortfolioLengthData = useCallback(async () => {
    // Don't fetch on admin routes
    if (isAdminRoute) return;
    
    try{
      dispatch(hiddenloading())
      const responce = await axios.get(`${URL}/api/NextStudio/portfolio/length`)
      dispatch(setPortfolioLengthData(responce.data.portfolios))
      dispatch(ReloadData(false))
      dispatch(hiddenloading())
    }catch(err){
      dispatch(hiddenloading())
    }
  }, [dispatch, isAdminRoute])

  useEffect(() => {
    if(!portfolioLengthData && !isAdminRoute){
      getPortfolioLengthData()
    }
  },[portfolioLengthData, getPortfolioLengthData, isAdminRoute])

  //get all data when reload (only for client routes, not admin routes)

  useEffect(() => {
    if(reloadData && !isAdminRoute){
      getBannerVideo()
      getSlonganData()
      getContactData()
      getServiceData()
      getAboutData()
      getClientData()
      getTeamData()
      getPortfolioData()
      getPortfolioLengthData()
    }
  },[reloadData, isAdminRoute, getAboutData, getBannerVideo, getClientData, getContactData, getPortfolioData, getPortfolioLengthData, getServiceData, getSlonganData, getTeamData])

  return (
    <>
      {isLoading && !isAdminRoute ? <LoadingPage/> : null}
      <div className="App">
        <Routes>
          <Route exact path='/' element={<HomePage/>}/>
          <Route path='about' element={<AboutPage/>}/>
          <Route path='portfolios' element={<PortfolioPage/>}/>
          <Route path='portfolios/:id' element={<PortfolioDetailsPage/>}/>
          <Route path='contact' element={<ContactPage/>}/>
          <Route path='mme' element={<MMEPage/>}/>
          <Route path='administrator' element={<AdminLoginPage/>}/>
          <Route path='admindashboard/home' element={<AdminHomePage/>}/>
          <Route path='admindashboard/about' element={<AdminAboutPage/>}/>
          <Route path='admindashboard/portfolios' element={<AdminPortfolioPage/>}/>
          <Route path='admindashboard/contact' element={<AdminContactPage/>}/>
          <Route path='admindashboard/setting' element={<AdminSettingPage/>}/>
          <Route path='*' element={<PageNotFound/>}/>
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
