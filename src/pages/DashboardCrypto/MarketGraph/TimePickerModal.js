import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, Button, Nav, NavItem, NavLink, TabContent, TabPane, Input } from "reactstrap";
import { TimePicker } from "react-ios-time-picker";
import classnames from "classnames";
import { useTranslation } from "react-i18next";
import { divide } from "lodash";

function formatCurrentTimeTo10AMFormat() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0'); // Ensure two digits
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)

    return `${hours}:${minutes} ${ampm}`;
}

const getCurrentTime = () => {
    const now = new Date();
    let hours = now.getHours();  // 24-hour format (e.g., 16)
    let minutes = now.getMinutes().toString().padStart(2, "0"); // Ensure two-digit minutes

    return `${hours}:${minutes}`; // Correct format for react-ios-time-picker
};



// Example usage:
const currentTimeString = getCurrentTime();


const TimePickerModal = ({ isOpen, toggle, onSelectionChange }) => {
    const { t } = useTranslation();

    const currentTime = formatCurrentTimeTo10AMFormat();
    const [activeTab, setActiveTab] = useState("1");
    const [timeValue, setTimeValue] = useState(getCurrentTime()); // ✅ Always start with valid time format
    const [timeValue1, setTimeValue1] = useState("10:00 AM");
    const [priceValue, setPriceValue] = useState("");
    const [open, setOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);  // Stores "time" or "price"



    const toggleTab = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };




    const handleContinue = () => {
        if (activeTab === "1") {
            onSelectionChange({ type: "time", value: timeValue });
            setTimeout(() => {
                const saveButton = document.querySelector(".react-ios-time-picker-btn:not(.react-ios-time-picker-btn-cancel)");
                if (saveButton) {
                    saveButton.click();  // Simulate Save Button Click
                }
            }, 200);
        } else {
            onSelectionChange({ type: "price", value: priceValue });
        }
        toggle(); // Close the modal
    };

    const handleModalOpened = () => {
        const newTime = getCurrentTime()
        setTimeValue(newTime); // ✅ Always update to the current time
        setOpen(true);
    };


    const handleModalClosed = () => {
        setOpen(false);
    };

    const handleTimeChange = (newTime) => {
        const now = new Date();
        const currentTime = getCurrentTime(); // Get current time in "HH:mm" format
        if (newTime < currentTime) {
            alert("You cannot select a past time!");
            setTimeValue(currentTime); // Reset to current time
        } else {
            setTimeValue(newTime); // Set valid time
        }
    };

    useEffect(() => {
        if (isOpen && activeTab === "1") {
            setTimeout(() => {
                const timePickerDiv = document.querySelector(".react-ios-time-picker-main");
                if (timePickerDiv) {
                    timePickerDiv.click(); // Simulate a click
                }
            }, 350); // Slight delay to ensure it's rendered
        }
    }, [isOpen, activeTab]);

    useEffect(() => {
        const saveButton = document.querySelector(".react-ios-time-picker-btn:not(.react-ios-time-picker-btn-cancel)");

        if (saveButton) {
            const handleSaveClick = () => {
                handleContinue(); // Call handleContinue when Save is clicked
            };

            saveButton.addEventListener("click", handleSaveClick);

            return () => {
                saveButton.removeEventListener("click", handleSaveClick);
            };
        }
    }, [isOpen]); // Run effect when modal opens


    return (
        <div style={{ padding: '3px' }}>

            <Modal isOpen={isOpen} toggle={toggle} centered className="bottom-up-modal" onOpened={handleModalOpened} onClosed={handleModalClosed}
                style={{
                    boxShadow: 'none',
                    zIndex: 5000, // Ensure modal is above all other content


                }}
            >
                <ModalHeader style={{
                    // background: 'linear-gradient(90deg, #1F0E27 60%, #390452 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '20px',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
                    padding: '0',
                }}>
                    <Nav tabs justified className="w-100 d-flex">
                        <NavItem className="flex-grow-1 text-center" style={{ margin: '10px' }}>
                            <NavLink
                                className={classnames("tab-link", { active: activeTab === "1" })}
                                onClick={() => toggleTab("1")}
                                style={{
                                    background: 'transparent',
                                    // color: activeTab === "1" ? '#1e90ff' : '#fff',
                                    borderBottom: activeTab === "1" ? '3px solid #8b2877ff' : '3px solid transparent',
                                    backgroundColor: 'linear-gradient(90deg, #c41a6b, #390452)',
                                    fontWeight: 700,
                                    fontSize: 16,
                                    borderRadius: '20px',
                                    transition: 'all 0.3s',
                                }}
                            >
                                By Time
                            </NavLink>
                        </NavItem>
                        <NavItem className="flex-grow-1 text-center" style={{ margin: '10px' }}>
                            <NavLink
                                className={classnames("tab-link", { active: activeTab === "2" })}
                                onClick={() => toggleTab("2")}
                                style={{
                                    background: 'transparent',
                                    // color: activeTab === "2" ? '#1e90ff' : '#fff',
                                    borderBottom: activeTab === "2" ? '3px solid #8b2877ff' : '3px solid transparent',
                                    fontWeight: 700,
                                    fontSize: 16,
                                    borderRadius: '20px',
                                    transition: 'all 0.3s',

                                }}
                            >
                                By Price
                            </NavLink>
                        </NavItem>
                    </Nav>
                </ModalHeader>
                <ModalBody className="text-center" style={{
                    // background: 'linear-gradient(135deg, #1F0E27 60%, #390452 100%)',
                    color: '#fff',
                    borderRadius: '0 0 12px 12px',
                    boxShadow: 'none',
                    padding: '24px 16px',
                }}>
                    <TabContent activeTab={activeTab}>
                        <TabPane tabId="1">
                            {open && (
                                <TimePicker
                                    onChange={handleTimeChange}
                                    value={typeof timeValue === 'string' && timeValue.match(/^\d{1,2}:\d{2}$/) ? timeValue : getCurrentTime()}
                                    use12Hours={false}
                                    isOpen={open}
                                    style={{
                                        background: 'rgba(68, 25, 65, 0.15)',
                                        borderRadius: '12px',
                                        color: '#fff',
                                        fontWeight: 500,
                                        fontSize: 18,
                                        boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
                                    }}
                                />
                            )}
                        </TabPane>
                        <TabPane tabId="2" className="react-ios-time-picker-main">
                            <Input
                                type="number"
                                placeholder="Enter Price"
                                value={priceValue}
                                onChange={(e) => setPriceValue(e.target.value)}
                                style={{
                                    background: 'rgba(68, 25, 65, 0.15)',
                                    borderRadius: '12px',
                                    color: '#fff',
                                    fontWeight: 500,
                                    fontSize: 18,
                                    // border: '1px solid #1e90ff',
                                    boxShadow: 'none',
                                }}
                            />
                        </TabPane>
                    </TabContent>
                    <Button size="lg" onClick={handleContinue} className="depositButton w-100 mt-3 justify-content-center"
                        style={{
                            background: 'linear-gradient(90deg, #c41a6b, #390452)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontWeight: 600,
                            fontSize: 18,
                            boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
                        }}
                    >
                        Continue
                    </Button>
                </ModalBody>
                {/* Custom Styles */}
                <style>
                    {`
                .modal.bottom-up-modal {
                  z-index: 5000 !important;
                }
                h5.modal-title{
                width: 100%;
                }
                .tab-link {
                    width: 100%;
                    padding: 10px 0;
                    font-size: 16px;
                    font-weight: 500;
                    text-align: center;
                    color: white;
                    border-bottom: 3px solid transparent;
                    transition: all 0.3s ease;
                    border : 1px solid #9f2783ff  !important;
                }
                .tab-link.active {
                    // color: #1e90ff !important;
                    // border-bottom: 3px solid #92117cff !important;
                    background: linear-gradient(90deg, #c41a6b, #390452) !important;
                    }
                    .form-control:focus{
                    border-color:none !important;
                    }
                .react-ios-time-picker-main {
                //   background: linear-gradient(135deg, #1F0E27 60%, #390452 100%) !important;
                  border-radius: 25px !important;
                  color: #fff !important;
                  box-shadow: 0 2px 12px rgba(0,0,0,0.10) !important;
                  border: 1px solid #9f2783ff !important;
                  padding: 10px !important;
                }
                .react-ios-time-picker-btn {
                  background: linear-gradient(90deg, #c41a6b, #390452) !important;
                  color: #fff !important;
                  border-radius: 8px !important;
                  font-weight: 600 !important;
                  font-size: 16px !important;
                  border: none !important;
                }
                .react-ios-time-picker-btn-save {
                //   background: #1e90ff !important;
                  color: #fff !important;
                }
                .react-ios-time-picker-selected {
                  background: #c41a6b !important;
                  color: #fff !important;
                  border-radius: 8px !important;
                }
                .react-ios-time-picker-colon {
                  color: #fff !important;
                }
                .react-ios-time-picker-list {
                  background: transparent !important;
                  color: #fff !important;
                }
                  .react-ios-time-picker-container {
                    background: transparent !important;
                  backdrop-filter: blur(19px) !important;
                }
                
                
                .react-ios-time-picker-container.active {
                  background: #2A1A3A !important;
                }
                .react-ios-time-picker-selected-overlay {
                  background: #2A1A3A !important;
                }
                .form-control {
                  background: linear-gradient(135deg, #1F0E27 60%, #390452 100%) !important;
                  color: #fff !important;
                  border-radius: 12px !important;
                  border: none !important;
                  font-size: 18px !important;
                  font-weight: 500 !important;
                  box-shadow: none !important;
                }
                .form-control:focus {
                  border-color: #none !important;
                  background: linear-gradient(135deg, #1F0E27 60%, #390452 100%) !important;
                  color: #fff !important;
                }
                  .react-ios-time-picker-btn-container {
                        flex-direction: row !important;
                        gap: 8px !important;
                      }
                      .react-ios-time-picker.react-ios-time-picker-transition {
                        position: absolute !important;
                        bottom: 12px !important;
                        margin: 0 !important;
                        width: 88% !important;
                        border-radius: 12px !important;
                        display: flex !important;
                        flex-direction: column !important;
                        border: 1px solid #1F0E27 !important;
                      }
                      @media (max-width: 576px) {
                        .react-ios-time-picker.react-ios-time-picker-transition {
                          bottom: 315px !important;
                          border-radius: 12px !important;
                          border: 1px solid #1F0E27 !important;
                        }
                      }
                        .react-ios-time-picker-btn-container {
                       background: transparent !important;
                  backdrop-filter: blur(19px) !important;
                      display: flex !important;
                      flex-direction: row !important;
                      gap: 8px !important;
                      order: 2 !important;
                    }
                    .react-ios-time-picker-btn {
                      width: 30% !important;
                      margin: 0 !important;
                    }
                    
                    .custom-cross-in-btn-container {
                      background: rgba(31,14,39,0.85);
                      border: 2px solid #c41a6b;
                      border-radius: 50%;
                      width: 32px;
                      height: 32px;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      cursor: pointer;
                      z-index: 10;
                      margin-right: 8px;
                      padding: 0;
                    }
                    .react-ios-time-picker-main {
                      order: 1 !important;
                    }
                  @media (max-width: 576px) {
                  .bottom-up-modal{
                  bottom:280px !important;}
                  }
                //   
                `}
                </style>
            </Modal>
        </div>
    );
};

export default TimePickerModal;
