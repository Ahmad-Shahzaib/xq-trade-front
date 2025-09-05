import { useEffect } from 'react';
import { Button, Card, CardBody, CardHeader, Container, Table, Spinner, Badge } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTickets } from '../../../rtk/slices/supportTicketSlices/ticketListSlice'
import moment from "moment";
import { fetchTicketDetails } from '../../../rtk/slices/supportTicketSlices/ticketShowSlice';

// Ticket Status Mapping with Badge Colors
const STATUS_MAP = {
    0: { label: "Open", color: "warning" },
    1: { label: "Answered", color: "success" },
    2: { label: "Replied", color: "info" },
    3: { label: "Closed", color: "danger" },
};

// Priority Mapping with Badge Colors
const PRIORITY_MAP = {
    1: { label: "Low", color: "secondary" },
    2: { label: "Medium", color: "primary" },
    3: { label: "High", color: "danger" },
};

const Index = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { tickets, loading, error } = useSelector((state) => state.tickets);

    // console.log('ticketList', tickets);

    useEffect(() => {
        dispatch(fetchTickets()); // Fetch tickets when the component mounts
    }, [dispatch]);

    const handleNewSupportTicketPage = () => {
        navigate('/support-tickets/create')
    }

    const handleViewTicket = (ticketId) => {
        dispatch(fetchTicketDetails(ticketId)).then(() => {
            navigate(`/ticket-show/${ticketId}`);
        });
    };
    
    
    return (
        <>
            <div className="page-content">
                <Container fluid className='mt-4'>
                    <Card>
                        <CardHeader>
                            <div className="d-flex justify-content-between align-items-center">
                                <h3 className="mb-0 ">
                                    Support Tickets
                                </h3>
                                <Button className='text-uppercase actionButton' onClick={handleNewSupportTicketPage} >open support ticket</Button>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <Table bordered striped hover responsive>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Subject</th>
                                        <th>Status</th>
                                        <th>Priority</th>
                                        <th>Last Reply</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? (
                                        <tr>
                                            <td colSpan="6" className="text-center">
                                                <Spinner color="white" /> Loading...
                                            </td>
                                        </tr>
                                    ) : tickets.length > 0 ? (
                                        tickets.map((ticket, index) => {
                                            const lastMessage =
                                                ticket.messages.length > 0
                                                    ? ticket.messages[ticket.messages.length - 1].created_at
                                                    : ticket.updated_at;

                                            return (
                                                <tr key={ticket.ticket}>
                                                    <td>{index + 1}</td>
                                                    <td>{ticket.ticket} - {ticket.subject}</td>
                                                    <td>
                                                        <Badge color={STATUS_MAP[ticket.status]?.color || "dark"}>
                                                            {STATUS_MAP[ticket.status]?.label || "Unknown"}
                                                        </Badge>
                                                    </td>
                                                    <td>
                                                        <Badge color={PRIORITY_MAP[ticket.priority]?.color || "dark"}>
                                                            {PRIORITY_MAP[ticket.priority]?.label || "N/A"}
                                                        </Badge>
                                                    </td>
                                                    <td>{moment(lastMessage).fromNow()}</td>
                                                    <td>
                                                        <Button className='depositButtonLite' size="sm"
                                                         onClick={() => handleViewTicket(ticket.ticket)}
                                                        >View</Button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center ">No tickets found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </Container>
            </div>

        </>
    )
}

export default Index
