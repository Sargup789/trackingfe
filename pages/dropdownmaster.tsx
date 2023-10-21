import DropdownMasterComponent from '@/components/DropDownMaster'
import Layout from '@/components/general/Layout'
import withLogin from '@/components/general/withLogin'
import React from 'react'

type Props = {}

const DropdownMaster = (props: Props) => {
    return (
        <Layout><DropdownMasterComponent /></Layout>
    )
}

export default withLogin(DropdownMaster)