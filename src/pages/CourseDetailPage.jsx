import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById } from '../data/mockCourses';
import { getSeniorsByIds } from '../data/mockSeniors';
import SeniorCard from '../components/SeniorCard';
import RequestModal from '../components/RequestModal';

const workloadColor = {
  Low: 'badge-success',
  Medium: 'badge-accent',
  'Medium-High': 'badge-warning',
  High: 'badge-danger',
};

export default function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const course = getCourseById(id);
  const [requestTarget, setRequestTarget] = useState(null);

  if (!course) {
    return (
      <div className="page-content">
        <div className="container empty-state">
          <div className="empty-state-icon">📚</div>
          <p className="empty-state-title">Course not found</p>
          <button className="btn btn-primary" onClick={() => navigate('/courses')}>Back to Courses</button>
        </div>
      </div>
    );
  }

  const topSeniors = getSeniorsByIds(course.topSeniorIds);

  return (
    <div className="page-content">
      <div className="container">
        <button className="btn btn-ghost btn-sm" style={{ marginBottom: 'var(--space-4)' }} onClick={() => navigate(-1)}>
          ← Back
        </button>

        {/* Header */}
        <div className="course-detail-header glass-card anim-fade-up">
          <div>
            <span className="text-muted" style={{ fontSize: 'var(--text-sm)' }}>{course.code}</span>
            <h1 className="font-display" style={{ fontSize: 'var(--text-3xl)', marginTop: 4 }}>{course.name}</h1>
            <div className="flex gap-2" style={{ marginTop: 'var(--space-3)', flexWrap: 'wrap' }}>
              <span className={`badge ${workloadColor[course.workload] || 'badge-muted'}`}>{course.workload} Workload</span>
              <span className="badge badge-muted">Year {course.year}</span>
              <span className="badge badge-muted">{course.credits} Credits</span>
              <span className="badge badge-muted">Sem {course.semester}</span>
              <span className="badge badge-accent">⭐ {course.aggregatedExperience.avgRating.toFixed(1)}</span>
            </div>
          </div>
          <div className="course-detail-header-stats">
            <div className="stat-block">
              <span className="stat-value">{course.aggregatedExperience.totalResponses}</span>
              <span className="stat-label">Senior insights</span>
            </div>
            <div className="stat-block">
              <span className="stat-value">{topSeniors.length}</span>
              <span className="stat-label">Top seniors</span>
            </div>
            <div className="stat-block">
              <span className="stat-value">{course.gradeCutData.length}</span>
              <span className="stat-label">Year data</span>
            </div>
          </div>
        </div>

        <div className="course-detail-grid">
          {/* Left column */}
          <div className="course-detail-main">
            {/* Description */}
            <div className="glass-card profile-section anim-fade-up" style={{ animationDelay: '0.1s' }}>
              <h2 className="font-display section-title">About this Course</h2>
              <p className="text-secondary" style={{ lineHeight: 1.8 }}>{course.description}</p>
              <div style={{ marginTop: 'var(--space-4)' }}>
                <p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--space-2)' }}>Assessment</p>
                <span className="badge badge-muted">{course.assessmentPattern}</span>
              </div>
              <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                {course.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>

            {/* Senior Key Insights */}
            <div className="glass-card profile-section anim-fade-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="font-display section-title">Senior Insights 💡</h2>
              <div className="insights-list">
                {course.aggregatedExperience.keyInsights.map((insight, i) => (
                  <div key={i} className="insight-item">
                    <span className="insight-num">{i + 1}</span>
                    <p className="text-secondary">{insight}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Grade Cut Data */}
            <div className="glass-card profile-section anim-fade-up" style={{ animationDelay: '0.3s' }}>
              <h2 className="font-display section-title">Grade Cutoffs (Historical)</h2>
              <div style={{ overflowX: 'auto' }}>
                <table className="grade-table">
                  <thead>
                    <tr>
                      <th>Year</th>
                      <th>Sem</th>
                      <th>O</th>
                      <th>A+</th>
                      <th>A</th>
                      <th>B+</th>
                      <th>B</th>
                      <th>C</th>
                    </tr>
                  </thead>
                  <tbody>
                    {course.gradeCutData.map((row, i) => (
                      <tr key={i} className={row.isFresh ? 'grade-row-fresh' : ''}>
                        <td>{row.year}{row.isFresh ? ' ✦' : ''}</td>
                        <td>{row.semester}</td>
                        <td className="grade-O">{row.O}</td>
                        <td>{row.Ap}</td>
                        <td>{row.A}</td>
                        <td>{row.Bp}</td>
                        <td>{row.B}</td>
                        <td>{row.C}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-muted" style={{ fontSize: 'var(--text-xs)', marginTop: 'var(--space-3)' }}>
                ✦ Most recent data · Values are approximate score thresholds
              </p>
            </div>
          </div>

          {/* Right: Top seniors */}
          <div className="anim-fade-up" style={{ animationDelay: '0.25s' }}>
            <h2 className="font-display" style={{ fontSize: 'var(--text-xl)', marginBottom: 'var(--space-4)' }}>
              Top Seniors for {course.shortName}
            </h2>
            <div className="flex-col gap-4" style={{ display: 'flex' }}>
              {topSeniors.map((s) => (
                <SeniorCard key={s.id} senior={s} onRequest={setRequestTarget} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {requestTarget && (
        <RequestModal senior={requestTarget} onClose={() => setRequestTarget(null)} />
      )}
    </div>
  );
}
