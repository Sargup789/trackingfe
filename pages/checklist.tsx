import ChecklistMaster from '@/components/CheckList/ChecklistMaster'
import Layout from '@/components/general/Layout'
import withLogin from '@/components/general/withLogin'
import React from 'react'

type Props = {}

const checklist = (props: Props) => {
    return (
        <Layout><ChecklistMaster /></Layout>
    )
}

export default withLogin(checklist)