import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    videoBannerData: null,
    quoteData: null,
    contactData: null,
    serviceData:null,
    aboutData: null,
    clientData:null,
    teamData:null,
    portfolioData:null,
    portfolioLengthData:null,
    portfolioPagination:null,
    isLoading: false,
    reloadData: false,
    message: ''
}

export const rootSlice = createSlice({
    name: 'root',
    initialState,
    reducers:{
        showloading: (state,action) => {
            state.isLoading = true
        },
        hiddenloading: (state,action) => {
            state.isLoading = false
        },
        setVideoBannerData: (state,action) => {
            state.videoBannerData = action.payload
        },
        setQuoteData: (state,action) => {
            state.quoteData = action.payload
        },
        setContactData: (state,action) => {
            state.contactData = action.payload
        },
        setServiceData: (state,action) => {
            state.serviceData = action.payload
        },
        setAboutData: (state,action) => {
            state.aboutData = action.payload
        },
        setClientData: (state,action) => {
            state.clientData = action.payload
        },
        setTeamData: (state,action) => {
            state.teamData = action.payload
        },
        setPortfolioData: (state,action) => {
            state.portfolioData = action.payload
        },
        setPortfolioLengthData: (state,action) => {
            state.portfolioLengthData = action.payload
        },
        setPortfolioPagination: (state,action) => {
            state.portfolioPagination = action.payload
        },
        ReloadData: (state,action) => {
            state.reloadData = action.payload 
        }
    }
})

export const {
    showloading,
    hiddenloading,
    setVideoBannerData,
    setQuoteData,
    setContactData,
    setServiceData,
    setAboutData,
    setTeamData,
    setClientData,
    setPortfolioData,
    setPortfolioLengthData,
    setPortfolioPagination,
    ReloadData
} = rootSlice.actions

export default rootSlice.reducer