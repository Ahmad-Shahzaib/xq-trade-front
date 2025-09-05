import React, { useState, useEffect } from 'react';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { createSelector } from 'reselect';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from "react-router-dom"; 
import {lockScreen} from '../../rtk/slices/lockSlice/lockSlice'

//import images
import avatar1 from "../../assets/images/users/avatar-1.jpg";
import { handleLogout } from '../../utils/menuUtils';

const ProfileDropdown = () => {
    const dispatch = useDispatch(); 
    const navigate = useNavigate()
    const profiledropdownData = createSelector(
        (state) => state.Profile,
        (state) => ({
            user: state.user
        })
      );

       // Logout function wrapper
    const logout = () => handleLogout(dispatch, navigate);

    const handleLockScreen = ()=> {
        dispatch(lockScreen());
        navigate('/auth-lockscreen-basic');
    }

    //Dropdown Toggle
    const [isProfileDropdown, setIsProfileDropdown] = useState(false);
    const toggleProfileDropdown = () => {
        setIsProfileDropdown(!isProfileDropdown);
    };
    return (
        <React.Fragment>
            <Dropdown isOpen={isProfileDropdown} toggle={toggleProfileDropdown} className="ms-sm-3 header-item topbar-user">
                <DropdownToggle tag="button" type="button" className="btn">
                    <span className="d-flex align-items-center">
                        {/* <img className="rounded-circle header-profile-user" src={avatar1}
                            alt="Header Avatar" />
                        <span className="text-start ms-xl-2">
                            <span className="d-none d-xl-inline-block ms-1 fw-medium user-name-text">User</span>
                            <span className="d-none d-xl-block ms-1 fs-12 text-muted user-name-sub-text">Founder</span>
                        </span> */}
                        <i className="ri-logout-box-r-line fs-1"></i>
                    </span>
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-end">
                  
                    {/* <DropdownItem className='p-0' onClick={logout}>
                        <span  className="dropdown-item">
                            <i
                                className="mdi mdi-lock text-muted fs-16 align-middle me-1"></i> <span className="align-middle">Lock screen</span>
                        </span>
                    </DropdownItem> */}
                    <div className="dropdown-divider"></div>
                    {/* Logout option */}
                    <DropdownItem > 
                        <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>
                        <span className="align-middle" data-key="t-logout">Logout</span>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </React.Fragment>
    );
};

export default ProfileDropdown;