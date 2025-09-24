import './App.css';
import LoadingComponent from './LoadingComponent';

function App() {
  return (
    <div className="App">
      <div className="main-container">
        <div className="content-card">
          <div className="icon-container">
            <svg className="civic-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path 
                d="M2 22V9L12 2L22 9V22H14V16H10V22H2Z" 
                fill="white" 
                stroke="white" 
                strokeWidth="1.5"
              />
              <path 
                d="M6 22V12H8V22" 
                stroke="white" 
                strokeWidth="1"
              />
              <path 
                d="M16 22V12H18V22" 
                stroke="white" 
                strokeWidth="1"
              />
            </svg>
          </div>
          
          <h1 className="main-title">
            Civic
            <br />
            Connect
          </h1>
          
          <p className="description">
            Connecting citizens with local services and community updates,
            <br />
            instantly.
          </p>
          
          <LoadingComponent />
        </div>
      </div>
    </div>
  );
}

export default App;
