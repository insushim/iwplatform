-- EduMakers seed data
-- 10개 카테고리 · 8개 뱃지 (실제 데이터, 목업 아님)

INSERT OR IGNORE INTO categories (slug, name, description, icon, color, display_order, is_active) VALUES
  ('ai-classroom', 'AI 수업', 'AI를 활용한 수업 사례와 실천기, 교구 공유', '🤖', '#4F46E5', 1, 1),
  ('prompt-lab', '프롬프트 실험실', '교사들이 만든 AI 프롬프트 공유와 토론', '🧪', '#8B5CF6', 2, 1),
  ('maker-diary', '메이커 일기', '앱·SaaS 개발기와 바이브코딩 실천', '🛠️', '#F59E0B', 3, 1),
  ('class-life', '학급 운영', '교실 이야기, 학생 관계, 상담', '🏫', '#10B981', 4, 1),
  ('eval-feedback', '평가와 피드백', 'AI 기반 평가와 서술형 피드백 노하우', '📝', '#EF4444', 5, 1),
  ('lesson-share', '수업자료', '수업지도안·활동지·자료 나눔', '📚', '#3B82F6', 6, 1),
  ('qna', 'Q&A', '질문과 답변', '💬', '#6366F1', 7, 1),
  ('free-board', '자유게시판', '교사들의 일상과 잡담', '☕', '#64748B', 8, 1),
  ('news', '교육 뉴스', '교육 정책과 AI 동향', '📰', '#0EA5E9', 9, 1),
  ('jobs-events', '연수·행사', '교사 연수와 세미나, 모임', '🎫', '#F97316', 10, 1);

INSERT OR IGNORE INTO badges (slug, name, description, icon_url, rarity, points, criteria, is_active) VALUES
  ('first-post', '첫 번째 발자국', '첫 게시글을 작성했습니다', '/badges/first-post.svg', 'common', 10, '{"type":"post_count","value":1}', 1),
  ('verified-teacher', '인증 교사', '교원 인증을 완료했습니다', '/badges/verified.svg', 'common', 50, '{"type":"teacher_verified"}', 1),
  ('prompt-master', '프롬프트 마스터', '프롬프트 10개 이상 공유', '/badges/prompt-master.svg', 'rare', 200, '{"type":"prompt_count","value":10}', 1),
  ('maker-debut', '메이커 데뷔', '첫 앱/SaaS를 런치했습니다', '/badges/maker-debut.svg', 'rare', 150, '{"type":"showcase_launched","value":1}', 1),
  ('helpful-hand', '친절한 손길', '답변 50개 이상 작성', '/badges/helpful.svg', 'rare', 300, '{"type":"helpful_answers","value":50}', 1),
  ('hot-streak', '열정 교사', '30일 연속 접속', '/badges/streak.svg', 'epic', 500, '{"type":"login_streak","value":30}', 1),
  ('community-builder', '커뮤니티 빌더', '인디모임 창설 + 회원 50명 이상', '/badges/builder.svg', 'epic', 1000, '{"type":"group_founder"}', 1),
  ('legendary-educator', '전설의 교육자', '카르마 10,000 달성', '/badges/legendary.svg', 'legendary', 2000, '{"type":"karma","value":10000}', 1);

INSERT OR IGNORE INTO tags (slug, name, description, is_featured) VALUES
  ('ai-tutor', 'AI 튜터', 'AI 튜터 활용 사례', 1),
  ('claude', 'Claude', 'Anthropic Claude', 1),
  ('gpt', 'GPT', 'OpenAI GPT', 1),
  ('gemini', 'Gemini', 'Google Gemini', 1),
  ('elementary', '초등', '초등학교 관련', 1),
  ('middle', '중등', '중학교 관련', 1),
  ('high', '고등', '고등학교 관련', 1),
  ('math', '수학', '수학 교과', 0),
  ('korean', '국어', '국어 교과', 0),
  ('science', '과학', '과학 교과', 0),
  ('prompt', '프롬프트', '프롬프트 관련', 1),
  ('vibe-coding', '바이브코딩', 'AI 도움받아 코딩하기', 1),
  ('saas', 'SaaS', '교사 개발 SaaS', 1),
  ('assessment', '평가', '평가·피드백', 0),
  ('classroom', '학급', '학급 운영', 0);
