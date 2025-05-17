import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 전화번호에 하이픈을 자동으로 추가하는 함수
 * @param value 변환할 전화번호 문자열
 * @returns 하이픈이 추가된 전화번호 문자열
 */
export function formatPhoneNumber(value: string): string {
  // 숫자만 추출
  const numbers = value.replace(/[^\d]/g, "")
  
  // 자릿수에 따라 하이픈 추가
  if (numbers.length <= 3) {
    return numbers
  } else if (numbers.length <= 7) {
    return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
  } else {
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
  }
}
