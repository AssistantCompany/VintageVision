import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface CollectionCounts {
  collection: number
  wishlist: number
}

export function useCollectionCounts() {
  const { user } = useAuth()
  const [counts, setCounts] = useState<CollectionCounts>({ collection: 0, wishlist: 0 })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCounts = async () => {
    if (!user) {
      setCounts({ collection: 0, wishlist: 0 })
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/collection/counts', {
        credentials: 'include',
      })

      const data = await response.json()

      if (data.success) {
        setCounts(data.data)
      } else {
        setError(data.error || 'Failed to fetch counts')
      }
    } catch (err) {
      console.error('Error fetching collection counts:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCounts()
  }, [user])

  return {
    counts,
    loading,
    error,
    refetch: fetchCounts,
  }
}
