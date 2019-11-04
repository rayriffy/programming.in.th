import React from 'react'
import styled from 'styled-components'
import axios from 'axios'

import firebase from '../../lib/firebase'

import { useSelector } from 'react-redux'

import { ITask } from '../../redux/types/task'
import { Submit } from '../../components/tasks/Submit'
import { IAppState } from '../../redux'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { PageLayout } from '../../components/Layout'
import { Row, Col } from 'antd'

const Wrapper = styled.div`
  margin: 15px 0;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.12);
  border-radius: 8px;
  padding: 20px;
  box-sizing: border-box;
  background-color: white;
`

const StatementComponent = styled.div`
  & table,
  table tbody tr,
  table tbody tr td,
  table tbody tr th {
    border: 1px solid black;
    border-collapse: collapse;
  }

  & table tbody tr td {
    font-family: consolas, 'courier new', courier, monospace;
    width: 40%;
    border: 1px solid gray;
    padding: 6px;
    vertical-align: top;
  }

  embed {
    width: 100% !important;
    margin-top: 20px;
  }
`

interface IInitialTaskDetailProps {
  title: string
  timeLimit: number
  memoryLimit: number
  problemStatement: string
}

const TaskDetail: NextPage<IInitialTaskDetailProps> = (
  props: IInitialTaskDetailProps
) => {
  const router = useRouter()
  const user = useSelector((state: IAppState) => state.user.user)
  const template = { __html: props.problemStatement }

  const { id } = router.query

  return (
    <PageLayout>
      <Row>
        <Col lg={{ span: 17, offset: 1 }} xs={{ span: 22, offset: 1 }}>
          <Wrapper>
            <h1>{props.title}</h1>
            <p> Time Limit : {props.timeLimit} second(s)</p>
            <p> Memory Limit : {props.memoryLimit} MB(s)</p>

            <StatementComponent dangerouslySetInnerHTML={template} />
          </Wrapper>
          <Wrapper>
            <Submit problem_id={id as string} canSubmit={!!user} />
          </Wrapper>
        </Col>
        <Col lg={{ span: 4, offset: 1 }} xs={{ span: 22, offset: 1 }}>
          <Wrapper>
            <h1>Information</h1>
          </Wrapper>
          <Wrapper>
            <h1>Statistic</h1>
          </Wrapper>
        </Col>
      </Row>
    </PageLayout>
  )
}

TaskDetail.getInitialProps = async ({ query }) => {
  const taskId = query.id

  const response = await firebase
    .app()
    .functions('asia-east2')
    .httpsCallable('getProblemMetadata')({ problem_id: taskId })

  const currentTask = response.data as ITask

  if (currentTask) {
    const { title, time_limit, memory_limit } = currentTask
    const problemStatement = await axios.get(currentTask.url)
    return {
      title,
      timeLimit: time_limit,
      memoryLimit: memory_limit,
      problemStatement: problemStatement.data
    }
  }
}

export default TaskDetail
