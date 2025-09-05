import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Card, CardBody, Form, FormGroup, Label, Input } from 'reactstrap';
import { toggleSetting } from '../../../rtk/slices/platformSettingsSlice/platformSettingsSlice';
import { useTranslation } from 'react-i18next';
import trading from '../../../assets/images/chartbg.png';
import BackButton from '../../../Layouts/BackButton';

function PlatformSettings() {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.platformSettings);
  const { t } = useTranslation()

  return (
    <div className="page-content" style={{
      backgroundImage: `url(${trading})`,
      backgroundSize: 'cover', backgroundPosition: 'center', padding: '20px 0',
      borderRadius: 16, boxShadow: "0 4px 24px rgba(60, 4, 82, 0.12)",
      height: "89vh"
    }}>
      <BackButton />
      <Container className='pb-5'>
        {/* <h5 className='fw-bold'>Trades</h5>
        <Card>
          <CardBody>
            <Form>
              {[
                { label: "1-click trade", desc: "Open a trade without confirmation", key: "oneClickTrade" },
                { label: "1-click closing", desc: "Close and sell the trade without confirmation", key: "oneClickClosing" },
                { label: "Orders", desc: "Show the order editor on the trade panel", key: "showOrders" }
              ].map(({ label, desc, key }) => (
                <FormGroup switch key={key} className="d-flex justify-content-between align-items-center p-0">
                  <div>
                    <Label style={{ color: 'white', margin: 0 }}>{label}</Label>
                    <p className='mb-0 text-muted'>{desc}</p>
                  </div>
                  <Input 
                    type="switch" 
                    checked={settings[key]} 
                    onChange={() => dispatch(toggleSetting(key))} 
                  />
                </FormGroup>
              ))}
            </Form>
          </CardBody>
        </Card>
        <hr /> */}

        <h5 className='fw-bold'>{t("Accounts")}</h5>
        <Card>
          <CardBody>
            <FormGroup switch className="d-flex justify-content-between align-items-center p-0">
              <div>
                <Label style={{ color: 'white', margin: 0 }}>{t("Hidden balances")}</Label>
                <p className='mb-0 text-muted'>{t("Hide your balances by flipping your phone")}</p>
                <a href="#" className='text-green'>{t("Learn More")}</a>
              </div>
              <Input
                type="switch"
                checked={settings.hiddenBalances}
                onChange={() => dispatch(toggleSetting('hiddenBalances'))}
              />
            </FormGroup>
          </CardBody>
        </Card>
        <hr />

        {/* <h5 className='fw-bold'>Chart</h5>
        <Card>
          <CardBody>
            <Form>
              {[
                { label: "Profit line", desc: "Show the potential profit on the chart", key: "profitLine" },
                { label: "Strike prices", desc: "Show strike prices on the chart", key: "strikePrices" },
                { label: "Types of charts icon", desc: "Show a switch between chart types", key: "chartTypesIcon" },
                { label: "Technical analysis", desc: "Set up indicators and oscillators for each asset", key: "technicalAnalysis" },
              ].map(({ label, desc, key }) => (
                <FormGroup switch key={key} className="d-flex justify-content-between align-items-center p-0">
                  <div>
                    <Label style={{ color: 'white', margin: 0 }}>{label}</Label>
                    <p className='mb-0 text-muted'>{desc}</p>
                  </div>
                  <Input 
                    type="switch" 
                    checked={settings[key]} 
                    onChange={() => dispatch(toggleSetting(key))} 
                  />
                </FormGroup>
              ))}
            </Form>
          </CardBody>
        </Card>
        <hr /> */}

        {/* <h5 className='fw-bold'>Main</h5>
        <Card>
          <CardBody>
            <FormGroup switch className="d-flex justify-content-between align-items-center p-0">
              <div>
                <Label style={{ color: 'white', margin: 0 }}>Safety</Label>
                <p className='mb-0 text-muted'>Set a passcode or save a fingerprint to enter the application</p>
              </div>
              <Input 
                type="switch" 
                checked={settings.safety} 
                onChange={() => dispatch(toggleSetting('safety'))} 
              />
            </FormGroup>
          </CardBody>
        </Card> */}
      </Container>
    </div>
  );
}

export default PlatformSettings;
