import React, { useEffect, useState } from 'react'
import '../style/interview.scss'
import { useInterview } from '../hooks/useInterview'
import { useParams } from 'react-router'
import Loader from '../../../components/Loader/Loader'

const NAV_ITEMS = [
  {
    id: 'technical',
    label: 'Technical Questions',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    )
  },
  {
    id: 'behavioral',
    label: 'Behavioral Questions',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    )
  },
  {
    id: 'roadmap',
    label: 'Road Map',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="3 11 22 2 13 21 11 13 3 11" />
      </svg>
    )
  }
]

// ── Sub-components ─────────────────────────────────

const QuestionCard = ({ item, index }) => {
  const [open, setOpen] = useState(false)

  return (
    <div className='q-card'>
      <div className='q-card__header' onClick={() => setOpen(o => !o)}>
        <span className='q-card__index'>Q{index + 1}</span>
        <p className='q-card__question'>{item.question}</p>

        <span className={`q-card__chevron ${open ? 'q-card__chevron--open' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </div>

      {open && (
        <div className='q-card__body'>
          <div className='q-card__section'>
            <span className='q-card__tag q-card__tag--intention'>Intention</span>
            <p>{item.intention}</p>
          </div>

          <div className='q-card__section'>
            <span className='q-card__tag q-card__tag--answer'>Model Answer</span>
            <p>{item.answer}</p>
          </div>
        </div>
      )}
    </div>
  )
}

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * A single day in the road map component.
 * It displays a header with the day number and focus, and a list of tasks.
 * @param {Object} day - an object with the following properties:
 *   - day: the day number
 *   - focus: the focus for the day
 *   - tasks: an array of tasks for the day
 * @returns {JSX.Element} a JSX element representing the day in the road map
 */
/*******  d1b067e8-c523-40fb-ad4f-8ca92c3afcbc  *******/
const RoadMapDay = ({ day }) => (
  <div className='roadmap-day'>
    <div className='roadmap-day__header'>
      <span className='roadmap-day__badge'>Day {day.day}</span>
      <h3 className='roadmap-day__focus'>{day.focus}</h3>
    </div>

    <ul className='roadmap-day__tasks'>
      {day.tasks.map((task, i) => (
        <li key={i}>
          <span className='roadmap-day__bullet' />
          {task}
        </li>
      ))}
    </ul>
  </div>
)



// ── Main Component ─────────────────────────────────

const Interview = () => {

  const [activeNav, setActiveNav] = useState('technical')
  const { generateReportById, report, loading, getResumePdf } = useInterview()
  // Dummy Data (same schema as backend)
  const { interviewId } = useParams()
  useEffect(() => {

    async function call() {
      await generateReportById({ interviewId })
      console.log(report);

    }
    call()
  }, [interviewId])

  // Guard conditions to handle loading and null report states
  // FIX: Before this fix, the component would crash with "TypeError: Cannot read properties of null (reading 'matchScore')"
  // because the API call to fetch the report had not completed yet when the component first rendered.
  // Now we check if loading is true OR if report is null, and show a loading message until data is ready.
  if (loading || !report) {
    return <Loader message="Loading Report..." />
  }

  const scoreColor =
    report.matchScore >= 80
      ? 'score--high'
      : report.matchScore >= 60
        ? 'score--mid'
        : 'score--low'

  return (
    <div className='interview-page'>
      <div className='interview-layout'>

        {/* ── Left Nav ── */}

        <nav className='interview-nav'>
          <div className="nav-content">

            <p className='interview-nav__label'>Sections</p>

            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                className={`interview-nav__item ${activeNav === item.id ? 'interview-nav__item--active' : ''}`}
                onClick={() => setActiveNav(item.id)}
              >
                <span className='interview-nav__icon'>
                  {item.icon}
                </span>

                {item.label}
              </button>
            ))}

          </div>

          <button
            onClick={() => {
              getResumePdf(interviewId)
            }}
            className='button primary-button'>
            Download Resume
          </button>

        </nav>

        <div className='interview-divider' />

        {/* ── Center Content ── */}

        <main className='interview-content'>

          {activeNav === 'technical' && (
            <section>

              <div className='content-header'>
                <h2>Technical Questions</h2>
                <span className='content-header__count'>
                  {report.technicalQuestions.length} questions
                </span>
              </div>

              <div className='q-list'>
                {report.technicalQuestions.map((q, i) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
              </div>

            </section>
          )}

          {activeNav === 'behavioral' && (
            <section>

              <div className='content-header'>
                <h2>Behavioral Questions</h2>
                <span className='content-header__count'>
                  {report.behavioralQuestions.length} questions
                </span>
              </div>

              <div className='q-list'>
                {report.behavioralQuestions.map((q, i) => (
                  <QuestionCard key={i} item={q} index={i} />
                ))}
              </div>

            </section>
          )}

          {activeNav === 'roadmap' && (
            <section>

              <div className='content-header'>
                <h2>Preparation Road Map</h2>
                <span className='content-header__count'>
                  {report.preparationPlan.length}-day plan
                </span>
              </div>

              <div className='roadmap-list'>
                {report.preparationPlan.map(day => (
                  <RoadMapDay key={day.day} day={day} />
                ))}
              </div>

            </section>
          )}

        </main>

        <div className='interview-divider' />

        {/* ── Right Sidebar ── */}

        <aside className='interview-sidebar'>

          <div className='match-score'>
            <p className='match-score__label'>Match Score</p>

            <div className={`match-score__ring ${scoreColor}`}>
              <span className='match-score__value'>{report.matchScore}</span>
              <span className='match-score__pct'>%</span>
            </div>

            <p className='match-score__sub'>
              Strong match for this role
            </p>
          </div>

          <div className='sidebar-divider' />

          <div className='skill-gaps'>
            <p className='skill-gaps__label'>Skill Gaps</p>

            <div className='skill-gaps__list'>
              {report.skillGaps.map((gap, i) => (
                <span key={i} className={`skill-tag skill-tag--${gap.severity}`}>
                  {gap.skill}
                </span>
              ))}
            </div>
          </div>

        </aside>

      </div>
    </div>
  )
}

export default Interview