import React from 'react'
import { Card, CardBody, CardHeader, Table } from 'reactstrap'

const MarketWatch = () => {
    return (
        <>
            <Card>
                <CardHeader>
                    <h3 className="mb-0 text-secondary">Market Watch</h3>
                </CardHeader>
                <CardBody className='p-0'>
                    <Table striped responsive className="fixed-header-table">
                        <thead className="text-white bg-primary">
                            <tr>
                                <th>Symbol</th>
                                <th>Bid</th>
                                <th>Ask</th>
                                <th>Spread</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </Table>
                </CardBody>
            </Card>
        </>
    )
}

export default MarketWatch
