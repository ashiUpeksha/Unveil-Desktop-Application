import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import EventOrganizerDashBoard from "./views/EventOrganizerDashBoard/EventOrganizerDashBoard";
import AddNewEvent from "./views/AddNewEvent/AddNewEvent";
import AddImagesOrVideos from "./views/AddImagesOrVideos/AddImagesOrVideos";
import ViewEvents from "./views/ViewEvents/ViewEvents";
import UpdateEvents from "./views/UpdateEvents/UpdateEvents";
import RequestToSingUp from "./views/RequestToSignUp/RequestToSignUp";
import Login from "./views/LoginPage/LoginPage";
import ResetPassword from "./views/ResetPassword/ResetPassword";
import AdminRegister from "./views/AdminRegister/AdminRegister";
import AdminDashBoard from "./views/AdminDashBoard/AdminDashBoard";
import AcceptEvent from "./views/AcceptEvent/AcceptEvent";
import AdminEventHandling from "./views/AdminEventHandling/AdminEventHandling";
import DeleteEvent from "./views/DeleteEvent/DeleteEvent";
import UserRole from "./views/Roles/UserRole";
import UpdateUser from "./views/Users/UpdateUser";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/addnewevent" element={<AddNewEvent />} /> 
        <Route path="/addimageorvideos" element={<AddImagesOrVideos />} /> 
        <Route path="/viewevents" element={<ViewEvents />} /> 
        <Route path="/updateevents" element={<UpdateEvents />} /> 
        <Route path="/deleteevent" element={<DeleteEvent />} /> 
        <Route path="/register" element={<RequestToSingUp />} /> 
        {/* <Route path="/" element={<AdminRegister />} /> */}
        <Route path="/" element={<AdminDashBoard />} />
        <Route path="/admindashboard" element={<AdminDashBoard />} />
        <Route path="/eventorganizerdashboard" element={<EventOrganizerDashBoard />} />
        <Route path="/admineventhandling" element={<AdminEventHandling />} />
        <Route path="/acceptEvent/:eventId" element={<AcceptEvent />} />
        <Route path="/userrole" element={<UserRole />} />
        <Route path="/updateuser" element={<UpdateUser />} />
      </Routes>
    </Router>
  );
}

export default App;