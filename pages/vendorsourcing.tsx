import VendorSourcing from '@/components/VendorSourcing'
import Layout from '@/components/general/Layout'
import withLogin from '@/components/general/withLogin'
import React from 'react'

type Props = {}

const vendorsourcing = (props: Props) => {
    return (
        <Layout><VendorSourcing /></Layout>
    )
}

export default withLogin(vendorsourcing)