// 페이지 방문 추적 데이터 수집 유틸리티

export interface PageViewData {
  // 시간 정보
  timestamp: string

  // URL 정보
  current_url: string
  referrer: string
  landing_page: string

  // UTM 파라미터 (마케팅 추적)
  utm_source: string
  utm_medium: string
  utm_campaign: string
  utm_term: string
  utm_content: string

  // 디바이스 정보
  device_type: string // Mobile, Desktop, Tablet
  screen_size: string // 예: 1920x1080
  viewport_size: string // 예: 1920x937

  // 브라우저 정보
  browser_language: string
  user_agent: string

  // 기본
  is_touch_device: boolean
  session_id: string

  // 참여도 지표 (추가)
  time_on_page?: number // 체류 시간 (초)
  max_scroll_depth?: number // 최대 스크롤 깊이 (%)
  scroll_25?: boolean
  scroll_50?: boolean
  scroll_75?: boolean
  scroll_100?: boolean
  clicks_count?: number
  form_interactions?: number

  // 네트워크 정보
  connection_type?: string
  connection_speed?: string

  // 배터리 정보
  battery_level?: number
  is_charging?: boolean

  // 행동 지표
  page_visibility_changes?: number
  was_active?: boolean
  exit_intent?: boolean
}

// URL에서 UTM 파라미터 추출
export function getUTMParams(): {
  utm_source: string
  utm_medium: string
  utm_campaign: string
  utm_term: string
  utm_content: string
} {
  if (typeof window === 'undefined') {
    return {
      utm_source: '',
      utm_medium: '',
      utm_campaign: '',
      utm_term: '',
      utm_content: ''
    }
  }

  const params = new URLSearchParams(window.location.search)

  return {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_term: params.get('utm_term') || '',
    utm_content: params.get('utm_content') || ''
  }
}

// User Agent에서 디바이스 타입 판별
export function getDeviceType(): string {
  if (typeof window === 'undefined') return 'Unknown'

  const ua = navigator.userAgent.toLowerCase()

  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'Tablet'
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) {
    return 'Mobile'
  }
  return 'Desktop'
}

// 화면 크기 정보
export function getScreenSize(): string {
  if (typeof window === 'undefined') return ''
  return `${screen.width}x${screen.height}`
}

// 뷰포트 크기 정보
export function getViewportSize(): string {
  if (typeof window === 'undefined') return ''
  return `${window.innerWidth}x${window.innerHeight}`
}

