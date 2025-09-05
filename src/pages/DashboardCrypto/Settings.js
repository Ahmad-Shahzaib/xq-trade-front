import React from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardBody, Col, ListGroup, ListGroupItem, Row } from 'reactstrap';
import { handleLogout } from '../../utils/menuUtils';

const Settings = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Logout handler
    const logout = () => handleLogout(dispatch, navigate);
    const savedLayoutMode = localStorage.getItem('layoutMode')


    // Menu items configuration
    const menuItems = [
        { label: 'Profile', icon: 'ri-user-line', color: '#6c757d', link: '/profile-settings' },
        { label: 'Dashboard', icon: 'ri-dashboard-2-line', color: '#20c997', link: '/' },
        // { label: 'User Dashboard', icon: 'ri-dashboard-2-line', color: '#007bff', link: '/user-dashboard' },
        { label: 'Accounts', icon: 'ri-profile-line', color: '#007bff', link: '/trading-accounts' },
        { label: 'My Referrals', icon: 'ri-share-forward-line', color: '#17a2b8', link: '/my-referrals' },
        { label: 'Deposit', icon: 'ri-wallet-line', color: '#28a745', link: '/deposit' },
        { label: 'Withdraw', icon: 'ri-bank-card-line', color: '#ffc107', link: '/withdraw-funds' },
        { label: 'Logout', icon: 'ri-logout-box-line', color: '#d9534f', link: null, },
        // { label: 'Logout', icon: 'ri-logout-box-line', color: '#d9534f', link: '/login', onClick: logout },
    ];


    return (

                <ListGroup style={{border:'none'}}>
                    {menuItems.map((item, index) => (
                        <ListGroupItem key={index}  className='p-0 border-0  bg-transparent'>
                            <Link
                                to={item.link}
                                onClick={item.onClick || null}
                                
                                
                                role="menuitem"
                                aria-label={item.label}
                            >
                                <Card className={`mb-2 ${item.label === "Logout" ? "bg-danger text-white" : "bg-card"}`}>
                                    <CardBody className="d-flex align-items-center gap-2">
                                        <i className={`${item.icon} me-2 fs-5`}></i>
                                        <div>
                                            <h6 className="mb-0">{item.label}</h6>
                                            
                                        </div>
                                    </CardBody>
                                </Card>
                                
                            </Link>
                        </ListGroupItem>
                    ))}
                </ListGroup>

    );
};

export default Settings;
