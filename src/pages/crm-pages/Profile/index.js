import React from 'react'
import { Card, CardBody, CardHeader, Container } from 'reactstrap'
import ProfileUpdateForm from './ProfileUpdateForm'
import GetProfile from './GetProfile'
import { useTranslation } from 'react-i18next'
import trading from '../../../assets/images/chartbg.png'
import BackButton from '../../../Layouts/BackButton'

const Index = () => {
    const { t } = useTranslation()
    return (
        <>
            <div className="page-content"
                style={{
                    backgroundImage: `url(${trading})`,
                    backgroundSize: 'cover', backgroundPosition: 'center',
                    padding: '20px',
                    borderRadius: 16,
                    boxShadow: "0 4px 24px rgba(60, 4, 82, 0.12)",
                    height: "89vh"


                }}
            >
                <BackButton />
                <Container fluid>
                    {/* <GetProfile /> */}
                    <Card className="shadow-lg  rounded bg-transparent">
                        <CardHeader className='bg-transparent'>
                            <h3 className="mb-0">{t("Personal Information")}</h3>
                        </CardHeader>
                        <CardBody>
                            <ProfileUpdateForm />
                        </CardBody>
                    </Card>
                </Container>
            </div>
        </>
    )
}

export default Index
