import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import TawkMessengerReact from "@tawk.to/tawk-messenger-react";
import { Container, Card, CardBody } from "reactstrap";
import { fetchTawkData } from "../../../rtk/slices/tawkSlice/tawkSlice";

const TawkChat = () => {
    const dispatch = useDispatch();
    const { tawkData, loading, error } = useSelector((state) => state.tawk);
    const [appKey, setAppKey] = useState(null);
    const tawkMessengerRef = useRef();
    const [isChatLoaded, setIsChatLoaded] = useState(false); // ✅ Track if Tawk API is loaded

    useEffect(() => {
        dispatch(fetchTawkData());
    }, [dispatch]);

    useEffect(() => {
        if (tawkData && tawkData.shortcode && tawkData.shortcode.app_key) {
            setAppKey(tawkData.shortcode.app_key.value); // ✅ Extract App Key
        }
    }, [tawkData]);

    // ✅ Open chat only if Tawk API is fully loaded
    const openChat = () => {
        if (isChatLoaded && window.Tawk_API) {
            window.Tawk_API.showWidget(); // ✅ Ensure widget is visible
            window.Tawk_API.maximize();  // ✅ Open chat
        }
    };

    // ✅ Hide chat when minimized
    const handleMinimize = () => {
        if (window.Tawk_API) {
            window.Tawk_API.hideWidget(); // ✅ Hide widget
        }
    };

    return (
        <div className="page-content min-vh-100 py-5">
            <Container className="mt-4">
                <h4 className="fw-bold">Support</h4>
                <p className="mb-3">Want to get in touch? Here's how you can reach us.</p>

                <div className="mb-3">
                    <div onClick={openChat}>
                        <Card className="mb-0" style={{ borderRadius: '0px' }}>
                            <CardBody className="d-flex align-items-center pe-0 pb-0">
                                <i className="ri-message-3-line fs-3 fw-bold pb-3 me-2"></i>
                                <div className="d-flex flex-grow-1 align-items-center pb-3 pe-3 border-bottom">
                                    <h6 className="mb-0 fw-bold flex-grow-1">
                                        <span className="mb-2">Chat</span> <br />
                                        <span>Our Chat bot and our team are here to help.</span>
                                    </h6>
                                    <i className="ri-arrow-right-s-line fw-bold fs-5"></i>
                                </div>
                            </CardBody>
                        </Card>
                    </div>
                </div>

                {/* ✅ Tawk Messenger */}
                {appKey && (
                    <TawkMessengerReact
                        propertyId={appKey}
                        widgetId="1imp5d1m7"
                        ref={tawkMessengerRef}
                        onLoad={() => {
                            // console.log("Tawk loaded"); // Removed console.log
                            setIsChatLoaded(true); // ✅ Set chat as loaded
                            window.Tawk_API.hideWidget(); // ✅ Hide initially
                        }}
                        onChatMinimized={handleMinimize}
                    />
                )}
            </Container>
        </div>
    );
};

export default TawkChat;