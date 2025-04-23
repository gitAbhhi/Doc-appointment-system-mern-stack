import React from "react";
import "../styles/LayoutStyles.css";
import { adminMenu, userMenu } from "./../Data/data";
import { Badge } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { message } from "antd";
import { removeUser } from "../redux/features/userSlice";
// import doctorimg from "../../assets/doctor (2)"

const Layout = ({ children }) => {
  const { user } = useSelector((state) => state.user);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch=useDispatch();

  // logout funtion
  const handleLogout = () => {
    localStorage.clear();
    message.success("Logout Successfully");
    dispatch(removeUser());
    navigate("/login");
  };

  // -----doctor Menu----
   const doctorMenu=[
    {
        name:"Home",
        path:"/",
        icon:"fa-solid fa-house"
    },
    {
        name:"Appointments",
        path:"/doctor-appointments",
        icon:"fa-solid fa-list"
    },
    {
        name:"Profile",
        path:`/doctor/profile/${user?._id}`,
        icon:"fa-solid fa-user",
    },
    
];
// -----doctor Menu----

  // redering menu list
  const SidebarMenu = user?.isAdmin
   ? adminMenu 
   : user?.isDoctor
   ? doctorMenu
   : userMenu;
  return (
    <>
      <div className="main">
        <div className="layout">
          <div className="sidebar ">
            <div className="logo">
              <h6>DOC APP</h6>
              <hr />
            </div>
            <div className="menu">
              {SidebarMenu.map((menu) => {
                const isActive = location.pathname === menu.path;
                return (
                  <>
                    <div key={menu.name} className={`menu-item ${isActive && "active"}`}>
                      <i className={menu.icon}></i>
                      <Link to={menu.path} >{menu.name}</Link>
                    </div>
                  </>
                );
              })}
              <div className={`menu-item `} onClick={handleLogout}>
                <i className="fa-solid fa-right-from-bracket"></i>
                <Link to="/login">Logout</Link>
              </div>
              
            </div>
              {/* <img src="../../assets/doctor.png" alt="img" /> */}
            <div className="imagelogo">
            </div>
          </div>
          <div className="content">
            <div className="header">
              <h3 className="logo-d"> DOC APP <i className="fa-solid fa-user-doctor"></i></h3>
              <div className="header-content">
                <Badge count={user && user.notification.length} onClick={()=>{
                  navigate('/notification')}}
                  >
                  <i class="fa-solid fa-bell"  style={{cursor:"pointer"}}></i>
                </Badge>
                <Link to="/profile">{user?.name}</Link>
                <img src={user?.profileImage} alt="img" className="ml-2 w-[50px] h-[50px] rounded-full object-cover" />
              </div>
            </div>
            <div className="body p-4">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Layout;