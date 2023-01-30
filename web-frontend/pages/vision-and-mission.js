import Footer from "../components/footer/footer"
import Header from '../components/Navbar/header';
function Vision() {

  const cardStyle1 = {
    position:"absolute",
    top:"-10px",
    left:"17px",
    padding:"5px",
    background:"blue",
    color:"white",
    borderRadius: "2px"
  }
  // const cardStyle2 = {
  //   position:"absolute",
  //   top:"-10px",
  //   left:"17px",
  //   padding:"5px",
  //   background:"blue",
  //   color:"white",
  //   borderRadius: "2px"
  // }
  return (
    
    <html>
      <head>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous" />    
          
      </head>
      <body>
        
        <div className="container-fluid bg-blue-1 py-3">
          <h2 className="text-center text-white">Welcome</h2>
          <p className="text-center text-white px-5 w-85">
          Lorem ipsum dolor sit amet, 
          consectetur adipiscing elit, 
          sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum
          </p>
            
        </div>
        <div className="container justify-content-center pt-5">
          <div className="row justify-content-center">
            <div className="col-md-6 col-6">
              <div className="card w-50 float-right" style={{ position:"relative" }}>
                <div className="card-body">
                  <h5 className="card-title mt-5">About Us</h5>
                  <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                  
                </div>
                <h1 className="card-badge px-3" style={cardStyle1}>1</h1>
              </div>
            </div>
            <div className="col-md-6 col-6">
              <div className="card w-50" style={{ position:"relative" }}>
                <div className="card-body">
                  <h5 className="card-title mt-5">About Us</h5>
                  <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                  
                </div>
                <h1 className="card-badge px-3" style={cardStyle1}>2</h1>
              </div>
            </div>
          </div>
          
        </div>
        <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/popper.js@1.12.9/dist/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl" crossorigin="anonymous"></script>
      </body>
    </html>
  )
}

export default Vision