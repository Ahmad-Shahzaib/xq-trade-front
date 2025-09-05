import React from 'react'
import { Col, Row } from 'reactstrap'
import MarketWatch from './MarketWatch'
import TradeForm from './TradeForm'
import TradeChart from './TradeChart'
import TradeTabs from './TradeTabs'

const index = () => {
  return (
    <>
      <div className='page-content'>
            <div className='container-fluid'>
                <Row>
                    <Col xl={4}>
                        <MarketWatch/>
                        <TradeForm/>
                    </Col>
                    <Col xl={8}>
                        <TradeChart/>
                    </Col>
                </Row>
                <Row>
                    <TradeTabs/>
                </Row>
            </div>
        </div>
    </>
  )
}

export default index
