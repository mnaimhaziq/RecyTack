import React from "react";
import PacmanLoader from "react-spinners/PacmanLoader";

const Spinner = () => {
  return (
    <div style={{display:'flex', justifyContent: 'center', alignItems: 'center',height: '100vh'}}>
      <PacmanLoader color="#36d7b7" size={40} />
    </div>
  );
};

export default Spinner;
