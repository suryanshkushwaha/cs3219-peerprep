// frontend/src/CollaborationServiceIntegratedView.jsx
import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import * as Y from 'yjs'
import { yCollab } from 'y-codemirror.next'
import { HocuspocusProvider } from '@hocuspocus/provider'
import { EditorState } from '@codemirror/state'
import { EditorView, basicSetup } from 'codemirror'
import { javascript } from '@codemirror/lang-javascript'

const CollaborationServiceIntegratedView: React.FC = () => {
  const { topic, difficulty, questionId, sessionId } = useParams<{
    topic: string
    difficulty: string
    questionId: string
    sessionId: string
  }>()

  const editorRef = useRef(null) // Reference to the CodeMirror editor container
  const navigate = useNavigate()

  useEffect(() => {
    // Log session details
    console.log(`Session ID: ${sessionId}, Topic: ${topic}, Difficulty: ${difficulty}`)
    console.log(`Question: ${questionId}`)
  }, [sessionId, topic, difficulty, questionId])

  useEffect(() => {
    // Lock scroll when component mounts
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = 'auto' // Unlock scroll on unmount
    }
  }, [])

  useEffect(() => {
    if (!editorRef.current) return // Check if editorRef is available
    
    // Initialize Y.js document and Hocuspocus provider for real-time collaboration
    const ydoc = new Y.Doc()
    const provider = new HocuspocusProvider({
      url: `ws://localhost:1234/${sessionId}`,
      name: 'collaborative-doc',
      document: ydoc,
    })

    const yText = ydoc.getText('codemirror')

    // Create CodeMirror editor state with collaborative extensions
    const state = EditorState.create({
      doc: yText.toString(),
      extensions: [
        basicSetup,
        javascript(),
        yCollab(yText, provider.awareness), // Enable Y.js collaboration with yCollab
        EditorView.theme({
          '&': { height: '100%' },
          '.cm-scroller': { overflow: 'auto' },
        }),
      ],
    })

    // Initialize and mount the CodeMirror editor view
    const view = new EditorView({
      state,
      parent: editorRef.current,
    })

    // Clean up resources on component unmount
    return () => {
      provider.disconnect()
      ydoc.destroy()
      view.destroy()
    }
  }, [sessionId])

  // Navigate back to the matching screen on session exit
  const handleLeaveSession = () => {
    navigate('/matching')
  }

  return (
    <div className="editor-container-parent">
      <div className="editor-header">
        <h2>Collaboration Session</h2>
        <p>Topic: {topic} | Difficulty: {difficulty} | Session: {sessionId}</p>
        <p>Question: {questionId}</p>
        <button onClick={handleLeaveSession} className="leave-btn">Leave Session</button>
      </div>

      <div className="editor-container">
        <div ref={editorRef} style={{ height: '100%', border: '1px solid #000', marginTop: '1rem' }} />
      </div>
    </div>
  )
}

export default CollaborationServiceIntegratedView