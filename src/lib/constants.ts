/**
 * EduMakers 전역 상수.
 * 카테고리, 뱃지, Trust Level, 포인트 등.
 */

export const SITE = {
  name: "EduMakers",
  nameKo: "에듀메이커스",
  tagline: "선생님들이 만들고, 선생님들이 나누는 AI 놀이터",
  taglineEn: "Where Teachers Build, Share, and Grow with AI",
  url: "https://edumakers.pages.dev",
  domain: "edumakers.pages.dev",
  twitter: "@edumakers",
  githubRepo: "https://github.com/iw-lab/iwplatform",
} as const;

export const CATEGORIES: ReadonlyArray<{
  slug: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}> = [
  {
    slug: "ai-classroom",
    name: "AI 수업",
    description: "AI를 활용한 수업 사례와 실천기, 교구 공유",
    icon: "🤖",
    color: "#4F46E5",
  },
  {
    slug: "prompt-lab",
    name: "프롬프트 실험실",
    description: "교사들이 만든 AI 프롬프트 공유와 토론",
    icon: "🧪",
    color: "#8B5CF6",
  },
  {
    slug: "maker-diary",
    name: "메이커 일기",
    description: "앱·SaaS 개발기와 바이브코딩 실천",
    icon: "🛠️",
    color: "#F59E0B",
  },
  {
    slug: "class-life",
    name: "학급 운영",
    description: "교실 이야기, 학생 관계, 상담",
    icon: "🏫",
    color: "#10B981",
  },
  {
    slug: "eval-feedback",
    name: "평가와 피드백",
    description: "AI 기반 평가와 서술형 피드백 노하우",
    icon: "📝",
    color: "#EF4444",
  },
  {
    slug: "lesson-share",
    name: "수업자료",
    description: "수업지도안·활동지·자료 나눔",
    icon: "📚",
    color: "#3B82F6",
  },
  {
    slug: "qna",
    name: "Q&A",
    description: "질문과 답변",
    icon: "💬",
    color: "#6366F1",
  },
  {
    slug: "free-board",
    name: "자유게시판",
    description: "교사들의 일상과 잡담",
    icon: "☕",
    color: "#64748B",
  },
  {
    slug: "news",
    name: "교육 뉴스",
    description: "교육 정책과 AI 동향",
    icon: "📰",
    color: "#0EA5E9",
  },
  {
    slug: "jobs-events",
    name: "연수·행사",
    description: "교사 연수와 세미나, 모임",
    icon: "🎫",
    color: "#F97316",
  },
];

export const BADGES: ReadonlyArray<{
  slug: string;
  name: string;
  description: string;
  rarity: "common" | "rare" | "epic" | "legendary";
  points: number;
}> = [
  { slug: "first-post", name: "첫 번째 발자국", description: "첫 게시글을 작성했습니다", rarity: "common", points: 10 },
  { slug: "verified-teacher", name: "인증 교사", description: "교원 인증을 완료했습니다", rarity: "common", points: 50 },
  { slug: "prompt-master", name: "프롬프트 마스터", description: "프롬프트 10개 이상 공유", rarity: "rare", points: 200 },
  { slug: "maker-debut", name: "메이커 데뷔", description: "첫 앱/SaaS를 런치했습니다", rarity: "rare", points: 150 },
  { slug: "helpful-hand", name: "친절한 손길", description: "답변 50개 이상 작성", rarity: "rare", points: 300 },
  { slug: "hot-streak", name: "열정 교사", description: "30일 연속 접속", rarity: "epic", points: 500 },
  { slug: "community-builder", name: "커뮤니티 빌더", description: "인디모임 창설 + 50명 이상", rarity: "epic", points: 1000 },
  { slug: "legendary-educator", name: "전설의 교육자", description: "카르마 10,000 달성", rarity: "legendary", points: 2000 },
];

export const TRUST_LEVELS = {
  new: { label: "새내기", color: "#94A3B8", minKarma: 0 },
  basic: { label: "회원", color: "#64748B", minKarma: 50 },
  member: { label: "정회원", color: "#4F46E5", minKarma: 500 },
  veteran: { label: "베테랑", color: "#F59E0B", minKarma: 2500 },
  leader: { label: "리더", color: "#DC2626", minKarma: 10000 },
} as const;

export const KARMA_POINTS = {
  POST_UPVOTED: 5,
  POST_DOWNVOTED: -1,
  COMMENT_UPVOTED: 2,
  COMMENT_DOWNVOTED: -1,
  ANSWER_ACCEPTED: 15,
  POST_CREATED: 1,
  COMMENT_CREATED: 1,
  SHOWCASE_LAUNCHED: 25,
  SHOWCASE_UPVOTED: 3,
  FOLLOWED: 1,
  TEACHER_VERIFIED: 50,
} as const;

export const SHOWCASE_CATEGORIES = [
  { slug: "ai-lesson", label: "AI 수업 도구" },
  { slug: "class-mgmt", label: "학급 관리" },
  { slug: "eval", label: "평가/피드백" },
  { slug: "materials", label: "학습 자료" },
  { slug: "parents", label: "학부모 소통" },
  { slug: "other", label: "기타" },
] as const;

export const PROMPT_CATEGORIES = [
  { slug: "lesson-prep", label: "수업 준비" },
  { slug: "evaluation", label: "평가" },
  { slug: "class-mgmt", label: "학급 관리" },
  { slug: "self-dev", label: "자기계발" },
  { slug: "parent-comm", label: "학부모 소통" },
  { slug: "other", label: "기타" },
] as const;

export const REGIONS = [
  "서울", "부산", "대구", "인천", "광주", "대전", "울산", "세종",
  "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남",
  "제주",
] as const;

export const TEACHER_LEVELS = [
  { value: "preschool", label: "유치원" },
  { value: "elementary", label: "초등학교" },
  { value: "middle", label: "중학교" },
  { value: "high", label: "고등학교" },
  { value: "special", label: "특수학교" },
  { value: "other", label: "기타" },
] as const;
