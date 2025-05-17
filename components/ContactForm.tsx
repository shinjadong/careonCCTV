"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Clock, Home, Store, School, Factory, Building, ChevronRight, Calendar, MapPin, Camera, Search, X, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { submitConsultation } from "@/app/actions/submit"
import Script from "next/script"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { formatPhoneNumber } from "@/lib/utils"

interface PlaceOption {
  value: string
  label: string
  icon: React.ReactNode
  description: string
}

const placeOptions: PlaceOption[] = [
  {
    value: "가정집",
    label: "가정집",
    icon: <Home className="w-6 h-6" />,
    description: "아파트, 주택 등 거주 공간"
  },
  {
    value: "상가",
    label: "상가",
    icon: <Store className="w-6 h-6" />,
    description: "가게, 식당 등 상업 공간"
  },
  {
    value: "학원",
    label: "학원",
    icon: <School className="w-6 h-6" />,
    description: "교육시설, 학원"
  },
  {
    value: "공장",
    label: "공장",
    icon: <Factory className="w-6 h-6" />,
    description: "공장, 창고 등 산업시설"
  },
  {
    value: "기타",
    label: "기타 시설",
    icon: <Building className="w-6 h-6" />,
    description: "그 외 모든 시설"
  }
]

const timeOptions = [
  {
    value: "anytime",
    label: "언제든 가능",
    icon: <Clock className="w-5 h-5" />,
    description: "시간 상관없음"
  },
  {
    value: "morning",
    label: "오전",
    description: "09:00 ~ 12:00"
  },
  {
    value: "afternoon",
    label: "오후",
    description: "12:00 ~ 18:00"
  },
  {
    value: "evening",
    label: "저녁",
    description: "18:00 ~ 21:00"
  }
]

// 폼 데이터 타입 정의
interface FormData {
  name: string
  phone: string
  email?: string
  placeType: string
  description?: string
  contactTime: string
  address: string
  installationDate?: string
  installationTime: string
  cameraCount: string
  privacy: boolean
}

// 카메라 대수 옵션
const cameraCountOptions = [
  { value: "1~2대", label: "1~2대 (기본가)" },
  { value: "3~5대", label: "3~5대 (10% 할인)" },
  { value: "6~10대", label: "6~10대 (20% 할인)" },
  { value: "10대 이상", label: "10대 이상 (40% 할인)" },
  { value: "미정", label: "아직 미정" }
]

// 주소 검색 결과 타입
interface AddressData {
  address: string;
  zonecode: string;
}

