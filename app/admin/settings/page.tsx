'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { FaSave, FaInfoCircle } from 'react-icons/fa'

interface Setting {
  id: number
  setting_key: string
  setting_value: string
  setting_type: string
  category: string
  description: string
  is_public: boolean
}

interface GroupedSettings {
  [category: string]: Setting[]
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [groupedSettings, setGroupedSettings] = useState<GroupedSettings>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const categoryNames: { [key: string]: string } = {
    general: '基本设置',
    contact: '联系方式',
    social: '社交媒体',
    seo: 'SEO设置',
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('category')
        .order('setting_key')

      if (error) throw error

      setSettings(data || [])
      
      // 按分类分组
      const grouped = (data || []).reduce((acc: GroupedSettings, setting: Setting) => {
        if (!acc[setting.category]) {
          acc[setting.category] = []
        }
        acc[setting.category].push(setting)
        return acc
      }, {})
      
      setGroupedSettings(grouped)
    } catch (err) {
      setError(err instanceof Error ? err.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = (id: number, value: string) => {
    setSettings(settings.map(s => 
      s.id === id ? { ...s, setting_value: value } : s
    ))
    
    // 同时更新分组数据
    const newGrouped = { ...groupedSettings }
    Object.keys(newGrouped).forEach(category => {
      newGrouped[category] = newGrouped[category].map(s =>
        s.id === id ? { ...s, setting_value: value } : s
      )
    })
    setGroupedSettings(newGrouped)
  }

  const handleSaveAll = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      
      // 批量更新所有设置
      const updates = settings.map(setting =>
        supabase
          .from('site_settings')
          .update({ setting_value: setting.setting_value })
          .eq('id', setting.id)
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
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">系统设置</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            管理站点全局配置信息
          </p>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg"
        >
          <FaSave />
          <span>{saving ? '保存中...' : '保存所有更改'}</span>
        </button>
      </div>
  
      {/* Error Message */}
      {error && (
        <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      )}
  
      {/* Help Info - 移到顶部 */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <div className="flex gap-3">
          <FaInfoCircle className="text-blue-600 dark:text-blue-400 text-xl flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">使用说明</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1">
              <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <li>• <strong>基本设置</strong>: 网站名称、描述等基础信息</li>
                <li>• <strong>联系方式</strong>: 电话、邮箱、微信等联系方式</li>
              </ul>
              <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                <li>• <strong>社交媒体</strong>: 各社交平台账号信息</li>
                <li>• <strong>SEO设置</strong>: 搜索引擎优化相关配置</li>
              </ul>
            </div>
            <p className="text-sm text-blue-700 dark:text-blue-400 mt-2">
              ⚡ 标记为“公开”的设置会在前台页面显示 · 修改后记得点击“保存所有更改”按钮
            </p>
          </div>
        </div>
      </div>
  
      {/* Settings Grid - 2列布局 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.keys(groupedSettings).map(category => (
          <div key={category} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            {/* Category Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">
                {categoryNames[category] || category}
              </h2>
              <p className="text-purple-100 text-sm mt-1">
                {groupedSettings[category].length} 个配置项
              </p>
            </div>
  
            {/* Settings List */}
            <div className="p-6 space-y-5">
              {groupedSettings[category].map(setting => (
                <div key={setting.id} className="space-y-2 pb-4 border-b border-gray-100 dark:border-gray-700 last:border-0 last:pb-0">
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {setting.description || setting.setting_key}
                    </label>
                    {setting.is_public && (
                      <span className="px-2 py-0.5 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full font-medium">
                        公开
                      </span>
                    )}
                  </div>
  
                  {setting.setting_type === 'boolean' ? (
                    <select
                      value={setting.setting_value}
                      onChange={(e) => handleUpdate(setting.id, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="true">是</option>
                      <option value="false">否</option>
                    </select>
                  ) : setting.setting_value && setting.setting_value.length > 100 ? (
                    <textarea
                      value={setting.setting_value}
                      onChange={(e) => handleUpdate(setting.id, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                      rows={3}
                      placeholder={`输入${setting.description}...`}
                    />
                  ) : (
                    <input
                      type="text"
                      value={setting.setting_value || ''}
                      onChange={(e) => handleUpdate(setting.id, e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder={`输入${setting.description}...`}
                    />
                  )}
  
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {setting.setting_key}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
  
      {/* Save Button (Bottom) */}
      <div className="sticky bottom-6 flex justify-center">
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-2xl"
        >
          <FaSave className="text-lg" />
          <span>{saving ? '保存中...' : '保存所有更改'}</span>
        </button>
      </div>
    </div>
  )
}
