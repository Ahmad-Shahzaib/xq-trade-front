import React from 'react'
import FeatureLeaders from './FeatureLeaders'
import { Button, Card, CardBody, CardHeader, Col, Container, Row } from 'reactstrap'
import DiscoverPorfolio from './DiscoverPorfolio'

const index = () => {
    return (
        <>
            <div className="page-content">
                <Container id='containFluid' fluid>
                    <Row>
                        <Col xs={12}>
                            <Card>
                                <CardHeader>
                                    <div className="row align-items-center justify-content-between">
                                        <div className="col-6 d-none d-md-block">
                                            <h4 className="card-title mb-0 flex-grow-1">Our Feature Leadure</h4>
                                        </div>
                                        <div className="col-12 col-md-6 text-end">
                                            <Button
                                                color='secondary'
                                                className='btn btn-soft-secondary w-xs'
                                            >
                                                Become Leader
                                            </Button>
                                        </div>


                                    </div>
                                </CardHeader>
                                <CardBody>
                                    <FeatureLeaders />
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs={12}>
                            <Card>
                                <CardBody>
                                    <DiscoverPorfolio />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>

        </>
    )
}

export default index
