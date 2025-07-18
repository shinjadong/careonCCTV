-- RLS 정책 추가 마이그레이션
-- 2025-01-02: kt-cctv-legacy 테이블에 RLS 정책 추가

-- kt-cctv-legacy 테이블에 INSERT 정책 추가
CREATE POLICY "Enable insert for all users" ON "kt-cctv-legacy"
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 기존 정책 확인을 위해 SELECT 정책도 추가
CREATE POLICY "Enable select for all users" ON "kt-cctv-legacy"
FOR SELECT
TO anon, authenticated
USING (true);

-- UPDATE 정책도 추가 (필요시)
CREATE POLICY "Enable update for all users" ON "kt-cctv-legacy"
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 정책 적용 확인
COMMENT ON POLICY "Enable insert for all users" ON "kt-cctv-legacy" IS 'RLS 정책: 모든 사용자(anon, authenticated)가 새로운 행을 삽입할 수 있도록 허용';
COMMENT ON POLICY "Enable select for all users" ON "kt-cctv-legacy" IS 'RLS 정책: 모든 사용자가 데이터를 조회할 수 있도록 허용';
COMMENT ON POLICY "Enable update for all users" ON "kt-cctv-legacy" IS 'RLS 정책: 모든 사용자가 데이터를 수정할 수 있도록 허용'; 