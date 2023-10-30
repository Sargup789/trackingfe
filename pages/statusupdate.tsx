import StatusUpdate from '@/components/StatusUpdate'
import Layout from '@/components/general/Layout'
import withLogin from '@/components/general/withLogin'
import React from 'react'

type Props = {}

const statusupdate = (props: Props) => {
  return (
    <Layout><StatusUpdate /></Layout>
  )
}

export default withLogin(statusupdate)