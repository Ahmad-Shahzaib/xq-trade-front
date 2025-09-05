import React from 'react'
import ApplyForPamManager from './ApplyForPamManager'
import PamTable from './PamTable'

const index = () => {
  return (
    <>
      <div className='page-content'>
            <div className='container-fluid'>
                {/* <h3>pam manager</h3> */}
                <ApplyForPamManager/>
                <PamTable/>
            </div>

        </div>
    </>
  )
}

export default index
