import { z } from "zod";

// ---- Common ----
export const emailSchema = z
  .string()
  .min(5, "이메일을 입력하세요")
  .email("올바른 이메일을 입력하세요")
  .max(254);

export const passwordSchema = z
  .string()
  .min(12, "비밀번호는 최소 12자 이상이어야 합니다")
  .max(128)
  .refine((v) => /[a-zA-Z]/.test(v), "영문을 포함해야 합니다")
  .refine((v) => /[0-9]/.test(v), "숫자를 포함해야 합니다");

export const usernameSchema = z
  .string()
  .min(2, "2자 이상")
  .max(20, "20자 이하")
  .regex(/^[a-zA-Z0-9_가-힣]+$/u, "영문·숫자·한글·밑줄만 허용");

// ---- Auth ----
export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  username: usernameSchema,
  displayName: z.string().min(1).max(50),
  agreeTerms: z
    .boolean()
    .refine((v) => v === true, { message: "약관에 동의해주세요" }),
});
export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "비밀번호를 입력하세요"),
  rememberMe: z.boolean().optional(),
});
export type SignInInput = z.infer<typeof signInSchema>;

export const forgotPasswordSchema = z.object({ email: emailSchema });
export const resetPasswordSchema = z.object({
  token: z.string().min(10),
  password: passwordSchema,
});

// ---- Teacher verification ----
export const teacherVerifySchema = z.object({
  method: z.enum(["document", "school_email", "official_cert"]),
  teacherLevel: z.enum(["preschool", "elementary", "middle", "high", "special", "other"]),
  schoolName: z.string().min(2).max(80),
  schoolRegion: z.string().min(1).max(20),
  subject: z.string().max(40).optional(),
  yearsOfTeaching: z.number().int().min(0).max(60).optional(),
  schoolEmail: emailSchema.optional(),
  documentUrl: z.string().url().optional(),
  documentHash: z.string().optional(),
});

// ---- Posts ----
export const postCreateSchema = z.object({
  categoryId: z.number().int().positive(),
  title: z.string().min(2, "제목 2자 이상").max(200),
  content: z.string().min(1, "내용을 입력하세요"),
  contentText: z.string().min(1).max(40_000),
  excerpt: z.string().max(300).optional(),
  coverImageUrl: z.string().url().optional(),
  tags: z.array(z.string().min(1).max(30)).max(8).default([]),
  isAnonymous: z.boolean().default(false),
  status: z.enum(["draft", "published"]).default("published"),
});
export type PostCreateInput = z.infer<typeof postCreateSchema>;

export const postUpdateSchema = postCreateSchema.partial();

// ---- Comments ----
export const commentCreateSchema = z.object({
  postId: z.string().min(1),
  parentId: z.string().nullish(),
  content: z.string().min(1).max(5000),
  isAnonymous: z.boolean().default(false),
});

// ---- Votes & reactions ----
export const voteSchema = z.object({
  targetType: z.enum(["post", "comment"]),
  targetId: z.string().min(1),
  vote: z.enum(["up", "down"]).nullable(),
});

export const reactionSchema = z.object({
  targetType: z.enum(["post", "comment"]),
  targetId: z.string().min(1),
  reaction: z.enum(["like", "thanks", "insightful", "agree", "surprise"]),
});

// ---- Showcase ----
export const showcaseCreateSchema = z.object({
  name: z.string().min(2).max(60),
  tagline: z.string().min(10).max(120),
  description: z.string().min(50).max(5000),
  category: z.string().min(1).max(40),
  tags: z.array(z.string()).max(10).default([]),
  logoUrl: z.string().url().optional(),
  coverUrl: z.string().url().optional(),
  screenshots: z.array(z.string().url()).min(3).max(10),
  videoUrl: z.string().url().optional(),
  websiteUrl: z.string().url(),
  githubUrl: z.string().url().optional(),
  appStoreUrl: z.string().url().optional(),
  playStoreUrl: z.string().url().optional(),
  pricingModel: z.enum(["free", "freemium", "paid", "open_source"]),
  pricingDetails: z.string().max(500).optional(),
  techStack: z.array(z.string()).max(20).default([]),
  buildStory: z.string().max(10_000).optional(),
  targetUser: z.string().max(120).optional(),
  problemStatement: z.string().max(500).optional(),
  solutionStatement: z.string().max(500).optional(),
  mrrVisible: z.boolean().default(false),
  mrrUsd: z.number().int().min(0).max(1_000_000).optional(),
});

// ---- Prompts ----
export const promptCreateSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(500),
  content: z.string().min(50).max(20_000),
  category: z.string().min(1).max(40),
  tags: z.array(z.string()).max(10).default([]),
  targetModel: z.string().min(1).max(40),
  useCase: z.string().max(200).optional(),
  exampleInput: z.string().max(5000).optional(),
  exampleOutput: z.string().max(5000).optional(),
  isPublic: z.boolean().default(true),
});

// ---- Profile ----
export const profileUpdateSchema = z.object({
  displayName: z.string().min(1).max(50).optional(),
  bio: z.string().max(500).optional(),
  avatarUrl: z.string().url().optional(),
  coverUrl: z.string().url().optional(),
  subject: z.string().max(40).optional(),
  yearsOfTeaching: z.number().int().min(0).max(60).optional(),
  techStack: z.array(z.string()).max(20).optional(),
  websiteUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  linkedinUrl: z.string().url().optional(),
});

// ---- Report ----
export const reportCreateSchema = z.object({
  targetType: z.enum(["post", "comment", "user", "product", "message"]),
  targetId: z.string().min(1),
  reason: z.enum(["spam", "abuse", "inappropriate", "misinformation", "copyright", "other"]),
  details: z.string().max(1000).optional(),
});
