import React, { createContext, useState } from 'react'
export const Context = createContext()
function InterviewContext({ children }) {
  const [loading, setLoading] = useState(false)
  const [report, setReport] = useState(null)
  const [reports, setReports] = useState([])
  return (
    <Context.Provider value={{ loading, setLoading, report, setReport, reports, setReports }}>
      {children}
    </Context.Provider>
  )
}

export default InterviewContext
