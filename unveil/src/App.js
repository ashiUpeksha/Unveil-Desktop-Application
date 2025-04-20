import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./views/HomePage/HomePage";
import AddNewEvent from "./views/AddNewEvent/AddNewEvent";
import AddImagesOrVideos from "./views/AddImagesOrVideos/AddImagesOrVideos";
import ViewEvents from "./views/ViewEvents/ViewEvents";
import UpdateEvents from "./views/UpdateEvents/UpdateEvents";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} /> 
        <Route path="/addnewevent" element={<AddNewEvent />} /> 
        <Route path="/addimageorvideos" element={<AddImagesOrVideos />} /> 
        <Route path="/viewevents" element={<ViewEvents />} /> 
        <Route path="/updateevents" element={<UpdateEvents />} />
      </Routes>
    </Router>
  );
}

export default App;