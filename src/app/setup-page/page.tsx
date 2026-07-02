'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Loader2, AlertCircle, Database, KeyRound } from 'lucide-react'

export default function SetupPage() {
  const [status, setStatus] = useState<'idle' | 'checking' | 'migrating' | 'done' | 'error'>('idle')
  const [logs, setLogs] = useState<string[]>([])
  const [error, setError] = useState('')

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, msg])
  }

  const runSetup = async () => {
    setStatus('checking')
    setLogs([])
    setError('')

    try {
      addLog('🔍 Checking database status...')

      // Check status first
      const checkRes = await fetch('/api/setup')
      const checkData = await checkRes.json()

      if (!checkData.success) {
        throw new Error(checkData.error || 'Failed to check database')
      }

      addLog(`📊 Database connected: ${checkData.data.connected}`)
      addLog(`📋 Tables found: ${checkData.data.tables?.length || 0}`)
      addLog(`❌ Missing tables: ${checkData.data.missingTables?.length || 0}`)

      if (checkData.data.isReady && checkData.data.userCount > 0) {
        addLog('✅ Database already set up!')
        addLog(`👥 Users: ${checkData.data.userCount}`)
        addLog(`⛏️ Plans: ${checkData.data.planCount}`)
        setStatus('done')
        return
      }

      // Run migration
      setStatus('migrating')
      addLog('🔧 Starting migration...')

      // Use the simple fixed setup key
      const secret = 'crypto-mine-setup-2026'

      addLog('📡 Creating all tables...')
      const setupRes = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: secret })
      })

      const setupData = await setupRes.json()

      if (!setupData.success) {
        throw new Error(setupData.error || 'Setup failed')
      }

      // Add all step logs
      setupData.data.steps?.forEach((step: string) => {
        addLog(step)
      })

      setStatus('done')
      addLog('🎉 Setup complete! You can now login.')
    } catch (e: any) {
      console.error(e)
      setError(e.message)
      setStatus('error')
      addLog(`❌ Error: ${e.message}`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a14] via-[#13132a] to-[#0a0a14] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-[#00d4ff]/20 blur-3xl animate-float" />
      <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full bg-[#9d4edd]/20 blur-3xl animate-float" style={{ animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-2xl"
      >
        <div className="glass rounded-3xl border border-white/10 p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
              className="inline-flex w-20 h-20 rounded-3xl bg-gradient-to-br from-[#00d4ff] to-[#9d4edd] items-center justify-center mb-4 glow-electric"
            >
              <Database className="h-10 w-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-black text-gradient-electric mb-2">
              Database Setup
            </h1>
            <p className="text-sm text-muted-foreground">
              One-click database initialization for Crypto Mining Platform
            </p>
          </div>

          {/* Status Display */}
          {status === 'idle' && (
            <div className="text-center">
              <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-6">
                <p className="text-sm text-blue-200/80 mb-2">
                  👋 This page will automatically:
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 text-start max-w-md mx-auto">
                  <li>✅ Create all 11 database tables</li>
                  <li>✅ Create admin user (admin@cryptomine.io)</li>
                  <li>✅ Create 4 mining plans (Basic, Silver, Gold, Diamond)</li>
                  <li>✅ Create 8 daily/weekly/special tasks</li>
                  <li>✅ Setup admin system settings</li>
                </ul>
              </div>

              <button
                onClick={runSetup}
                className="w-full h-14 bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] text-white font-bold rounded-2xl glow-electric hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                <Database className="h-5 w-5" />
                Setup Database Now
              </button>

              <p className="text-xs text-muted-foreground mt-4">
                💡 One click - no configuration needed!
              </p>
            </div>
          )}

          {/* Loading States */}
          {(status === 'checking' || status === 'migrating') && (
            <div className="text-center py-8">
              <Loader2 className="h-16 w-16 text-[#00d4ff] mx-auto mb-4 animate-spin" />
              <p className="text-lg font-semibold mb-2">
                {status === 'checking' ? 'Checking database...' : 'Setting up database...'}
              </p>
              <p className="text-xs text-muted-foreground">Please wait, this may take 10-30 seconds</p>
            </div>
          )}

          {/* Logs */}
          {logs.length > 0 && (
            <div className="mt-6 p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-xs space-y-1 max-h-64 overflow-y-auto">
              {logs.map((log, i) => (
                <div key={i} className="text-foreground/80">{log}</div>
              ))}
            </div>
          )}

          {/* Done */}
          {status === 'done' && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-6"
            >
              <CheckCircle2 className="h-20 w-20 text-emerald-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2 text-gradient-electric">Setup Complete! 🎉</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Your database is ready. You can now login as admin.
              </p>

              <div className="p-4 rounded-xl bg-[#00d4ff]/5 border border-[#00d4ff]/20 mb-6 text-start">
                <div className="text-xs text-muted-foreground mb-2">Admin Login Credentials:</div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <KeyRound className="h-3 w-3 text-[#00d4ff]" />
                    <span className="text-muted-foreground">Email:</span>
                    <code className="bg-white/5 px-2 py-0.5 rounded">admin@cryptomine.io</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <KeyRound className="h-3 w-3 text-[#00d4ff]" />
                    <span className="text-muted-foreground">Password:</span>
                    <code className="bg-white/5 px-2 py-0.5 rounded">admin123</code>
                  </div>
                </div>
              </div>

              <a
                href="/"
                className="inline-flex items-center gap-2 h-12 px-8 bg-gradient-to-r from-[#00d4ff] to-[#9d4edd] text-white font-bold rounded-2xl glow-electric hover:opacity-90 transition-all"
              >
                Go to Login →
              </a>
            </motion.div>
          )}

          {/* Error */}
          {status === 'error' && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-6"
            >
              <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2 text-red-400">Setup Failed</h2>
              <p className="text-sm text-muted-foreground mb-4">{error}</p>

              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-4 text-start text-xs text-red-200/80">
                <p className="font-medium mb-1">Possible solutions:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Make sure DATABASE_URL is set in Vercel Environment Variables</li>
                  <li>Make sure NEXTAUTH_SECRET is set in Vercel Environment Variables</li>
                  <li>Make sure you entered the correct NEXTAUTH_SECRET value</li>
                  <li>Wait 2-3 minutes after deployment for changes to take effect</li>
                </ul>
              </div>

              <button
                onClick={runSetup}
                className="inline-flex items-center gap-2 h-11 px-6 bg-white/5 border border-white/10 text-white font-medium rounded-xl hover:bg-white/10 transition-all"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
