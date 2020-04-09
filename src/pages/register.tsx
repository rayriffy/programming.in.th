import React, { useEffect } from 'react'
import Router from 'next/router'
import { useUser } from '../components/UserContext'
import { Box } from '@chakra-ui/core'
import { PageLayout } from '../components/Layout'
import { Register } from '../components/auth/Register'

export default () => {
  const { user } = useUser()

  useEffect(() => {
    if (user !== null && user !== undefined) {
      Router.push('/')
    }
  }, [user])

  return (
    <PageLayout>
      <Box h={550} w={650} px={6} m="0 auto">
        <Register />
      </Box>
    </PageLayout>
  )
}