// 터치 디바이스 여부
export function isTouchDevice(): boolean {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

// 세션 ID 생성 또는 가져오기 (localStorage 활용)
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return ''

  const SESSION_KEY = 'pageview_session_id'
  const SESSION_DURATION = 30 * 60 * 1000 // 30분

  try {
    const stored = localStorage.getItem(SESSION_KEY)
    const storedTime = localStorage.getItem(`${SESSION_KEY}_time`)

    if (stored && storedTime) {
      const elapsed = Date.now() - parseInt(storedTime, 10)
      if (elapsed < SESSION_DURATION) {
        // 세션이 유효하면 시간 갱신
        localStorage.setItem(`${SESSION_KEY}_time`, Date.now().toString())
        return stored
      }
    }

    // 새 세션 생성
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`
    localStorage.setItem(SESSION_KEY, newSessionId)
    localStorage.setItem(`${SESSION_KEY}_time`, Date.now().toString())
    return newSessionId
  } catch (error) {
    // localStorage 사용 불가 시 임시 세션 ID
    return `temp_${Date.now()}`
  }
}

// 랜딩 페이지 URL 저장/가져오기
export function getLandingPage(): string {
  if (typeof window === 'undefined') return ''

  const LANDING_KEY = 'landing_page'

  try {
    const stored = localStorage.getItem(LANDING_KEY)
    if (!stored) {
      const currentUrl = window.location.href
      localStorage.setItem(LANDING_KEY, currentUrl)
      return currentUrl
    }
    return stored
  } catch (error) {
    return window.location.href
  }
}

// 이전 페이지 URL 저장/가져오기 (내부 페이지 이동 추적)
export function getPreviousPage(): string {
  if (typeof window === 'undefined') return ''

  const PREVIOUS_KEY = 'previous_page'
  const INITIAL_REFERRER_KEY = 'initial_referrer'

  try {
    // 현재 URL
    const currentUrl = window.location.href

    // 1순위: localStorage에 저장된 이전 페이지 (사이트 내부 이동)
    const storedPrevious = localStorage.getItem(PREVIOUS_KEY)

    // 2순위: 최초 방문 시 저장한 referrer
    const initialReferrer = localStorage.getItem(INITIAL_REFERRER_KEY)

    // 3순위: document.referrer (실시간)
    const documentReferrer = document.referrer

    console.log('🔍 Referrer 추적:', {
      storedPrevious,
      initialReferrer,
      documentReferrer,
      currentUrl
    })

    // 로직: localStorage의 이전 페이지가 있고, 현재 페이지와 다르면 사용
    if (storedPrevious && storedPrevious !== currentUrl) {
      console.log('✅ Using stored previous:', storedPrevious)
      return storedPrevious
    }

    // 최초 방문 시 저장한 referrer 사용
    if (initialReferrer && initialReferrer !== '직접 접속') {
      console.log('✅ Using initial referrer:', initialReferrer)
      return initialReferrer
    }

    // document.referrer 사용
    if (documentReferrer) {
      console.log('✅ Using document.referrer:', documentReferrer)
      // 최초 referrer로 저장 (다음에 사용)
      localStorage.setItem(INITIAL_REFERRER_KEY, documentReferrer)
      return documentReferrer
    }

    console.log('⚠️ No referrer found - 직접 접속')
    return '직접 접속'
  } catch (error) {
    console.error('getPreviousPage 오류:', error)
    return document.referrer || '직접 접속'
  }
}

// 현재 페이지를 이전 페이지로 저장 (다음 페이지 이동을 위해)
export function saveCurrentPageAsPrevious(): void {
  if (typeof window === 'undefined') return

  const PREVIOUS_KEY = 'previous_page'
  const currentUrl = window.location.href

  try {
    localStorage.setItem(PREVIOUS_KEY, currentUrl)
  } catch (error) {
    console.error('이전 페이지 저장 실패:', error)
  }
}

// 네트워크 정보 수집
export function getNetworkInfo(): { connectionType: string; connectionSpeed: string } {
  if (typeof window === 'undefined' || !('connection' in navigator)) {
    return { connectionType: '', connectionSpeed: '' }
  }

  try {
    const conn = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection

    if (!conn) {
      return { connectionType: '', connectionSpeed: '' }
    }

    return {
      connectionType: conn.type || conn.effectiveType || '',
      connectionSpeed: conn.effectiveType || ''
    }
  } catch (error) {
    return { connectionType: '', connectionSpeed: '' }
  }
}

// 배터리 정보 수집
export async function getBatteryInfo(): Promise<{ batteryLevel: number; isCharging: boolean }> {
  if (typeof window === 'undefined' || !('getBattery' in navigator)) {
    return { batteryLevel: 0, isCharging: false }
  }

  try {
    const battery = await (navigator as any).getBattery()
    return {
      batteryLevel: Math.round(battery.level * 100),
      isCharging: battery.charging
    }
  } catch (error) {
    return { batteryLevel: 0, isCharging: false }
  }
}

// 모든 페이지뷰 데이터 수집 (기본 + 네트워크)
export function collectPageViewData(): PageViewData {
  const utmParams = getUTMParams()
  const networkInfo = getNetworkInfo()

  return {
    timestamp: new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' }),
    current_url: typeof window !== 'undefined' ? window.location.href : '',
    referrer: getPreviousPage(), // 개선: localStorage 우선, document.referrer 후순위
    landing_page: getLandingPage(),
    utm_source: utmParams.utm_source,
    utm_medium: utmParams.utm_medium,
    utm_campaign: utmParams.utm_campaign,
    utm_term: utmParams.utm_term,
    utm_content: utmParams.utm_content,
    device_type: getDeviceType(),
    screen_size: getScreenSize(),
    viewport_size: getViewportSize(),
    browser_language: typeof window !== 'undefined' ? navigator.language : '',
    user_agent: typeof window !== 'undefined' ? navigator.userAgent : '',
    is_touch_device: isTouchDevice(),
    session_id: getOrCreateSessionId(),

    // 네트워크 정보
    connection_type: networkInfo.connectionType,
    connection_speed: networkInfo.connectionSpeed,

    // 참여도 지표는 나중에 업데이트됨
    time_on_page: 0,
    max_scroll_depth: 0,
    scroll_25: false,
    scroll_50: false,
    scroll_75: false,
    scroll_100: false,
    clicks_count: 0,
    form_interactions: 0,
    page_visibility_changes: 0,
    was_active: true,
    exit_intent: false
  }
}

// 사용자 참여도 추적 클래스
export class EngagementTracker {
  private startTime: number
  private maxScrollDepth: number = 0
  private scrollMilestones: { [key: number]: boolean } = {
    25: false,
    50: false,
    75: false,
    100: false
  }
  private clicksCount: number = 0
  private formInteractions: number = 0
  private visibilityChanges: number = 0
  private wasActive: boolean = true
  private exitIntent: boolean = false
  private listeners: (() => void)[] = []

  constructor() {
    this.startTime = Date.now()
    this.setupListeners()
  }

  private setupListeners() {
    if (typeof window === 'undefined') return

    // 스크롤 추적
    const handleScroll = () => {
      const scrollDepth = this.calculateScrollDepth()
      if (scrollDepth > this.maxScrollDepth) {
        this.maxScrollDepth = scrollDepth

        // 마일스톤 체크
        ;[25, 50, 75, 100].forEach(milestone => {
          if (scrollDepth >= milestone && !this.scrollMilestones[milestone]) {
            this.scrollMilestones[milestone] = true
            console.log(`📍 스크롤 ${milestone}% 도달`)
          }
        })
      }
    }

    // 클릭 추적
    const handleClick = () => {
      this.clicksCount++
    }

    // 폼 인터랙션 추적
    const handleFormInteraction = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        this.formInteractions++
      }
    }

    // 페이지 가시성 변경 추적
    const handleVisibilityChange = () => {
      if (document.hidden) {
        this.visibilityChanges++
        this.wasActive = false
      }
    }

    // 이탈 의도 감지 (마우스가 브라우저 상단으로)
    const handleMouseOut = (e: MouseEvent) => {
      if (e.clientY <= 0 && !this.exitIntent) {
        this.exitIntent = true
        console.log('⚠️ 이탈 의도 감지')
      }
    }

    // 이벤트 리스너 등록
    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('click', handleClick)
    document.addEventListener('focus', handleFormInteraction, true)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('mouseout', handleMouseOut)

    // cleanup 함수 저장
    this.listeners.push(() => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('click', handleClick)
      document.removeEventListener('focus', handleFormInteraction, true)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('mouseout', handleMouseOut)
    })
  }

  private calculateScrollDepth(): number {
    const windowHeight = window.innerHeight
    const documentHeight = document.documentElement.scrollHeight
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    const scrollableHeight = documentHeight - windowHeight
    if (scrollableHeight <= 0) return 100

    return Math.round((scrollTop / scrollableHeight) * 100)
  }

  // 현재 참여도 데이터 가져오기
  public getEngagementData() {
    const timeOnPage = Math.round((Date.now() - this.startTime) / 1000)

    return {
      time_on_page: timeOnPage,
      max_scroll_depth: this.maxScrollDepth,
      scroll_25: this.scrollMilestones[25],
      scroll_50: this.scrollMilestones[50],
      scroll_75: this.scrollMilestones[75],
      scroll_100: this.scrollMilestones[100],
      clicks_count: this.clicksCount,
      form_interactions: this.formInteractions,
      page_visibility_changes: this.visibilityChanges,
      was_active: this.wasActive,
      exit_intent: this.exitIntent
    }
  }

  // 리스너 정리
  public cleanup() {
    this.listeners.forEach(cleanup => cleanup())
  }
}
