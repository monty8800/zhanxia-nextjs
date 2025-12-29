'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Stat {
  id: number
  stat_label: string
  stat_value: string
  display_order: number
}

export default function StatsManagePage() {
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('site_stats')
        .select('*')
        .order('display_order')

      if (error) throw error
      setStats(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (id: number, field: 'stat_label' | 'stat_value', value: string) => {
    const updatedStats = stats.map(stat =>
      stat.id === id ? { ...stat, [field]: value } : stat
    )
    setStats(updatedStats)
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      
      // 批量更新所有统计数据
      const updates = stats.map(stat =>
        supabase
          .from('site_stats')
          .update({
            stat_label: stat.stat_label,
            stat_value: stat.stat_value
          })
          .eq('id', stat.id)
      )

      await Promise.all(updates)
      alert('保存成功！')
    } catch (err) {
      alert('保存失败：' + (err instanceof Error ? err.message : '未知错误'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        <span className="ml-4 text-gray-400">加载中...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">统计数据管理</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          编辑首页展示的统计数据
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, index) => (
          <div
            key={stat.id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300">
                统计项 {index + 1}
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                排序: {stat.display_order}
              </span>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                标签文字
              </label>
              <input
                type="text"
                value={stat.stat_label}
                onChange={(e) => handleUpdate(stat.id, 'stat_label', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="例如：满意客户"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                数值
              </label>
              <input
                type="text"
                value={stat.stat_value}
                onChange={(e) => handleUpdate(stat.id, 'stat_value', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-3xl font-bold text-center"
                placeholder="1000+"
              />
            </div>

            {/* Preview */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">预览效果：</p>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {stat.stat_value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {stat.stat_label}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          {saving ? '保存中...' : '保存所有更改'}
        </button>
      </div>

      {/* Help Text */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">💡 使用提示</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• 数值支持数字和文字，例如：1000+、500万+、99%</li>
          <li>• 修改后点击"保存所有更改"按钮一次性保存</li>
          <li>• 统计数据会显示在首页顶部</li>
          <li>• 建议使用简短有力的数字来展示成果</li>
        </ul>
      </div>
    </div>
  )
}
