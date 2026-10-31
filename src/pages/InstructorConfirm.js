import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './InstructorApply.css';

// the page the approval email links to: /instructor/confirm/<token>
export default function InstructorConfirm() {
  const { token } = useParams();
  const [state, setState] = useState({ phase: 'working', courseId: null, courseName: '', message: '' });
  const started = useRef(false); // stops the confirm from running twice in development


  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const confirm = async () => {
      const { data: courseId, error } = await supabase.rpc('confirm_instructor', { p_token: token });

      if (error) {
        setState({ phase: 'error', courseId: null, courseName: '', message: error.message });
        return;
      }

      const { data: course } = await supabase.from('courses').select('name').eq('id', courseId).maybeSingle();
      setState({ phase: 'done', courseId, courseName: course?.name || 'your course', message: '' });
    };

    confirm();
  }, [token]);

  return (
    <div className="ia-page">
      <div className="ia-card ia-center">
        {state.phase === 'working' && <p>Confirming...</p>}

        {state.phase === 'done' && (
          <>
            <div className="ia-big">🎓</div>
            <h1>You are confirmed</h1>
            <p>
              Welcome to the teaching team. You now have full access to <strong>{state.courseName}</strong>,
              with no payment needed.
            </p>
            <Link to={`/my-courses/${state.courseId}`} className="ia-btn">Open the course</Link>
          </>
        )}

        {state.phase === 'error' && (
          <>
            <div className="ia-big">⚠️</div>
            <h1>We could not confirm this</h1>
            <p>{state.message}</p>
            <Link to="/courses" className="ia-btn">Back to courses</Link>
          </>
        )}
      </div>
    </div>
  );
}