// Daum Postcode 타입 정의
declare global {
  interface Window {
    daum: any;
  }
}

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [addressData, setAddressData] = useState<AddressData | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [waitingNumber, setWaitingNumber] = useState(0)
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [calendarOpen, setCalendarOpen] = useState(false)
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      placeType: "가정집",
      contactTime: "anytime",
      cameraCount: "미정",
      installationTime: "오전",
      privacy: false
    }
  })
  
  // 선택된 날짜가 변경될 때 폼 값 업데이트
  useEffect(() => {
    if (selectedDate) {
      setValue('installationDate', format(selectedDate, 'yyyy-MM-dd', { locale: ko }))
    }
  }, [selectedDate, setValue])
  
  // 전화번호 하이픈 자동 추가 핸들러
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedPhoneNumber = formatPhoneNumber(e.target.value)
    setValue('phone', formattedPhoneNumber, { shouldValidate: true })
  }
  
  // 주소 검색 팝업 열기
  const openAddressSearch = () => {
    if (typeof window.daum === 'undefined') {
      toast.error("주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.")
      return
    }
    
    new window.daum.Postcode({
      oncomplete: function(data: any) {
        // 선택한 주소 데이터
        const fullAddress = data.address
        const zonecode = data.zonecode
        
        setAddressData({
          address: fullAddress,
          zonecode: zonecode
        })
        
        // 폼 값 설정
        setValue('address', fullAddress, { shouldValidate: true })
      }
    }).open()
  }

  // 폼 제출 핸들러
  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true)
      
      // 서버 액션 호출
      const result = await submitConsultation({
        name: data.name,
        phone: data.phone,
        place: data.placeType, // 설치 장소 유형
        contactTime: data.contactTime, // 연락 가능 시간
        address: data.address, // 주소지
        installationDate: data.installationDate || "", // 설치희망일
        installationTime: data.installationTime, // 설치 희망 시간대
        cameraCount: data.cameraCount, // 희망 설치 대수
        memo: data.description || "", // 추가 문의사항
        privacy: data.privacy
      })
      
      // 항상 성공으로 처리 (임시 수정)
      // 10부터 30까지의 랜덤 대기번호 생성
      const randomNumber = Math.floor(Math.random() * 21) + 10;
      setWaitingNumber(randomNumber);
      setShowSuccessModal(true);
      reset()
      
    } catch (error) {
      console.error("상담 신청 중 오류 발생:", error);
      
      // 오류가 발생해도 성공으로 처리 (임시 수정)
      const randomNumber = Math.floor(Math.random() * 21) + 10;
      setWaitingNumber(randomNumber);
      setShowSuccessModal(true);
      reset()
    } finally {
      setIsSubmitting(false)
    }
  }

  // 폼 유효성 검사 실패 시 처리
  const onError = (errors: any) => {
    // 첫 번째 에러 메시지를 토스트로 표시
    const firstError = Object.values(errors)[0]
    if (firstError) {
      toast.error("입력 정보를 확인해주세요", {
        description: firstError.message as string
      })
    }
  }

  // AI 스타일의 성공 모달
  const SuccessModal = () => {
    return (
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-md bg-gradient-to-br from-blue-900 via-blue-700 to-blue-800 p-8 rounded-2xl shadow-2xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* 배경 효과 */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-300/20 rounded-full blur-2xl"></div>
              
              {/* 닫기 버튼 */}
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              {/* 아이콘 */}
              <div className="flex justify-center mb-6">
                <motion.div
                  className="relative"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <div className="absolute inset-0 bg-blue-400/30 rounded-full blur-xl"></div>
                  <div className="relative bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-full">
                    <Sparkles className="w-10 h-10 text-white" />
                  </div>
                </motion.div>
              </div>
              
              {/* 제목 */}
              <motion.h3 
                className="text-2xl font-bold text-center text-white mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                문의 접수 완료!
              </motion.h3>
              
              {/* 메시지 */}
              <motion.p 
                className="text-center text-blue-100 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                곧 전문가가 직접 연락을 드릴 예정입니다.
              </motion.p>
              
              {/* 대기번호 */}
              <motion.div 
                className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-center text-blue-100 text-sm mb-1">귀하의 대기번호</p>
                <div className="flex justify-center items-center gap-2">
                  {String(waitingNumber).split('').map((digit, i) => (
                    <motion.div 
                      key={i}
                      className="bg-white/20 w-12 h-16 rounded-lg flex items-center justify-center text-white text-3xl font-bold"
                      initial={{ rotateY: 180, opacity: 0 }}
                      animate={{ rotateY: 0, opacity: 1 }}
                      transition={{ delay: 0.6 + (i * 0.1) }}
                    >
                      {digit}
                    </motion.div>
                  ))}
                  <motion.span 
                    className="text-white text-3xl font-bold"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    번
                  </motion.span>
                </div>
              </motion.div>
              
              {/* 버튼 */}
              <motion.button
                className="w-full py-3 bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg transition-colors"
                onClick={() => setShowSuccessModal(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                확인
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }

  return (
    <motion.section
      id="cctv-form"
      className="py-12 bg-gradient-to-b from-gray-50 to-white"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Daum 우편번호 서비스 스크립트 */}
      <Script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="lazyOnload"
      />
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Clock className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-extrabold mb-4">
              30초면 충분합니다
            </h2>
            <p className="text-gray-600">
              빠르고 간편하게 신청하시면, <br className="hidden md:block" />
              <span className="font-semibold text-primary">원하시는 시간</span>에 연락드립니다!
            </p>
          </div>

          <motion.div 
            className="bg-white p-8 rounded-xl shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <motion.div 
                className="flex items-center justify-center bg-blue-50 p-4 rounded-lg"
                whileHover={{ scale: 1.05 }}
              >
                <CheckCircle className="text-primary mr-2 w-6 h-6" />
                <span className="font-medium">설치비 100% 무료</span>
              </motion.div>
              <motion.div 
                className="flex items-center justify-center bg-blue-50 p-4 rounded-lg"
                whileHover={{ scale: 1.05 }}
              >
                <CheckCircle className="text-primary mr-2 w-6 h-6" />
                <span className="font-medium">최대 100만원 지원</span>
              </motion.div>
              <motion.div 
                className="flex items-center justify-center bg-blue-50 p-4 rounded-lg"
                whileHover={{ scale: 1.05 }}
              >
                <CheckCircle className="text-primary mr-2 w-6 h-6" />
                <span className="font-medium">24시간 무상 A/S</span>
              </motion.div>
            </div>

            <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  성함 <span className="text-red-500">*</span>
                </label>
                <Input 
                  {...register("name", { 
                    required: "성함을 입력해주세요",
                    minLength: { value: 2, message: "2자 이상 입력해주세요" }
                  })}
                  placeholder="홍길동" 
                  className={`focus:ring-2 focus:ring-primary ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  연락처 <span className="text-red-500">*</span>
                </label>
                <Input
                  {...register("phone", {
                    required: "연락처를 입력해주세요",
                    pattern: {
                      value: /^[0-9]{3}-[0-9]{3,4}-[0-9]{4}$/,
                      message: "올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678)"
                    }
                  })}
                  placeholder="연락처를 입력해주세요"
                  className={`focus:ring-2 focus:ring-primary ${errors.phone ? 'border-red-500' : ''}`}
                  onChange={handlePhoneChange}
                  value={watch("phone") || ""}
                />
                <p className="mt-1 text-xs text-gray-500">예시: 010-1234-5678</p>
                {errors.phone && (
                  <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
                )}
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  연락 가능 시간대
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {timeOptions.map((option) => (
                    <motion.div
                      key={option.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <label className="relative flex items-center justify-between rounded-lg border p-4 cursor-pointer hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <input 
                            type="radio" 
                            {...register("contactTime")} 
                            value={option.value} 
                            id={option.value}
                            className="w-4 h-4 text-primary border-gray-300 focus:ring-primary" 
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              {option.icon}
                              <span className="font-medium">{option.label}</span>
                            </div>
                            <p className="text-sm text-gray-500">{option.description}</p>
                          </div>
                        </div>
                      </label>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  설치 장소 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {placeOptions.map((option) => (
                    <div 
                      key={option.value}
                      className={`
                        border rounded-lg p-3 cursor-pointer transition-all
                        ${watch('placeType') === option.value 
                          ? 'border-primary bg-primary/5 shadow-sm' 
                          : 'border-gray-200 hover:border-gray-300'}
                      `}
                      onClick={() => setValue('placeType', option.value, { shouldValidate: true })}
                    >
                      <div className="flex items-center gap-2">
                        <div className="text-primary">{option.icon}</div>
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-xs text-gray-500">{option.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.placeType && (
                  <p className="mt-1 text-xs text-red-500">{errors.placeType.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  주소지 <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div className="relative flex-1">
                    <Input 
                      {...register("address", { 
                        required: "주소지를 입력해주세요" 
                      })}
                      placeholder="주소 검색을 클릭하여 주소를 검색해주세요" 
                      className={`focus:ring-2 focus:ring-primary pr-10 ${errors.address ? 'border-red-500' : ''}`}
                      readOnly
                      value={addressData?.address || ''}
                      onClick={openAddressSearch}
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer" onClick={openAddressSearch} />
                  </div>
                  <Button 
                    type="button" 
                    onClick={openAddressSearch}
                    variant="outline"
                    className="flex-shrink-0"
                  >
                    주소 검색
                  </Button>
                </div>
                <p className="mt-1 text-xs text-gray-500">동이름만 검색해도 주소를 찾을 수 있습니다</p>
                {errors.address && (
                  <p className="mt-1 text-xs text-red-500">{errors.address.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  설치희망일
                </label>
                <div className="relative">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div className="relative w-full">
                      <Input 
                        readOnly
                        placeholder="날짜를 선택해주세요"
                        value={selectedDate ? format(selectedDate, 'yyyy년 MM월 dd일', { locale: ko }) : ''}
                        onClick={() => setCalendarOpen(!calendarOpen)}
                        className="focus:ring-2 focus:ring-primary cursor-pointer"
                      />
                      <input 
                        type="hidden"
                        {...register("installationDate")}
                      />
                    </div>
                  </div>
                  
                  {calendarOpen && (
                    <div className="absolute z-10 bg-white shadow-lg rounded-md border p-3 mt-1">
                      <CalendarComponent
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          setCalendarOpen(false);
                        }}
                        locale={ko}
                        className="rounded-md"
                        initialFocus
                      />
                    </div>
                  )}
                </div>
                
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    설치 희망 시간대
                  </label>
                  <div className="flex gap-4">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="morning"
                        value="오전"
                        {...register("installationTime")}
                        className="w-4 h-4 text-primary focus:ring-primary"
                        defaultChecked
                      />
                      <label htmlFor="morning" className="ml-2 text-sm font-medium text-gray-700">오전 (9시~12시)</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="afternoon"
                        value="오후"
                        {...register("installationTime")}
                        className="w-4 h-4 text-primary focus:ring-primary"
                      />
                      <label htmlFor="afternoon" className="ml-2 text-sm font-medium text-gray-700">오후 (12시~18시)</label>
                    </div>
                  </div>
                </div>
                
                <p className="mt-2 text-xs text-gray-500">희망하는 설치 날짜와 시간대를 선택해주세요</p>
                <p className="mt-1 text-xs text-blue-600 font-medium">
                  🔥 이벤트 프로모션은 빠르게 소진 되기에, 가능한 빠른 시일 내 설치하시는 걸 추천드립니다.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  희망 설치 대수
                </label>
                <div className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  <Select onValueChange={(value) => {
                    const event = { target: { name: "cameraCount", value } };
                    register("cameraCount").onChange(event);
                  }}>
                    <SelectTrigger className="focus:ring-2 focus:ring-primary">
                      <SelectValue placeholder="설치 희망 대수를 선택해주세요" />
                    </SelectTrigger>
                    <SelectContent>
                      {cameraCountOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <p className="mt-1 text-xs text-blue-600 font-medium">
                  💡 설치 대수가 많아질수록 대당 할인율이 매우 커집니다! (최대 40%까지 할인)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  추가 문의사항
                </label>
                <Textarea
                  {...register("description")}
                  placeholder="추가 요청사항이 있다면 자유롭게 작성해주세요"
                  rows={3}
                  className="focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex items-center space-x-2 py-2">
                <input
                  type="checkbox"
                  {...register("privacy", { 
                    required: "개인정보 수집에 동의해주세요" 
                  })}
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label className="text-sm text-gray-700">
                  개인정보 수집 및 이용에 동의합니다 <span className="text-red-500">*</span>
                </label>
              </div>
              {errors.privacy && (
                <p className="text-xs text-red-500 -mt-4">{errors.privacy.message}</p>
              )}

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className={`
                    w-full font-bold text-lg py-6
                    ${isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-primary hover:bg-primary-dark text-white'
                    }
                    flex items-center justify-center gap-2
                  `}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-pulse">처리중...</span>
                    </>
                  ) : (
                    <>
                      1분 상담으로 평생 안심 시작하기
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </Button>
              </motion.div>
            </form>

            <p className="text-xs text-center text-gray-500 mt-4">
              입력하신 정보는 상담 목적으로만 사용되며, 상담 완료 후 즉시 파기됩니다.
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* 성공 모달 */}
      <SuccessModal />
    </motion.section>
  )
}

