import { useState } from 'react'

export default function TestAnalysis() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    alert('File selected: ' + file.name)

    // Convert to data URL
    const reader = new FileReader()
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string

      alert('Data URL created, length: ' + dataUrl.length)

      try {
        setLoading(true)
        setError(null)

        alert('Sending POST to /api/analyze...')

        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: dataUrl }),
        })

        alert('Response received: ' + response.status)

        const data = await response.json()

        alert('Data parsed: ' + (data.success ? 'SUCCESS' : 'FAILED'))

        if (data.success) {
          setResult(data.data)
        } else {
          setError(data.error || 'Analysis failed')
        }
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error'
        alert('ERROR: ' + errorMsg)
        setError(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    reader.readAsDataURL(file)
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Test Analysis Page</h1>

      <div style={{ marginTop: '20px' }}>
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          style={{ fontSize: '18px', padding: '10px' }}
        />
      </div>

      {loading && (
        <div style={{ marginTop: '20px', fontSize: '20px', color: 'blue' }}>
          Loading... Please wait...
        </div>
      )}

      {error && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#ffcccc', color: 'red' }}>
          Error: {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#ccffcc' }}>
          <h2>Result:</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
