// frontend/src/CollaborationServiceView2.jsx
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as Y from 'yjs'
import { yCollab } from 'y-codemirror.next'
import { HocuspocusProvider } from '@hocuspocus/provider'
import { EditorState } from '@codemirror/state'
import { EditorView, basicSetup } from 'codemirror'
import { javascript } from '@codemirror/lang-javascript'

interface CollaborationServiceViewProps {
  topic: string
  difficulty: string
  sessionId: string
}

const CollaborationServiceView: React.FC<CollaborationServiceViewProps> = ({ topic, difficulty, sessionId }) => {
  const [users, setUsers] = useState<string[]>([]) // Placeholder for active users
  const navigate = useNavigate() // For navigation
  const editorRef = useRef<HTMLDivElement | null>(null) // Ref for CodeMirror editor container

  useEffect(() => {
    // Log session details
    console.log(`Session ID: ${sessionId}, Topic: ${topic}, Difficulty: ${difficulty}`)

    // Initialize Y.js document and Hocuspocus provider
    const ydoc = new Y.Doc()
    const provider = new HocuspocusProvider({
      url: 'ws://127.0.0.1:1234',
      name: sessionId,
      document: ydoc,
    })

    const yText = ydoc.getText('codemirror')

    // Set a basic user awareness field (for demonstration purposes)
    provider.setAwarenessField('user', {
      name: 'Test User',
      color: '#30bced',
      colorLight: '#30bced33',
    })

    // Configure the CodeMirror editor state for real-time collaboration
    const state = EditorState.create({
      doc: yText.toString(),
      extensions: [
        basicSetup,
        javascript(),
        yCollab(yText, provider.awareness),
        EditorView.theme({
          '&': { height: '100%' },
          '.cm-scroller': { overflow: 'auto' },
        }),
      ],
    })

    // Initialize and mount the CodeMirror editor view
    const view = new EditorView({
      state,
      parent: editorRef.current!,
    })

    // Lock scroll when this component mounts
    document.body.style.overflow = 'hidden'

    // Cleanup function on component unmount
    return () => {
      document.body.style.overflow = 'auto' // Unlock scroll
      provider.disconnect()
      ydoc.destroy()
      view.destroy()
    }
  }, [sessionId, topic, difficulty])

  // Function to handle session exit and navigate back
  const handleLeaveSession = () => {
    navigate('/matching')
  }

  return (
    <div className="editor-container-parent">
      <div className="editor-header">
        <h2>Collaboration Session</h2>
        <p>Topic: {topic} | Difficulty: {difficulty}</p>
        <p>Session ID: {sessionId}</p>
        <button onClick={handleLeaveSession} className="leave-btn">Leave Session</button>
      </div>

      <div className="editor-container">
        <div ref={editorRef} style={{ height: '100%', border: '1px solid #000', marginTop: '1rem' }} />
      </div>
    </div>
  )
}

export default CollaborationServiceView