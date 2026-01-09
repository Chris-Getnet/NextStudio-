const LoadingPage = () => {
    return(
        <div className="items-center h-screen w-full fixed flex justify-center bg-white inset-0 z-10">
           <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" style={{
                        backgroundColor: "transparent",
                        marginLeft:"-150px",
                        width: "200px",
                        height: "200px",
                        zIndex: "10px",
                        position: 'absolute'
                    }}>
                <g className="icon_1" fill= "#ee5c2b">
                    <path className="cls-1" d="M8.59,8.35l-.53-.52L5.4,5.17a1,1,0,0,1,.29-1.58,1,1,0,0,1,1.09.23L9.92,7l.67.67a1,1,0,0,1,0,1.41L6.93,12.7a.94.94,0,0,1-1,.24.92.92,0,0,1-.62-.85,1,1,0,0,1,.31-.78L8.42,8.48Z"/>
                </g>
            </svg>
            <svg  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" style={{
                        backgroundColor: "transparent",    
                        width: "200px",
                        height: "2000px",
                    }}>
                <g className="icon_2" fill= "#ee5c2b">
                    <path className="cls-1" d="M8.59,8.35l-.53-.52L5.4,5.17a1,1,0,0,1,.29-1.58,1,1,0,0,1,1.09.23L9.92,7l.67.67a1,1,0,0,1,0,1.41L6.93,12.7a.94.94,0,0,1-1,.24.92.92,0,0,1-.62-.85,1,1,0,0,1,.31-.78L8.42,8.48Z"/>
                </g>
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" style={{
                        backgroundColor: "transparent",
                        marginLeft:"150px",
                        width: "200px",
                        height: "2000px",
                        position: 'absolute'
                    }}>
                <g className="icon_3" fill= "#ee5c2b">
                    <path d="M7,8.25C7,7,7,5.75,7,4.49a.94.94,0,0,1,.93-1,1,1,0,0,1,1,1c0,1,0,1.94,0,2.91C9,8.93,9,10.47,9,12a.92.92,0,0,1-.56.89.93.93,0,0,1-1-.14A.94.94,0,0,1,7,12V8.25Z"/>        
                </g>
            </svg>
        </div>
    )
}

export default LoadingPage;