'use client'

import { usePathname } from 'next/navigation'
import Navigation from './Navigation'

export default function ConditionalNavigation() {
  const pathname = usePathname()
  
  // 管理后台、登录页、认证检查页不显示导航
  const hideNavigation = pathname?.startsWith('/admin') || 
                        pathname === '/login' || 
                        pathname === '/check-auth'
  
  if (hideNavigation) {
    return null
  }
  
  return <Navigation />
}
