import DropdownMasterComponent from '@/components/DropDownMaster'
import Layout from '@/components/general/Layout'
import withLogin from '@/components/general/withLogin'
import React from 'react'

const DropdownMaster = () => {
    return (
        <Layout><DropdownMasterComponent /></Layout>
    )
}

export default withLogin(DropdownMaster)