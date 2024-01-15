import ViewStatus from '@/components/ViewStatus'
import Layout from '@/components/general/Layout'
import withLogin from '@/components/general/withLogin'
import React from 'react'

const statusupdate = () => {
    return (
        <Layout><ViewStatus /></Layout>
    )
}

export default withLogin(statusupdate)